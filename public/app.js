const api = "/api/tasks";
const tableBody = document.getElementById("taskTableBody");
const form = document.getElementById("taskForm");
const createBtn = document.getElementById("createBtn");
const cancelBtn = document.getElementById("cancel");

let editingId = null;

createBtn.onclick = () => {
  form.classList.remove("hidden");
};

cancelBtn.onclick = () => {
  editingId = null;
  form.reset();
  form.classList.add("hidden");
};

form.onsubmit = async (e) => {
  e.preventDefault();

  const task = {
    title: document.getElementById("title").value,
    dueDate: document.getElementById("dueDate").value,
    priority: document.getElementById("priority").value,
  };

  if (editingId) {
    await fetch(`${api}/${editingId}`, {
      method: "PUT",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify(task)
    });
  } else {
    await fetch(api, {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify(task)
    });
  }

  editingId = null;
  form.reset();
  form.classList.add("hidden");
  loadTasks();
};

async function loadTasks() {
  const res = await fetch(api);
  const tasks = await res.json();
  tableBody.innerHTML = "";
  
  tasks.forEach(task => {
    const row = `
      <tr>
        <td>${task.title}</td>
        <td>${task.dueDate || "-"}</td>
        <td>${task.priority}</td>
        <td>
          <button onclick="editTask('${task.id}')">Edit</button>
          <button onclick="deleteTask('${task.id}')">Delete</button>
        </td>
      </tr>
    `;
    tableBody.innerHTML += row;
  });
}

async function deleteTask(id) {
  await fetch(`${api}/${id}`, { method: "DELETE" });
  loadTasks();
}

async function editTask(id) {
  const res = await fetch(`${api}/${id}`);
  const task = await res.json();

  document.getElementById("title").value = task.title;
  document.getElementById("dueDate").value = task.dueDate;
  document.getElementById("priority").value = task.priority;

  editingId = id;
  form.classList.remove("hidden");
}

loadTasks();
