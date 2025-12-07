# INFR3120 – Project Part III  
## Task Management Web Application

### Group Project – Final Release

---

## 📌 Project Description
This project is a **Task Management Web Application** developed for **INFR3120 – Web and Scripting Programming**. The application allows users to view tasks and, once authenticated, create, edit, and delete tasks. The final release demonstrates the use of an **Angular frontend**, a **Node.js/Express backend**, and cloud deployment.

---

## 🛠️ Technologies Used

### Frontend
- Angular (Standalone Components)
- HTML & CSS
- Angular Routing
- Angular HttpClient

### Backend
- Node.js
- Express.js
- LowDB (JSON-based database)
- express-session (authentication)
- bcryptjs (password hashing)

### Deployment
- Render (Backend and Frontend)

---

## ✅ Features
- View all tasks
- Create tasks (login required)
- Edit tasks (login required)
- Delete tasks (login required)
- User authentication (register, login, logout)
- Persistent storage using LowDB
- RESTful API communication
- Angular component-based architecture

---

## 🌐 Live Deployment
https://infr3120-fall25-project-e8ou.onrender.com

---

## ▶️ How to Run Locally

### 1. Install dependencies

```bash
npm install

2. Start the backend server

node index.js

Server runs at:

http://localhost:3000

3. Run Angular separately (optional)

cd frontend
ng serve --proxy-config proxy.conf.json

Angular runs at:

http://localhost:4200

📁 Project Structure (Simplified)

INFR3120-Fall25-Project
 ├─ index.js
 ├─ db.json
 ├─ package.json
 ├─ public/          (Angular production build)
 │   ├─ index.html
 │   ├─ main-*.js
 │   ├─ styles-*.css
 └─ frontend/        (Angular source code)

📹 Demo Video

A demonstration video explaining the application functionality and code has been recorded. The video link is provided in the Canvas submission comments.
👥 Group Contribution

This was a group project. Each group member contributed code using their own GitHub account, and contributions are visible in the GitHub commit history.
📄 Academic Honesty Statement

All work submitted for this project is our own. Lecture materials were used where applicable. No external code beyond allowed limits was used without understanding or attribution.