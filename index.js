import express from "express";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import bodyParser from "body-parser";
import { nanoid } from "nanoid";
import path from "path";
import { fileURLToPath } from "url";

// Fix for __dirname when using ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Setting up LowDB (JSON database stored in db.json)
const file = path.join(__dirname, "db.json");
const adapter = new JSONFile(file);
const db = new Low(adapter, { tasks: [] });

await db.read();
db.data ||= { tasks: [] };
await db.write();

app.use(bodyParser.json());
// Expose everything inside /public as static frontend files
app.use(express.static("public"));

// Small helper to format date as YYYY-MM-DD
function formatDate(date) {
  return date.toISOString().split("T")[0];
}

// Return all tasks
app.get("/api/tasks", async (req, res) => {
  await db.read();
  res.json(db.data.tasks);
});

// Return a single task by ID
app.get("/api/tasks/:id", async (req, res) => {
  await db.read();
  const task = db.data.tasks.find((t) => t.id === req.params.id);

  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  res.json(task);
});

// Create a task (with basic validation)
app.post("/api/tasks", async (req, res) => {
  const { title, dueDate, priority } = req.body;

  // Make sure priority is valid; if not, default to Medium
  const validPriorities = ["Low", "Medium", "High"];
  const safePriority = validPriorities.includes(priority)
    ? priority
    : "Medium";

  // If user didn’t give a due date, we set it to today
  const safeDueDate =
    dueDate && dueDate.trim() !== ""
      ? dueDate
      : formatDate(new Date());

  // Each task gets a unique id
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

// Update an existing task
app.put("/api/tasks/:id", async (req, res) => {
  await db.read();

  const task = db.data.tasks.find((t) => t.id === req.params.id);
  if (!task) return res.status(404).json({ error: "Task not found" });

  const updated = req.body;

  // Validate priority on update as well
  if (updated.priority) {
    const validPriorities = ["Low", "Medium", "High"];
    updated.priority = validPriorities.includes(updated.priority)
      ? updated.priority
      : task.priority;
  }

  // If due date was cleared, set it to today’s date
  if (updated.dueDate === "") {
    updated.dueDate = formatDate(new Date());
  }

  Object.assign(task, updated);
  await db.write();

  res.json(task);
});

// Delete a task using its id
app.delete("/api/tasks/:id", async (req, res) => {
  await db.read();

  db.data.tasks = db.data.tasks.filter((t) => t.id !== req.params.id);
  await db.write();

  res.json({ message: "Task deleted" });
});

// Serve the frontend homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
