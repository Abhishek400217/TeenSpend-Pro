<h1 align="center">
  💰 TeenSpend Pro
</h1>

<h3 align="center">
Smart Personal Finance Management Platform for Students & Young Professionals
</h3>

<p align="center">
Take control of your finances with a modern, secure and intelligent expense management platform built using React, Spring Boot and MySQL.
</p>

<p align="center">

<a href="https://teenspend-pro.vercel.app">
<img src="https://img.shields.io/badge/🚀%20Live%20Demo-Visit%20Now-6C63FF?style=for-the-badge">
</a>

<a href="https://github.com/Abhishek400217/TeenSpend-Pro">
<img src="https://img.shields.io/github/stars/Abhishek400217/TeenSpend-Pro?style=for-the-badge">
</a>

<img src="https://img.shields.io/badge/Status-Production%20Ready-success?style=for-the-badge">

<img src="https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react&logoColor=white">

<img src="https://img.shields.io/badge/Backend-Spring%20Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white">

<img src="https://img.shields.io/badge/Database-MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white">

</p>

---

## 🌐 Live Demo

🚀 **Frontend:** https://teenspend-pro.vercel.app/

📦 **Repository:** https://github.com/Abhishek400217/TeenSpend-Pro

---
# 📖 About TeenSpend Pro

TeenSpend Pro is a modern **full-stack personal finance management platform** built to help students and young professionals take control of their finances.

The application enables users to securely manage daily expenses, monitor subscriptions, create savings goals, analyze spending patterns, and improve financial habits through an intuitive dashboard and real-time analytics.

Designed with a production-ready architecture, TeenSpend Pro combines a responsive React frontend, a secure Spring Boot backend, JWT-based authentication, and a cloud-hosted MySQL database to deliver a smooth and reliable user experience.

This project was developed as a **Final Year Project**, while also serving as a **Portfolio Project**, **Resume Project**, and a practical learning experience in building, deploying, and maintaining real-world full-stack applications.

---

# ✨ Key Features

### 🔐 Authentication & Security

- Secure User Registration & Login
- JWT Authentication
- BCrypt Password Encryption
- Protected Routes
- Persistent User Sessions
- Secure REST APIs

---

### 💸 Expense Management

- Add & Manage Expenses
- Expense Categories
- Expense History
- Budget Tracking
- Spending Overview

---

### 🎯 Savings Goals

- Create Financial Goals
- Add Funds to Goals
- Goal Progress Tracking
- Savings Monitoring

---

### 💳 Subscription Management

- Track Monthly Subscriptions
- Yearly Cost Projection
- Active Subscription Status
- Subscription Cost Breakdown

---

### 📊 Financial Analytics

- Interactive Dashboard
- Spending Trend Charts
- Category-wise Analytics
- Financial Score
- Budget Overview
- Monthly Insights

---

### 🤖 AI Coach

- Smart Financial Recommendations
- Budget Awareness
- Spending Insights
- Money Saving Suggestions

---

### 📅 Calendar Integration

- Monthly Expense Calendar
- Expense Timeline
- Easy Financial Planning

---

### 👤 User Profile

- Personal Financial Overview
- Password Management
- Export Reports
- Account Management

---

# 🎯 Why TeenSpend Pro?

Managing personal finances can be difficult, especially for students and young professionals who are just beginning their financial journey.

TeenSpend Pro simplifies money management by providing a single platform to:

- Track daily expenses
- Monitor subscriptions
- Build healthy saving habits
- Visualize spending trends
- Stay within budget
- Make smarter financial decisions

The goal is to transform financial management into a simple, insightful, and engaging experience.
# 🛠️ Tech Stack

## 🎨 Frontend

| Technology | Purpose |
|------------|---------|
| ⚛️ React.js | User Interface |
| ⚡ Vite | Fast Development Environment |
| 🎨 Tailwind CSS | Responsive UI Design |
| 🔀 React Router | Client-side Routing |
| 🌐 Axios | API Communication |

---

## ⚙️ Backend

| Technology | Purpose |
|------------|---------|
| ☕ Spring Boot | REST API Development |
| 🔐 Spring Security | Authentication & Authorization |
| 🪪 JWT | Secure User Authentication |
| 📦 Spring Data JPA | Database Operations |
| 🔨 Maven | Dependency Management |

---

## 🗄️ Database

| Technology | Purpose |
|------------|---------|
| 🐬 MySQL | Relational Database |

---

## ☁️ Deployment

| Platform | Purpose |
|----------|---------|
| ▲ Vercel | Frontend Hosting |
| 🚂 Railway | Backend Hosting |
| 🐬 Railway MySQL | Cloud Database |

---

## 🛠 Development Tools

- IntelliJ IDEA
- Visual Studio Code
- MySQL Workbench
- Git
- GitHub
- Postman

---
---

# 📁 Project Structure

```text
TeenSpend-Pro
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   └── App.jsx
│   └── package.json
│
├── backend/
│   ├── src/main/java
│   │   ├── config/
│   │   ├── controller/
│   │   ├── dto/
│   │   ├── entity/
│   │   ├── repository/
│   │   ├── security/
│   │   ├── service/
│   │   └── TeenSpendProApplication.java
│   │
│   └── resources/
│       ├── application.properties
│       └── static/
│
└── README.md
```

---

# 🗃️ Database Schema

The application currently uses the following database tables:

| Table | Description |
|--------|-------------|
| 👤 users | User account information |
| 💸 expenses | Expense records |
| 🎯 goals | Savings goals |
| 💳 subscriptions | Subscription management |
| 🔑 verification_otp | OTP verification records |

---

# 🔄 Application Workflow

```text
Register/Login
      │
      ▼
JWT Authentication
      │
      ▼
Dashboard
      │
 ┌────┼─────────────────────────────┐
 │    │            │                │
 ▼    ▼            ▼                ▼
Expenses Goals Subscriptions Analytics
 │    │            │                │
 └────┴────────────┴────────────────┘
              │
              ▼
      Financial Insights
              │
              ▼
       Better Money Habits
```
# 🚀 Getting Started

## Prerequisites

Make sure you have the following installed:

- Java 17+
- Maven
- Node.js (v18 or above)
- npm
- MySQL
- Git

---

# ⚙️ Installation

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/Abhishek400217/TeenSpend-Pro.git
cd TeenSpend-Pro
```

---

## 2️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend will run at:

```
http://localhost:5173
```

---

## 3️⃣ Backend Setup

```bash
cd backend
mvn spring-boot:run
```

Backend will run at:

```
http://localhost:8080
```

---

# 🔐 Environment Variables

Configure the following variables in your backend configuration:

```properties
DB_URL=your_database_url
DB_USERNAME=your_database_username
DB_PASSWORD=your_database_password

JWT_SECRET=your_jwt_secret

MAIL_USERNAME=your_email
MAIL_PASSWORD=your_app_password
```

---

# 🌐 Live Demo

### 🚀 Frontend

https://teenspend-pro.vercel.app/

### ⚙️ Backend API

https://teenspend-pro-production.up.railway.app

### 💻 GitHub Repository

https://github.com/Abhishek400217/TeenSpend-Pro

---

# 🔮 Future Enhancements

- Email OTP Verification
- Forgot Password
- Advanced AI Financial Coach
- Expense Prediction
- Savings Recommendations
- PDF Reports
- Mobile App
- Docker Support
- CI/CD Pipeline
- Admin Dashboard

---

# 💼 Resume Highlights

- Developed a production-ready full-stack finance management application.
- Implemented secure JWT Authentication with Spring Security.
- Used BCrypt for password encryption.
- Built RESTful APIs using Spring Boot.
- Integrated MySQL database with Spring Data JPA.
- Deployed frontend on Vercel and backend on Railway.
- Designed a responsive React.js user interface.
- Implemented expense tracking, savings goals, subscription management, and analytics dashboard.

---

# 🤝 Contributing

Contributions, issues, and feature requests are welcome.

If you'd like to improve TeenSpend Pro:

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to your branch
5. Open a Pull Request

---

# 👨‍💻 Developer

**Abhishek Karande**

🎓 B.Tech Information Technology

📌 Passionate Full-Stack Developer

🔗 GitHub: https://github.com/Abhishek400217

---

# ⭐ Support

If you found this project helpful, please consider giving it a **⭐ Star** on GitHub.

Your support motivates further development and improvements.

---

<p align="center">
  Made with ❤️ by <strong>Abhishek Karande</strong>
</p>
