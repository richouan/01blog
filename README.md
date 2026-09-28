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

1. Open PostgreSQL (via `psql` or pgAdmin).
2. Create the project database:
   ```sql
   CREATE DATABASE blog_db;
   ```
3. The tables will be created automatically by Hibernate (`ddl-auto=update`) when the backend starts.

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
