<p align="center">
  <img src="public/logo.png" width="160" alt="TaskFlow Logo">
</p>

<h2 align="center">TaskFlow</h2>
<p align="center">A simple task manager built with Node.js, Express, LowDB, and a lightweight frontend.</p>

---

## Overview
TaskFlow is a basic CRUD web application that allows users to create, view, edit, and delete tasks.  
The goal of this first release is to demonstrate a functional full-stack workflow using a backend API and a simple user interface.

The application includes:
- A landing page with logo and project title  
- A button to add new tasks  
- A table listing existing tasks  
- Full Create, Read, Update, and Delete support  

Deployment is done on Render for public access.

---

## Features
- Add tasks with priority and due date  
- Edit and delete existing tasks  
- Table view of all tasks  
- Priority colour badges  
- Hover effects and basic UI styling  
- JSON-based storage using LowDB  

---

## Tech Stack
- Node.js & Express  
- LowDB (JSON database)  
- HTML / CSS / JavaScript  
- Render (deployment)  

---

## Running the Project

npm install
npm start


The app runs at:

http://localhost:3000

---

## Frontend (By Shayaan)
- Designed the landing page and table layout  
- Added hover effects and coloured priority badges  
- Implemented JavaScript to call the backend API  
- Added simple client-side validation  
- Created the team logo and footer  

---

## Backend (By Malachi)
- Built full CRUD API using Express  
- Added priority validation (“Low”, “Medium”, “High”)  
- Added automatic default due date (today’s date if blank)  
- Added route to fetch a single task by ID  
- Connected LowDB for JSON storage  
- Set up deployment and static file hosting  

---

## External Code Used (Under 10% Rule)
TaskFlow uses a small amount of external code as allowed by the course guidelines:

1. **LowDB Initialization Example**  
   *Source:* LowDB Documentation  
   *Author:* Sindre Sorhus & LowDB Team  
   *URL:* https://github.com/typicode/lowdb  
   *Usage:* Used as reference for creating the LowDB adapter and initializing the JSON database.

2. **Express Static File Serving Pattern**  
   *Source:* Express.js Documentation  
   *URL:* https://expressjs.com/en/starter/static-files.html  
   *Usage:* Used for serving files from the `public` directory.

All external code is used within the 10% limit, understood fully, and documented with inline comments.

---

## Contributors
| Name | Role |
|------|------|
| **Malachi Rewane** | Backend development & deployment |
| **Shayaan Qureshi** | Frontend UI & interactions |