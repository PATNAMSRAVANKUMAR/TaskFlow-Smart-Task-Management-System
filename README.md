# TaskFlow – Smart Task Management System

TaskFlow is a modern, full-stack **Task Management & Productivity Web Application** designed with a professional SaaS dashboard aesthetic. Built with React.js, Node.js, Express.js, and MongoDB, it provides a fast, intuitive workflow for organizing tasks, tracking productivity metrics, categorizing projects, and maintaining momentum.

---

## 🌟 Key Features

- **Dashboard & Productivity Overview**:
  - Live statistics: Total Tasks, Completed, Pending, and Overdue.
  - Overall progress indicator with dynamic percentage calculations.
  - Productivity metrics tracking tasks completed today vs. this week.
  - Quick-add capture bar to quickly record tasks from the dashboard.
- **Task Management (Full CRUD)**:
  - Create, read, update, and delete tasks with real-time UI synchronization.
  - Mark tasks as completed or restore them to pending with satisfying celebratory confetti.
  - Color-coded priority system: **High**, **Medium**, and **Low**.
  - Due date picker with smart **Overdue** detection (`dueDate < current date AND status != completed`).
- **Interactive All Tasks Explorer**:
  - Real-time search across titles, descriptions, and categories.
  - Multi-dimensional filters: Status (*All, Pending, In Progress, Completed, Overdue*), Priority (*High, Medium, Low*), and Categories.
  - Flexible sorting: by Due Date, Priority, Creation Date, or Alphabetically.
  - View switcher: Toggle between responsive **Grid View** and compact **List View**.
- **Specialized Workspaces**:
  - **Today's Focus**: Filter and track tasks specifically scheduled for today with a daily target bar.
  - **Upcoming Deadlines**: Chronologically organized into *Tomorrow*, *This Week*, *Next Week*, and *Later*.
  - **Completed Archive**: History of finished accomplishments with restore and permanent delete actions.
  - **Category Hub**: Breakdown of tasks by domain (*Work, Personal, Study, Health, Shopping, Other*) with custom category creation and color swatches.
- **Authentication & Security**:
  - Secure registration and login using JWT (JSON Web Tokens) and bcrypt password hashing.
  - Data isolation: users only have access to their own tasks and categories.
  - Password reveal toggles and profile/password management in Settings.
  - **1-Click Demo Login**: Pre-populated with realistic tasks for instant evaluation by recruiters and reviewers.
- **Modern UI / UX**:
  - Dark Mode and Light Mode with instant toggle and `localStorage` persistence.
  - Responsive design with collapsible mobile navigation drawer.
  - Animated toast notifications for actions.
  - Reusable confirmation modals for destructive operations.
  - Friendly empty states with clear calls to action.

---

## 🛠️ Tech Stack

### Frontend
- **React.js 19**: Modern component-driven UI
- **Vite 8**: High-speed build tooling and local development server
- **Tailwind CSS 3**: Professional utility-first design system with dark mode
- **Lucide React**: Clean, modern iconography
- **Axios**: HTTP client with request & response JWT interceptors
- **Canvas Confetti**: Celebratory micro-interactions

### Backend
- **Node.js & Express.js**: RESTful API server architecture
- **MongoDB & Mongoose**: Object Data Modeling (ODM), schemas, references, and indexes
- **MongoDB Memory Server**: Built-in zero-config embedded fallback for local testing
- **JSON Web Token (JWT)**: Stateless authentication
- **bcryptjs**: Secure one-way salt hashing for passwords
- **Morgan & CORS**: Request logging and cross-origin security

---

## 📁 Project Structure

```text
TaskFlow/
├── server/
│   ├── config/
│   │   └── db.js                 # MongoDB connection & memory fallback
│   ├── controllers/
│   │   ├── authController.js     # Auth, profile, password, and demo seeding
│   │   ├── taskController.js     # Task CRUD, filters, and stats
│   │   └── categoryController.js # Custom categories & task counting
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT token validation
│   │   └── errorMiddleware.js    # Global error & 404 handler
│   ├── models/
│   │   ├── User.js               # User schema & password hashing
│   │   ├── Task.js               # Task schema with priority, dates, and status
│   │   └── Category.js           # Category schema with user reference
│   ├── routes/
│   │   ├── authRoutes.js         # /api/auth routes
│   │   ├── taskRoutes.js         # /api/tasks routes
│   │   └── categoryRoutes.js     # /api/categories routes
│   ├── server.js                 # Express server entry point
│   ├── .env                      # Server configuration
│   └── .env.example
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx       # Navigation drawer with badges
│   │   │   ├── Header.jsx        # Dynamic greeting & action bar
│   │   │   ├── TaskCard.jsx      # Task item with priority & overdue alerts
│   │   │   ├── TaskModal.jsx     # Create/edit task form
│   │   │   ├── StatsCard.jsx     # Metric cards with trend badges
│   │   │   ├── ProgressBar.jsx   # Completion bar & weekly stats
│   │   │   ├── ConfirmModal.jsx  # Reusable confirmation dialog
│   │   │   ├── CategoryModal.jsx # Add custom category modal
│   │   │   └── EmptyState.jsx    # Contextual empty state illustrations
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx     # Central analytics & quick capture
│   │   │   ├── AllTasks.jsx      # Search, filter, and sort explorer
│   │   │   ├── Today.jsx         # Focused today's schedule
│   │   │   ├── Upcoming.jsx      # Chronologically grouped timeline
│   │   │   ├── Completed.jsx     # Finished accomplishments archive
│   │   │   ├── Categories.jsx    # Domain project management
│   │   │   ├── Settings.jsx      # Profile, theme, & password
│   │   │   ├── Login.jsx         # Sign in with 1-click demo button
│   │   │   └── Register.jsx      # User account registration
│   │   ├── context/
│   │   │   ├── AuthContext.jsx   # User session provider
│   │   │   ├── TaskContext.jsx   # Task store & optimistic updates
│   │   │   ├── ThemeContext.jsx  # Dark/Light theme manager
│   │   │   └── ToastContext.jsx  # Notification dispatch
│   │   ├── services/
│   │   │   └── api.js            # Axios client with interceptors
│   │   ├── App.jsx               # View router & layout
│   │   ├── main.jsx              # App entry point
│   │   └── index.css             # Tailwind setup
│   ├── index.html
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── .gitignore
├── README.md
└── package.json                  # Root orchestration scripts
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18+ (tested on Node v20/v24)
- **NPM**: v9+
- *(Optional)* **MongoDB**: Local MongoDB daemon or MongoDB Atlas URI. If neither is running, TaskFlow will automatically launch an embedded in-memory MongoDB instance out of the box!

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/taskflow.git
   cd taskflow
   ```

2. **Install all dependencies** (Root, Server, and Client):
   ```bash
   npm run install-all
   ```
   *Or install individually:*
   ```bash
   cd server && npm install
   cd ../client && npm install
   ```

3. **Configure Environment Variables**:
   In `server/.env`:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/taskflow
   JWT_SECRET=your_jwt_secret_key_here
   NODE_ENV=development
   ```
   *(If you leave `MONGODB_URI` blank or if MongoDB is not running locally, the server automatically starts the embedded in-memory database).*

---

## 🏃 Running the Application

### Option A: Run Both Together (from root)
In the root directory, start the server in one terminal and client in another:
```bash
# Terminal 1 - Backend Server (Port 5000)
npm run server

# Terminal 2 - Frontend Client (Port 5173)
npm run client
```

### Option B: Run Individually

**Backend Server**:
```bash
cd server
npm start
# Server runs at http://localhost:5000
```

**Frontend Client**:
```bash
cd client
npm run dev
# Client runs at http://localhost:5173
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔑 Demo Account & Quick Evaluation

To test all features immediately without manually filling out registration forms:
1. Open the login page.
2. Click **"Explore Demo Account (1-Click)"**.
3. You will be logged in as `Alex Morgan` with pre-populated tasks across Today, Upcoming, Overdue, and Completed states.

---

## 📡 REST API Documentation

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new user account | Public |
| `POST` | `/api/auth/login` | Authenticate with email & password | Public |
| `POST` | `/api/auth/demo` | Instant 1-click demo login & seeding | Public |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Private |
| `PUT` | `/api/auth/profile` | Update profile name / email | Private |
| `PUT` | `/api/auth/updatepassword` | Change user password | Private |

### Tasks (`/api/tasks`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/tasks` | Get tasks with search, filter, and sort | Private |
| `GET` | `/api/tasks/stats` | Get dashboard statistics & metrics | Private |
| `GET` | `/api/tasks/:id` | Get single task details | Private |
| `POST` | `/api/tasks` | Create a new task | Private |
| `PUT` | `/api/tasks/:id` | Update an existing task | Private |
| `DELETE` | `/api/tasks/:id` | Delete a task | Private |
| `PATCH` | `/api/tasks/:id/complete`| Toggle completion status | Private |

### Categories (`/api/categories`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/categories` | Get all categories with task counts | Private |
| `POST` | `/api/categories` | Create custom category with color | Private |
| `DELETE` | `/api/categories/:id` | Delete category & reassign tasks | Private |

---

## 📸 Screenshots

*(Replace placeholders with screenshots when deploying)*

| Dashboard (Light Mode) | Dashboard (Dark Mode) |
| :---: | :---: |
| *[Add Screenshot: Dashboard Light]* | *[Add Screenshot: Dashboard Dark]* |

| All Tasks & Filters | Category Breakdown |
| :---: | :---: |
| *[Add Screenshot: All Tasks Grid]* | *[Add Screenshot: Categories]* |

---

## 🔮 Future Improvements

- **Subtasks & Checklists**: Allow dividing large tasks into nested sub-items.
- **Collaborative Workspaces**: Invite team members to shared boards with role-based permissions.
- **Calendar View**: Full monthly and weekly interactive calendar view.
- **Email & Push Notifications**: Reminders before deadlines arrive.
- **Drag-and-Drop Kanban Board**: Visual status columns with drag-and-drop task movements.

---

## 📄 License

This project is licensed under the MIT License.
