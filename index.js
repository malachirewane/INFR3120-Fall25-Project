import express from "express";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import bodyParser from "body-parser";
import { nanoid } from "nanoid";
import path from "path";
import { fileURLToPath } from "url";
import session from "express-session";
import bcrypt from "bcryptjs";
import cors from "cors"; // ✅ ADD THIS

// __dirname support for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ FIX CORS SO ANGULAR CAN CALL YOUR API
app.use(cors({
  origin: "http://localhost:4200",
  credentials: true
}));

// --------------------
// LowDB SETUP
// --------------------
const adapter = new JSONFile(path.join(__dirname, "db.json"));
const db = new Low(adapter, { tasks: [], users: [] });

// Ensure db shape
await db.read();
if (!db.data) db.data = { tasks: [], users: [] };
if (!db.data.tasks) db.data.tasks = [];
if (!db.data.users) db.data.users = [];

// --------------------
// MIDDLEWARE
// --------------------
app.use(bodyParser.json());
app.use(
  session({
    // Hard-coded secret is fine for this project
    secret: "taskflow-session-secret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(express.static("public"));

// --------------------
// AUTH HELPERS
// --------------------
function requireLogin(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Not logged in" });
  }
  next();
}

// --------------------
// AUTH ROUTES
// --------------------
app.post("/auth/register", async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  if (confirmPassword && password !== confirmPassword) {
    return res.status(400).json({ error: "Passwords do not match." });
  }

  await db.read();
  const existing = db.data.users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );

  if (existing) {
    return res.status(400).json({ error: "Email is already registered." });
  }

  const user = {
    id: nanoid(),
    email: email.toLowerCase(),
    passwordHash: bcrypt.hashSync(password, 10),
  };

  db.data.users.push(user);
  await db.write();

  req.session.userId = user.id;
  res.json({ id: user.id, email: user.email });
});

app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  await db.read();
  const user = db.data.users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );

  if (!user) {
    return res.status(400).json({ error: "Invalid email or password." });
  }

  const ok = bcrypt.compareSync(password, user.passwordHash);
  if (!ok) {
    return res.status(400).json({ error: "Invalid email or password." });
  }

  req.session.userId = user.id;
  res.json({ id: user.id, email: user.email });
});

app.post("/auth/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ error: "Could not log out." });
    res.clearCookie("connect.sid");
    res.json({ message: "Logged out" });
  });
});

app.get("/auth/me", async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Not logged in" });
  }

  await db.read();
  const user = db.data.users.find((u) => u.id === req.session.userId);
  if (!user) {
    return res.status(401).json({ error: "Not logged in" });
  }

  res.json({ id: user.id, email: user.email });
});

// --------------------
// TASK API ROUTES
// --------------------

// Everyone can READ tasks
app.get("/api/tasks", async (req, res) => {
  await db.read();
  res.json(db.data.tasks);
});

// Only logged in can CREATE
app.post("/api/tasks", requireLogin, async (req, res) => {
  const { title, priority, dueDate } = req.body;

  const newTask = {
    id: nanoid(6),
    title,
    priority,
    dueDate,
  };

  db.data.tasks.push(newTask);
  await db.write();

  res.status(201).json(newTask);
});

// Read single task
app.get("/api/tasks/:id", async (req, res) => {
  await db.read();
  const task = db.data.tasks.find((t) => t.id === req.params.id);

  if (!task) return res.status(404).json({ error: "Task not found" });
  res.json(task);
});

// Update task (logged in)
app.put("/api/tasks/:id", requireLogin, async (req, res) => {
  await db.read();
  const task = db.data.tasks.find((t) => t.id === req.params.id);

  if (!task) return res.status(404).json({ error: "Task not found" });

  task.title = req.body.title;
  task.priority = req.body.priority;
  task.dueDate = req.body.dueDate;

  await db.write();
  res.json(task);
});

// Delete task (logged in)
app.delete("/api/tasks/:id", requireLogin, async (req, res) => {
  await db.read();
  db.data.tasks = db.data.tasks.filter((t) => t.id !== req.params.id);
  await db.write();

  res.json({ message: "Task deleted" });
});

// --------------------
// FRONTEND
// --------------------
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
