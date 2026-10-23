# PicsEra – Photography Portfolio Platform

PicsEra is a modern, responsive photography portfolio and archival print booking platform built with React 19, Tailwind CSS v4, and Vite.

---

## 📁 Project Architecture

The project is structured into dedicated **Frontend** and **Backend** directories:

```text
PicsEra/
├── frontend/                  # React 19 + Tailwind CSS + Vite
│   ├── public/
│   │   └── images/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/        # Header, Hero, PhotoCard, AuthModal, CartModal, SavedModal, etc.
│   │   ├── context/           # AuthContext & useAuth hook
│   │   ├── data/              # Curated photo collection data
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── backend/                   # Node.js API + Neon Postgres (Upcoming)
│   └── README.md
│
├── .gitignore                 # Monorepo-level git ignore rules
└── README.md                  # Project documentation
```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/syeddanish-in/PicsEra.git
cd PicsEra
```

### 2. Frontend Development

Navigate to the `frontend` folder and install dependencies:

```bash
cd frontend
npm install
npm run dev
```

Open the local Vite URL displayed in your terminal (typically `http://localhost:5173`).

### 3. Frontend Production Build

```bash
cd frontend
npm run build
```

---

## ✨ Current Features

- **Authentication System**: Simple Email & Password Sign In, plus Name + Email + Password Create Account.
- **Personalized Saved Photos**: Per-user `🤍 Save` ➔ `❤️ Saved` heart buttons with custom collections.
- **Cart & Inquiry**: Add photos/prints to Cart, review selections, and submit booking inquiries.
- **Login-Guarded Actions**: Unauthenticated users are politely prompted to sign in when saving, adding to cart, or submitting inquiries.
- **Responsive Navigation**: Restored PicsEra branding, saved counter badge, cart counter badge, and user profile management.
