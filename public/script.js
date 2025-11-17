// Load and display all tasks
async function loadTasks() {
  const res = await fetch("/api/tasks");
  const tasks = await res.json();

  const table = document.getElementById("taskTable");
  table.innerHTML = "";

  tasks.forEach(task => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${task.title}</td>
      <td>
        <span class="priority-badge ${task.priority?.toLowerCase()}">${task.priority}</span>
      </td>
      <td>${task.dueDate || "None"}</td>
      <td>
        <button onclick="editTask('${task.id}')">Edit</button>
        <button onclick="deleteTask('${task.id}')">Delete</button>
      </td>
    `;

    table.appendChild(row);
  });
}

// Create a new task
async function openTaskForm() {
  let title = prompt("Enter task name:");
  while (!title || title.trim() === "") {
    title = prompt("Task name cannot be empty.\nPlease enter a valid task name:");
  }

  const priority = prompt("Enter priority (Low, Medium, High):");
  const dueDate = prompt("Enter due date (YYYY-MM-DD):");

  await fetch("/api/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, priority, dueDate })
  });

  loadTasks();
}

// Delete a task
async function deleteTask(id) {
  await fetch(`/api/tasks/${id}`, { method: "DELETE" });
  loadTasks();
}

// Edit a task
async function editTask(id) {
  let title = prompt("New task name:");
  while (!title || title.trim() === "") {
    title = prompt("Task name cannot be empty.\nPlease enter a valid task name:");
  }

  const priority = prompt("New priority (Low, Medium, High):");
  const dueDate = prompt("New due date:");

  await fetch(`/api/tasks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, priority, dueDate })
  });

  loadTasks();
}

// Initialize
loadTasks();
