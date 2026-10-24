# PicsEra – Photography Portfolio Platform

PicsEra is a modern, responsive photography portfolio and archival print booking platform built with **React 19**, **Tailwind CSS v4**, **Node.js + Express**, and **PostgreSQL (Neon)**.

---

## 🌐 Live Public Deployment

| Service | Platform | Live URL |
| :--- | :--- | :--- |
| **Frontend** | **Vercel** | [https://pics-era.vercel.app](https://pics-era.vercel.app) |
| **Backend API** | **Render** | [https://picsera-backend.onrender.com](https://picsera-backend.onrender.com) |
| **API Health Check** | **Render** | [https://picsera-backend.onrender.com/api/health](https://picsera-backend.onrender.com/api/health) |
| **Photos Endpoint** | **Render** | [https://picsera-backend.onrender.com/api/photos](https://picsera-backend.onrender.com/api/photos) |
| **Database** | **Neon** | Serverless PostgreSQL (`neondb`) |

---

## 📁 Project Architecture

The repository is organized into dedicated `frontend/` and `backend/` directories:

```text
PicsEra/
├── frontend/                  # Client: React 19 + Tailwind CSS + Vite
│   ├── public/
│   │   └── images/            # Curated photograph assets
│   ├── src/
│   │   ├── assets/
│   │   ├── components/        # Header, Hero, PhotoCard, AuthModal, CartModal, SavedModal, etc.
│   │   ├── context/           # AuthContext & useAuth (Session management)
│   │   ├── data/              # Default photo collection data
│   │   ├── api.js             # API client connecting to Render backend
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── backend/                   # Server: Node.js + Express + Neon Postgres
│   ├── middleware/            # JWT authentication middleware
│   ├── routes/                # Auth, Photos, Saved, and Inquiries API routes
│   ├── db.js                  # PostgreSQL Pool connection with SSL
│   ├── schema.sql             # Database schema (users, photos, saved_photos, inquiries)
│   ├── seed.js                # Database seeder script
│   ├── server.js              # Express app entry point
│   ├── package.json
│   └── .env.example
│
├── .gitignore                 # Root ignore rules (ensures secrets never enter git)
└── README.md                  # Project documentation & live links
```

---

## 🗄️ Database Schema (Neon PostgreSQL)

1. **`users`**: Stores user accounts (`id`, `name`, `email`, `password_hash`, `created_at`). Passwords encrypted with `bcryptjs`.
2. **`photos`**: Stores curated photograph records (`id`, `title`, `category`, `description`, `image`, `alt`, `aspect`).
3. **`saved_photos`**: Join table storing user favorites (`user_id`, `photo_id`, `created_at`) with composite primary key.
4. **`inquiries`**: Stores booking submissions from the contact form (`id`, `user_id`, `name`, `email`, `type`, `budget`, `message`).

---

## 🚀 Local Development Setup

### 1. Clone the repository

```bash
git clone https://github.com/syeddanish-in/PicsEra.git
cd PicsEra
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:
```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://<user>:<password>@<neon-host>/neondb?sslmode=require
JWT_SECRET=picsera_secret_key_2026
FRONTEND_URL=http://localhost:5173
```

Run seed script and start backend server:
```bash
npm run seed     # Seeds Neon database with 18 photos and demo user
npm run dev      # Starts Express on http://localhost:5000
```

### 3. Frontend Setup

Open a new terminal:
```bash
cd frontend
npm install
npm run dev      # Starts Vite on http://localhost:5173
```

---

## ✨ Features

- **Real PostgreSQL Database**: Live data served directly from Neon.
- **Secure Authentication**: Email & Password Sign In + Create Account with `bcryptjs` password hashing and JWT sessions that survive page refreshes.
- **Per-User Saved Favorites**: `🤍 Save` ➔ `❤️ Saved` with instant heart updates, isolated per user account.
- **Session Cart**: Add to cart, view total prints, and manage selections. Cart clears automatically upon sending an inquiry.
- **Interactive "Book a Shoot" Inquiry Form**: Validates inputs, requires login, and persists inquiry records to the database.
- **Interactive Redesigned Footer**: Quick category jump links, newsletter signup with instant feedback, live database status indicator, and smooth "Back to Top" scrolling.
