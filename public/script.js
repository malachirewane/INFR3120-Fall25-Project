// Fetch and load tasks when the page loads
document.addEventListener("DOMContentLoaded", loadTasks);

// Fetch tasks from the backend
async function loadTasks() {
  const res = await fetch("/api/tasks");
  const tasks = await res.json();
  
  const tableBody = document.getElementById("taskBody");
  tableBody.innerHTML = "";

  tasks.forEach(task => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${task.title}</td>
      <td>${task.dueDate || "N/A"}</td>
      <td>${task.priority || "Normal"}</td>
      <td class="actions">
        <button class="edit" onclick="editTask('${task.id}')">Edit</button>
        <button class="delete" onclick="deleteTask('${task.id}')">Delete</button>
      </td>
    `;

    tableBody.appendChild(row);
  });
}

// Open a prompt to create a task
async function openTaskForm() {
  const title = prompt("Enter task name:");
  if (!title) return;

  const dueDate = prompt("Enter due date (optional):");
  const priority = prompt("Priority? (Low, Medium, High)") || "Medium";

  await fetch("/api/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, dueDate, priority })
  });

  loadTasks();
}

// Edit task
async function editTask(id) {
  const newTitle = prompt("Enter new task title:");
  if (!newTitle) return;

  const newDate = prompt("Enter new due date (optional):");
  const newPriority = prompt("New priority? (Low, Medium, High)") || "Medium";

  await fetch(`/api/tasks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: newTitle, dueDate: newDate, priority: newPriority })
  });

  loadTasks();
}

// Delete task
async function deleteTask(id) {
  const confirmDelete = confirm("Are you sure you want to delete this task?");
  if (!confirmDelete) return;

  await fetch(`/api/tasks/${id}`, {
    method: "DELETE"
  });

  loadTasks();
}
