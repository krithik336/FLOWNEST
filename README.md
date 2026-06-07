
# 🪺 FlowNest

FlowNest is a modern, premium, and fully responsive **Project Management & Collaboration Tool** built with React 19, Vite, Tailwind CSS v4, Express, and MongoDB Atlas. 

Designed with a sleek, dark-green SaaS aesthetic, FlowNest offers workspaces, intuitive task tracking, visual progress analytics, and a keyboard-friendly interactive Kanban board.

---

## ✨ Features

- **🔒 Secure JWT Authentication**: Robust registration and login flows with automatic session recovery and auto-redirection on token expiry.
- **📊 Interactive Analytics Dashboard**: Real-time stats widgets and visual project progress charts (using Recharts) with resilient fallback to client-side data calculations.
- **🗂️ Workspaces & Projects**: Comprehensive project tracking with description cards, deadlines, progress bars, and custom search/status filters.
- **📋 Task Management**: Interactive task tables supporting filters by priority, status, and project.
- **🛹 Dynamic Kanban Board**:
  - Full Drag & Drop support to move tasks across statuses.
  - Keyboard & mobile chevrons for click-to-move access.
  - Optimistic UI state updates for a zero-latency feeling.
---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 (Vite)
- **Styling**: Tailwind CSS v4
- **State & Routing**: React Router, Context API
- **Charts**: Recharts
- **Icons**: Lucide React
- **HTTP Client**: Axios (with authorization header interceptors)

### Backend
- **Server**: Node.js & Express
- **Database**: MongoDB Atlas
- **Authentication**: JSON Web Tokens (JWT) & bcrypt hashing
- **Object Modeling**: Mongoose

---

## 📁 Repository Structure

```text
flownest/
├── frontend/             # React (Vite) frontend application
│   ├── src/
│   │   ├── api/          # Axios configurations and endpoints
│   │   ├── components/   # Layout elements (Navbar, Sidebar, Modals, Toast)
│   │   ├── context/      # Authentication & Toast contexts
│   │   └── pages/        # Dashboard, Kanban, Projects, Tasks, Auth pages
│   └── index.html
└── backend/              # Express API server
    ├── controllers/      # Route controllers (Auth, Dashboard, Project, Task)
    ├── models/           # Mongoose schemas (User, Project, Task)
    ├── routes/           # Express routes
    └── server.js         # API Entrypoint
