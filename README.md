<p align="center">
  <img src="public/logo.png" width="180" alt="TaskFlow Logo">
</p>

<h2 align="center">TaskFlow</h2>
<p align="center">A simple and functional web-based task manager built with Node.js, Express, and LowDB.</p>

---

## 📌 Overview

TaskFlow is a lightweight task management web application designed to help users easily create, view, update, and delete tasks. This first release focuses on core CRUD (Create, Read, Update, Delete) functionality.

The landing page displays the project name, a custom team logo, a button to add tasks, and a table listing existing tasks.

This release represents the foundation for future improvements such as sorting, filtering, authentication, and notifications.

---

## 🚀 Features

| Feature | Status |
|--------|--------|
| Landing Page | ✔ |
| Custom Team Logo | ✔ |
| Create Tasks | ✔ |
| View Tasks in Table | ✔ |
| Edit Tasks | ✔ |
| Delete Tasks | ✔ |
| API with JSON Storage (LowDB) | ✔ |
| Deployment | ✔ |

---

## 🛠️ Tech Stack

- Node.js  
- Express.js  
- LowDB  
- HTML / CSS / JavaScript  
- Git + GitHub  
- Cloud Hosting (Railway / Render / Vercel – depending on deployment)

---

## ▶️ Running the Project Locally

1. Clone the repository:

```
bash
git clone https://github.com/YOUR-USERNAME/INFR3120-Fall25-Project.git
=======
# INFR3120-Fall25-Project
To-Do Task Manager - First Release
>>>>>>> 9042304a0a843ed3a39c4afab973f89388a7e8ea
```

---

## Frontend Overview (By Shayaan)

The frontend for TaskFlow is built using **HTML**, **CSS**, and **JavaScript**. It provides users with a simple interface to manage tasks through CRUD interactions.

Key features implemented on the frontend:
- Responsive landing page with the TaskFlow logo, title, and main action button.
- Clean task table that lists all tasks retrieved from the backend API.
- Visual priority badges with different colours for Low, Medium, and High priorities.
- Hover effects on table rows for a more visually appealing user experience.
- JavaScript functions that interact with the backend API to create, update, and delete tasks.
- User input validation to prevent creating tasks with empty names.
- Footer section for branding and project information.

The **script.js** file manages all real-time interactions between the user interface and the backend API which ensures that all users can easily modify their tasks.