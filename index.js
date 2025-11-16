import express from "express";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import bodyParser from "body-parser";
import { nanoid } from "nanoid";
import path from "path";
import { fileURLToPath } from "url";

// Fix __dirname in ES module mode
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// --- Database Setup ---
const file = path.join(__dirname, "db.json");
const adapter = new JSONFile(file);
const db = new Low(adapter, { tasks: [] });

await db.read();
db.data ||= { tasks: [] };
await db.write();

// Middleware
app.use(bodyParser.json());
app.use(express.static("public"));

// --- API Routes ---

// Get all tasks
app.get("/api/tasks", async (req, res) => {
  await db.read();
  res.json(db.data.tasks);
});

// Create a task
app.post("/api/tasks", async (req, res) => {
  const { title, dueDate, priority } = req.body;

  const newTask = {
    id: nanoid(6),
    title,
    dueDate,
    priority,
    createdAt: new Date().toISOString(),
  };

  db.data.tasks.push(newTask);
  await db.write();

  res.status(201).json(newTask);
});

// Update a task
app.put("/api/tasks/:id", async (req, res) => {
  const task = db.data.tasks.find((t) => t.id === req.params.id);

  if (!task) return res.status(404).json({ error: "Task not found" });

  Object.assign(task, req.body);
  await db.write();

  res.json(task);
});

// Delete a task
app.delete("/api/tasks/:id", async (req, res) => {
  db.data.tasks = db.data.tasks.filter((t) => t.id !== req.params.id);
  await db.write();

  res.json({ message: "Task deleted" });
});

// Serve frontend
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

// Start server
app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);
