# 🧑‍💼 Role-Based Employee Management System

A full-stack **Role-Based Employee Management System** using:

- 🔙 **Backend**: Node.js, Express.js, MySQL (using raw SQL queries, no ORM)
- 🎯 **Frontend**: React (Vite) + Tailwind CSS
- 👥 Roles: **Manager** and **Employee**

---

## 📸 Features

### ✅ Manager
- Register & Login
- Create, Read, Update, Delete (CRUD) employees
- Pagination and search functionality

### ✅ Employee
- Login
- View assigned Manager details

> Screenshots:
> - 🖼️ Manager Register & Login
> - 🖼️ CRUD Operations on Employees
> - 🖼️ Employee Dashboard with Manager Info

---

## 🏁 Getting Started

### ⚙️ Backend Setup

```bash
# Step 1: Install dependencies
cd Backend
npm install
npm start

### ⚙️ Frontend Setup
cd employee
npm install
npm run dev

database no orm using here .

create database Employee;

use Employee;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255),
    role ENUM('manager', 'employee'),
    manager_id INT DEFAULT NULL,
    FOREIGN KEY (manager_id) REFERENCES users(id) ON DELETE SET NULL
);
















