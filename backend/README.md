# PicsEra Backend API & Database

A Node.js + Express REST API connected to a PostgreSQL database hosted on **Neon**.

---

## 🗄️ Database Schema Explained in Plain English

The database consists of **4 simple, relational tables**:

### 1. `users` Table
- **What it does:** Stores registered accounts so users can log in and manage their favorites.
- **Columns:**
  - `id`: Unique identifier for each user (auto-incrementing integer).
  - `name`: The user's display name (e.g., "Danish").
  - `email`: The user's email address (unique, used to sign in).
  - `password_hash`: The user's password securely encrypted with `bcryptjs`. We never store raw passwords.
  - `created_at`: The timestamp when the account was registered.

### 2. `photos` Table
- **What it does:** Stores the curated collection of photographs, replacing hardcoded frontend data.
- **Columns:**
  - `id`: Unique photo number.
  - `title`: Name of the photo (e.g., "Culinary Artistry").
  - `category`: Category tag (Portrait, Culinary, Nature, Automotive, etc.).
  - `description`: Artistic description of the shoot.
  - `image`: URL or asset path to the photo file.
  - `alt`: Accessible image description.
  - `aspect`: Orientation (landscape, portrait, square).
  - `created_at`: Timestamp.

### 3. `saved_photos` Table (Join / Favorites Table)
- **What it does:** Connects a `user` to the `photos` they have clicked **❤️ Saved** on.
- **Columns:**
  - `user_id`: Foreign key pointing to `users(id)`. If the user is deleted, their saves are removed (`ON DELETE CASCADE`).
  - `photo_id`: Foreign key pointing to `photos(id)`.
  - `PRIMARY KEY (user_id, photo_id)`: Prevents a user from saving the same photo twice.

### 4. `inquiries` Table
- **What it does:** Stores shoot booking inquiries submitted through the contact form.
- **Columns:**
  - `id`: Unique inquiry number.
  - `user_id`: Links to the signed-in user who made the booking.
  - `name`: Contact name.
  - `email`: Contact email address.
  - `type`: Selected photography type (portrait, product, event).
  - `budget`: Selected budget range.
  - `message`: Project details notes.
  - `created_at`: Submission timestamp.

---

## 🔑 Setup & Local Running

### 1. Environment Variables
Create a file named `.env` inside the `backend/` folder:
```bash
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://<user>:<password>@<neon-host>/neondb?sslmode=require
JWT_SECRET=super_secret_picsera_jwt_key
FRONTEND_URL=http://localhost:5173
```
*(Notice: `.env` is excluded in `.gitignore` so your secrets are never exposed on GitHub).*

### 2. Run the Seed Script
This automatically creates the tables in your Neon database and populates all 18 photos and a demo user (`danish@picsera.com` / `password123`):
```bash
npm run seed
```

### 3. Start the Backend API
```bash
npm run dev
```
Server runs on `http://localhost:5000`. Test health: `http://localhost:5000/api/health`.

---

## 📡 API Endpoints Summary

| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | No | Health check & database connection status |
| `GET` | `/api/photos` | No | Fetch all photos (supports `?category=Nature`) |
| `GET` | `/api/photos/:id` | No | Fetch single photo details |
| `POST` | `/api/auth/signup` | No | Register new user account (`name, email, password`) |
| `POST` | `/api/auth/login` | No | Authenticate user & receive JWT token |
| `GET` | `/api/auth/me` | Yes (Bearer Token) | Verify session across page refreshes |
| `GET` | `/api/saved` | Yes | Get current user's saved photos |
| `POST` | `/api/saved/toggle`| Yes | Toggle save/favorite photo for current user |
| `POST` | `/api/inquiries` | Optional | Submit booking inquiry to database |
