import express from "express";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import bodyParser from "body-parser";
import { nanoid } from "nanoid";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Database setup
const file = path.join(__dirname, "db.json");
const adapter = new JSONFile(file);
const db = new Low(adapter, { tasks: [] });

await db.read();
db.data ||= { tasks: [] };
await db.write();

app.use(bodyParser.json());
app.use(express.static("public"));

// Helper: format date to YYYY-MM-DD
function formatDate(date) {
  return date.toISOString().split("T")[0];
}

// Get all tasks
app.get("/api/tasks", async (req, res) => {
  await db.read();
  res.json(db.data.tasks);
});

// Create a task (priority validation + default due date)
app.post("/api/tasks", async (req, res) => {
  const { title, dueDate, priority } = req.body;

  // Priority validation
  const validPriorities = ["Low", "Medium", "High"];
  const safePriority = validPriorities.includes(priority)
    ? priority
    : "Medium";

  // Default due date: today if none entered
  const safeDueDate = dueDate && dueDate.trim() !== ""
    ? dueDate
    : formatDate(new Date());

  const newTask = {
    id: nanoid(6),
    title,
    dueDate: safeDueDate,
    priority: safePriority,
    createdAt: new Date().toISOString()
  };

  db.data.tasks.push(newTask);
  await db.write();

  res.status(201).json(newTask);
});

// Update task
app.put("/api/tasks/:id", async (req, res) => {
  await db.read();

  const task = db.data.tasks.find((t) => t.id === req.params.id);
  if (!task) return res.status(404).json({ error: "Task not found" });

  const updated = req.body;

  // Validate priority on edit
  if (updated.priority) {
    const validPriorities = ["Low", "Medium", "High"];
    updated.priority = validPriorities.includes(updated.priority)
      ? updated.priority
      : task.priority;
  }

  // Auto-assign today's date if dueDate is empty on edit
  if (updated.dueDate === "") {
    updated.dueDate = formatDate(new Date());
  }

  Object.assign(task, updated);
  await db.write();

  res.json(task);
});

// Delete task
app.delete("/api/tasks/:id", async (req, res) => {
  await db.read();

  db.data.tasks = db.data.tasks.filter((t) => t.id !== req.params.id);
  await db.write();

  res.json({ message: "Task deleted" });
});

// Serve frontend
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
