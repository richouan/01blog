# 01Blog 🚀

**01Blog** is a fullstack social blogging platform built for students to share learning experiences, discoveries, and progress. Users can publish posts with text and media, subscribe to other students' profiles (blocks), like, comment, and report inappropriate content. An administrative panel allows content moderation and user management.

---

## 🛠️ Tech Stack

- **Backend:** Java 17, Spring Boot 3 (Spring Web, Spring Data JPA, Spring Security, JWT)
- **Database:** PostgreSQL
- **Frontend:** Angular, Bootstrap (HTML/CSS)
- **Architecture:** Decoupled RESTful API Client-Server Architecture

---

## 📋 Prerequisites

Before running the project, make sure you have the following installed:
- **Java Development Kit (JDK 17 or higher)**: `java -version`
- **Node.js (v18 or higher) & npm**: `node -v`, `npm -v`
- **PostgreSQL**: Running locally on port `5432`

---

## 🗄️ Database Setup

### Option A: Standard PostgreSQL (System Service)
1. Open PostgreSQL (via `psql` or pgAdmin).
2. Create the project database:
   ```sql
   CREATE DATABASE blog_db;
   ```

### Option B: Zone01 Linux Machine (Non-Sudo / User-Space PostgreSQL)
If developing on a restricted Zone01 Linux machine without `sudo`:
```bash
# 1. Set environment paths
export PATH="/home/richouan/.local/pgsql/usr/lib/postgresql/16/bin:/home/richouan/.local/pgsql/usr/bin:$PATH"
export LD_LIBRARY_PATH="/home/richouan/.local/pgsql/usr/lib/x86_64-linux-gnu:$LD_LIBRARY_PATH"

# 2. Start user-space PostgreSQL server on port 5432
pg_ctl -D /home/richouan/pgdata -o "-k /tmp -p 5432" -l /home/richouan/pgdata/logfile start

# 3. Stop server when done
pg_ctl -D /home/richouan/pgdata stop
```

> **Note:** The tables (`users`, `posts`, etc.) will be created automatically by Hibernate (`ddl-auto=update`) when the backend starts.

---

## 🚀 How to Run the Application

### 1. Backend (Spring Boot)

Navigate to the backend folder:
```bash
cd backend
```

- **On Windows:**
  ```powershell
  mvn spring-boot:run
  ```
  *(Or using the Maven wrapper: `.\mvnw.cmd spring-boot:run`)*

- **On Linux (Zone01):**
  ```bash
  mvn spring-boot:run
  ```
  *(Or using the Maven wrapper: `./mvnw spring-boot:run`)*

The backend will start on **`http://localhost:8080`**.

---

### 2. Frontend (Angular)

*(Setup coming in Day 2)*
```bash
cd frontend
npm install
npm start
```
The frontend will start on **`http://localhost:4200`**.

---

## 🔐 Key Features
- **Authentication:** Secure user registration & login using JWT (JSON Web Tokens) and BCrypt password hashing.
- **Role-Based Access Control:** Separate roles for regular students (`USER`) and moderators (`ADMIN`).
- **User Block Page:** Personal profile displaying user posts, follower counts, and subscription buttons.
- **Post Management:** Create, edit, and delete posts with text and media previews (images/videos).
- **Social Engagement:** Likes, comments, and real-time/instant notifications from subscribed profiles.
- **Moderation Tools:** Reporting system with text reasons and an admin dashboard to ban users or remove posts.
