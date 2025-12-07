import express from "express";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import bodyParser from "body-parser";
import { nanoid } from "nanoid";
import path from "path";
import { fileURLToPath } from "url";
import session from "express-session";
import bcrypt from "bcryptjs";
import cors from "cors";

// --------------------
// SETUP
// --------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// --------------------
// MIDDLEWARE
// --------------------
app.use(cors({
  origin: true,
  credentials: true,
}));

app.use(bodyParser.json());

app.use(
  session({
    secret: "taskflow-session-secret",
    resave: false,
    saveUninitialized: false,
  })
);

// --------------------
// DATABASE (LowDB)
// --------------------
const adapter = new JSONFile(path.join(__dirname, "db.json"));
const db = new Low(adapter, { tasks: [], users: [] });

await db.read();
if (!db.data) db.data = { tasks: [], users: [] };
if (!db.data.tasks) db.data.tasks = [];
if (!db.data.users) db.data.users = [];

// --------------------
// AUTH HELPER
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
    return res.status(400).json({ error: "Missing fields" });
  }
  if (confirmPassword && password !== confirmPassword) {
    return res.status(400).json({ error: "Passwords do not match" });
  }

  await db.read();
  const exists = db.data.users.find(
    (u) => u.email === email.toLowerCase()
  );

  if (exists) {
    return res.status(400).json({ error: "Email already exists" });
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

  await db.read();
  const user = db.data.users.find(
    (u) => u.email === email.toLowerCase()
  );

  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    return res.status(400).json({ error: "Invalid login" });
  }

  req.session.userId = user.id;
  res.json({ id: user.id, email: user.email });
});

app.post("/auth/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.json({ message: "Logged out" });
  });
});

app.get("/auth/me", async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Not logged in" });
  }

  await db.read();
  const user = db.data.users.find(
    (u) => u.id === req.session.userId
  );

  if (!user) {
    return res.status(401).json({ error: "Not logged in" });
  }

  res.json({ id: user.id, email: user.email });
});

// --------------------
// TASK ROUTES
// --------------------
app.get("/api/tasks", async (req, res) => {
  await db.read();
  res.json(db.data.tasks);
});

app.post("/api/tasks", requireLogin, async (req, res) => {
  const { title, priority, dueDate } = req.body;

  const task = {
    id: nanoid(6),
    title,
    priority,
    dueDate,
  };

  db.data.tasks.push(task);
  await db.write();

  res.status(201).json(task);
});

app.put("/api/tasks/:id", requireLogin, async (req, res) => {
  await db.read();
  const task = db.data.tasks.find((t) => t.id === req.params.id);
  if (!task) return res.status(404).json({ error: "Not found" });

  task.title = req.body.title;
  task.priority = req.body.priority;
  task.dueDate = req.body.dueDate;

  await db.write();
  res.json(task);
});

app.delete("/api/tasks/:id", requireLogin, async (req, res) => {
  await db.read();
  db.data.tasks = db.data.tasks.filter(
    (t) => t.id !== req.params.id
  );
  await db.write();

  res.json({ message: "Deleted" });
});

// --------------------
// ANGULAR FRONTEND
// --------------------
app.use(express.static("public"));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// --------------------
// START SERVER
// --------------------
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
