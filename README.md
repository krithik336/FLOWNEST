
<div align="center">

<br/>

```
 ███████╗██╗      ██████╗ ██╗    ██╗███╗   ██╗███████╗███████╗████████╗
 ██╔════╝██║     ██╔═══██╗██║    ██║████╗  ██║██╔════╝██╔════╝╚══██╔══╝
 █████╗  ██║     ██║   ██║██║ █╗ ██║██╔██╗ ██║█████╗  ███████╗   ██║   
 ██╔══╝  ██║     ██║   ██║██║███╗██║██║╚██╗██║██╔══╝  ╚════██║   ██║   
 ██║     ███████╗╚██████╔╝╚███╔███╔╝██║ ╚████║███████╗███████║   ██║   
 ╚═╝     ╚══════╝ ╚═════╝  ╚══╝╚══╝ ╚═╝  ╚═══╝╚══════╝╚══════╝   ╚═╝   
```

### Project Management & Collaboration Tool

> *"Where teams flow, and ideas nest."*

<br/>

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/atlas)
[![License](https://img.shields.io/badge/License-Educational-blue?style=for-the-badge)](LICENSE)

<br/>

[**Report Bug**](https://github.com/krithik336/flownest/issues) · [**Request Feature**](https://github.com/krithik336/flownest/issues)

</div>

---

## Overview

**FlowNest** is a full-stack, premium SaaS-grade project management and collaboration platform. Built with **React 19 + Vite** on the frontend and **Node.js + Express + MongoDB Atlas** on the backend, FlowNest brings together workspaces, task tracking, real-time analytics, and a fully interactive Kanban board under a sleek, dark-green glassmorphism UI.

Engineered for performance and developer credibility, FlowNest demonstrates production-level architecture including JWT auth flows, optimistic UI updates, drag-and-drop interactions, and resilient client-side data fallbacks.

<br/>

## Features

| Feature | Description |
|---|---|
| 🔒 **JWT Authentication** | Secure registration and login with session recovery and auto-redirect on token expiry |
| 📊 **Analytics Dashboard** | Real-time stats widgets and project progress charts via Recharts with client-side fallback |
| 🗂️ **Workspaces & Projects** | Full project tracking with descriptions, deadlines, progress bars, and custom search/status filters |
| 📋 **Task Management** | Interactive task tables with filters by priority, status, and project |
| 🛹 **Dynamic Kanban Board** | Drag & drop + keyboard/mobile chevron support with optimistic UI state updates |
| 🎨 **Premium Dark UI** | Custom scrollbars, Google Fonts (Outfit & Plus Jakarta Sans), backdrop blurs, and glassmorphism |

<br/>

## Tech Stack

```
┌──────────────────────────────────────────────────────────────┐
│                         FLOWNEST                             │
├─────────────────────────┬────────────────────────────────────┤
│       FRONTEND          │            BACKEND                 │
├─────────────────────────┼────────────────────────────────────┤
│  React 19 (Vite)        │  Node.js & Express                 │
│  Tailwind CSS v4        │  MongoDB Atlas                     │
│  React Router           │  Mongoose                          │
│  Context API            │  JWT + bcrypt                      │
│  Recharts               │                                    │
│  Lucide React           │                                    │
│  Axios + Interceptors   │                                    │
└─────────────────────────┴────────────────────────────────────┘
```

<br/>

## Project Structure

```bash
flownest/
│
├── 📁 frontend/                  # React (Vite) frontend application
│   ├── 📁 src/
│   │   ├── 📁 api/               # Axios config & API endpoint definitions
│   │   ├── 📁 components/        # Layout elements — Navbar, Sidebar, Modals, Toast
│   │   ├── 📁 context/           # Auth & Toast context providers
│   │   └── 📁 pages/             # Dashboard, Kanban, Projects, Tasks, Auth pages
│   └── 📄 index.html
│
└── 📁 backend/                   # Express REST API server
    ├── 📁 controllers/           # Route controllers — Auth, Dashboard, Project, Task
    ├── 📁 models/                # Mongoose schemas — User, Project, Task
    ├── 📁 routes/                # Express route definitions
    └── 📄 server.js              # API entry point
```

<br/>

## Getting Started

### Prerequisites

- **Node.js** v18+ — [Download](https://nodejs.org/)
- **MongoDB Atlas** account — [Get Started](https://www.mongodb.com/atlas)

---

### 1. Clone the Repository

```bash
git clone https://github.com/krithik336/flownest.git
cd flownest
```

### 2. Configure Environment Variables

Create a `.env` file inside the `/backend` directory:

```env
# ──────────────────────────────────
#  FlowNest – Backend Environment
# ──────────────────────────────────

MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secure_jwt_secret
PORT=5000
```

> ⚠️ **Never commit your `.env` file.** It is already listed in `.gitignore`.

---

### 3. Start the Backend

```bash
cd backend
npm install
node server.js
```

> Backend runs at `http://localhost:5000`

---

### 4. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

> Frontend runs at `http://localhost:5173`

<br/>

## API Overview

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Authenticate and receive JWT |
| `GET` | `/api/dashboard` | Fetch dashboard stats |
| `GET` | `/api/projects` | List all projects |
| `POST` | `/api/projects` | Create a new project |
| `GET` | `/api/tasks` | List all tasks |
| `PUT` | `/api/tasks/:id` | Update task status or details |

<br/>

## Roadmap

- [ ] **Team Collaboration** — Invite members to workspaces and assign tasks
- [ ] **Notifications System** — Real-time in-app alerts and deadline reminders
- [ ] **Rich Text Task Descriptions** — WYSIWYG editor for detailed task notes
- [ ] **Time Tracking** — Log hours spent per task and project
- [ ] **Export Reports** — Download project reports as PDF or CSV
- [ ] **Dark / Light Mode Toggle** — Full theme switching support
- [ ] **Mobile App** — React Native companion app

<br/>

## Author

<div align="center">

**Kirthik**

[![GitHub](https://img.shields.io/badge/GitHub-krithik336-181717?style=for-the-badge&logo=github)](https://github.com/krithik336)

*Built with passion, designed for productivity.*

</div>

---

<div align="center">

**If you find this project useful, consider giving it a ⭐ — it means a lot!**

<br/>

*© 2024 FlowNest · Developed for educational and learning purposes*

</div>
