# 01Blog 🚀

**01Blog** is a high-performance, fullstack social blogging platform engineered for students at Zone01 to document their coding journey, share insights, publish multimedia posts, follow peers, and engage through comments and reactions. It features role-based access control, real-time notification polling, automated content moderation, and an administrative dashboard built in a bold, tactile **Neo-Brutalist Developer Aesthetic**.

---

## 🛠️ Tech Stack & Architecture

- **Backend:** Java 17, Spring Boot 3.3.4 (Spring Web, Spring Data JPA, Spring Security, jjwt 0.12.6, Apache Tika 2.9.2)
- **Database:** PostgreSQL 16 (User-space `pg_ctl` compatible with Zone01 non-sudo environments)
- **Frontend:** Angular 18 (Standalone Components, TypeScript, RxJS, Bootstrap 5 Icons & Grid)
- **Design System:** Neo-Brutalist Developer Theme (`#121214` 2.5px solid borders, 5px hard shadows, canary yellow / mint / coral accents on warm cream `#faf7f2`, with full Dark Mode support)
- **Architecture:** Flat 3-Tier Client-Server Architecture:
  - Backend: `Controller` ➔ `Service` ➔ `Repository` ➔ `PostgreSQL`
  - Frontend: `Component` ➔ `Service` ➔ `Backend REST API`

---

## 📁 Repository Structure

```text
01blog/
├── backend/
│   ├── src/main/java/com/zone01/blog/
│   │   ├── config/          # Security, JWT filter, WebMvc CORS & static upload handlers
│   │   ├── controller/      # REST Controllers (Auth, Post, User, Notification, Report, Admin)
│   │   ├── dto/             # Clean Data Transfer Objects (Requests & Responses)
│   │   ├── entity/          # JPA Entities (User, Post, Like, Comment, Notification, Report)
│   │   ├── exception/       # GlobalExceptionHandler (@RestControllerAdvice)
│   │   ├── repository/      # Spring Data JPA Repositories
│   │   └── service/         # Business logic layer & Apache Tika file management
│   ├── src/main/resources/  # application.properties
│   ├── uploads/             # Managed media upload storage (images & videos)
│   ├── mvnw / mvnw.cmd      # Maven wrappers
│   └── pom.xml              # Maven dependencies & build configuration
├── frontend/
│   ├── src/app/
│   │   ├── components/      # Standalone Angular Components:
│   │   │   ├── admin-dashboard/ # Admin moderation tables & metric analytics
│   │   │   ├── comment-list/    # Nested comment threads with real-time add/delete
│   │   │   ├── create-post/     # Collapsible post publisher with media preview
│   │   │   ├── home/            # Feed switcher (All Posts vs Following)
│   │   │   ├── login/           # Authentication with banned account popout modal
│   │   │   ├── navbar/          # Brand header, unread bell badge & theme toggle
│   │   │   ├── not-found/       # Neo-Brutalist 404 wildcard route handler
│   │   │   ├── post-card/       # Individual post card with likes, media player, options
│   │   │   ├── post-list/       # Responsive feed layout
│   │   │   ├── register/        # Student onboarding form
│   │   │   ├── report-modal/    # Content reporting dialog with confirmation
│   │   │   ├── user-profile/    # Student block page (posts, followers, follow toggle)
│   │   │   └── user-search/     # Peer discovery by username
│   │   ├── guards/          # authGuard, guestGuard, adminGuard
│   │   ├── interceptors/    # jwtInterceptor (Bearer token injection & 403 banned eviction)
│   │   ├── models/          # TypeScript domain models & DTO interfaces
│   │   └── services/        # AuthService, PostService, AdminService, ThemeService, etc.
│   └── styles.css           # Global Neo-Brutalist theme variables & modal system
├── LEARNING_BOOK.md         # Comprehensive chapter-by-chapter defense manual
├── ROADMAP.md               # 60-commit roadmap tracker
├── audit_subject.md         # Official evaluation questions
└── project_subject.md       # Project specifications & requirements
```

---

## ⚡ Prerequisites

Before launching the project, verify that your environment has:
- **Java Development Kit (JDK 17 or higher):** `java -version`
- **Node.js (v18 or higher) & npm:** `node -v` && `npm -v`
- **PostgreSQL 16:** Running locally on port `5432`

---

## 🗄️ Database & Environment Setup

The application supports 12-factor environment configuration (see [`.env.example`](file:///.env.example)). All sensitive values (database credentials, JWT secret, and initial admin password) can be configured via environment variables, or run seamlessly out-of-the-box using the Zone01 local defaults configured in `application.properties`:
* `DB_URL`, `DB_USERNAME`, `DB_PASSWORD` (defaults to local PostgreSQL `blog_db`)
* `JWT_SECRET`, `JWT_EXPIRATION_MS`
* `ADMIN_USERNAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` (initial platform administrator seed)

### ⚡ Quick Start: Universal Database Script
Run our intelligent database manager which auto-detects whether you are in Zone01 (user-space `pg_ctl`) or on a machine with Docker:
```bash
./start_db.sh
```
* **On Zone01 Student Workstations (No Sudo):** Starts user-space PostgreSQL 16 via `pg_ctl` under `~/pgdata`.
* **On Personal Workstations with Docker:** Spins up the official PostgreSQL 16 container via [`docker-compose.yml`](file:///docker-compose.yml).
* To stop the database when finished: `./stop_db.sh`

### Manual Option A: Docker Compose
```bash
docker compose up -d
```


### Option B: Zone01 Linux Environment (Non-Sudo / User-Space)
On Zone01 student workstations without `sudo` access:
```bash
# 1. Export local PostgreSQL binary and library paths
export PATH="$HOME/.local/pgsql/usr/lib/postgresql/16/bin:$HOME/.local/pgsql/usr/bin:$PATH"
export LD_LIBRARY_PATH="$HOME/.local/pgsql/usr/lib/x86_64-linux-gnu:$LD_LIBRARY_PATH"

# 2. Start PostgreSQL server in your user directory
pg_ctl -D ~/pgdata -o "-k /tmp -p 5432" -l ~/pgdata/logfile start

# 3. Create the database if not already present
createdb -h /tmp -p 5432 blog_db
```
> *Tables (`users`, `posts`, `likes`, `comments`, `notifications`, `reports`) are automatically initialized by Spring Boot Hibernate via `ddl-auto=update`.*

---

## 🚀 Running the Application

### 1. Start the Backend (Spring Boot)
```bash
cd backend

# On Linux / macOS:
./mvnw spring-boot:run

# On Windows:
.\mvnw.cmd spring-boot:run
```
The backend REST API will be active at **`http://localhost:8080`**.

### 2. Start the Frontend (Angular)
In a separate terminal:
```bash
cd frontend
npm install
npm start
```
The web application will open at **`http://localhost:4200`**.

---

## 📡 REST API Reference

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new student account |
| `POST` | `/api/auth/login` | Public | Authenticate student and obtain JWT Bearer token |
| `GET` | `/api/posts` | Public / Auth | Fetch active posts (enforces soft-hide rules) |
| `GET` | `/api/posts/{id}` | Public / Auth | View single post permalink by ID |
| `POST` | `/api/posts` | Authenticated | Create post with text & media (multipart/form-data) |
| `PUT` | `/api/posts/{id}` | Author / Admin | Update post text content or media |
| `DELETE` | `/api/posts/{id}` | Author / Admin | Delete post, cascade delete likes, comments & disk media |
| `GET` | `/api/posts/{id}/like` | Public / Auth | Query post like status and total like count |
| `POST` | `/api/posts/{id}/like` | Authenticated | Toggle like on a post |
| `GET` | `/api/posts/{id}/comments` | Public / Auth | Fetch comments on a post |
| `POST` | `/api/posts/{id}/comments` | Authenticated | Add a comment to a post |
| `DELETE` | `/api/posts/{id}/comments/{cid}` | Author / Admin | Remove comment |
| `GET` | `/api/users/{username}` | Public / Auth | Retrieve student profile and stats |
| `GET` | `/api/users/search` | Public / Auth | Search users by partial username |
| `GET` | `/api/users/avatars/presets` | Public | List default offline Neo-Brutalist character avatars |
| `GET` | `/api/users/me` | Authenticated | Get current authenticated student's profile & settings |
| `POST` | `/api/users/me/avatar` | Authenticated | Upload custom avatar image (with Apache Tika inspection) |
| `PUT` | `/api/users/me/avatar/preset` | Authenticated | Select default character avatar preset |
| `POST` | `/api/users/{username}/follow` | Authenticated | Subscribe to user profile |
| `POST` | `/api/users/{username}/unfollow` | Authenticated | Unsubscribe from user profile |
| `GET` | `/api/notifications` | Authenticated | Fetch notification feed (post alerts, new followers) |
| `GET` | `/api/notifications/unread-count`| Authenticated | Get unread notification badge count |
| `PUT` | `/api/notifications/{id}/read` | Authenticated | Mark single notification as read |
| `PUT` | `/api/notifications/read-all` | Authenticated | Mark all notifications as read |
| `POST` | `/api/reports` | Authenticated | Submit report against a user profile or post |
| `GET` | `/api/admin/stats` | Admin Only | Platform metrics (total users, posts, reports, bans) |
| `GET` | `/api/admin/reports` | Admin Only | View all moderation reports with reasons & timestamps |
| `DELETE` | `/api/admin/reports/{id}` | Admin Only | Dismiss moderation report |
| `GET` | `/api/admin/users` | Admin Only | List all registered students |
| `PUT` | `/api/admin/users/{id}/ban` | Admin Only | Toggle ban status for a user |
| `DELETE` | `/api/admin/users/{id}` | Admin Only | Cascading deletion of user and all related data |
| `GET` | `/api/admin/posts` | Admin Only | List all posts on the platform |
| `PUT` | `/api/admin/posts/{id}/hide` | Admin Only | Toggle soft-hide visibility on a post |
| `DELETE` | `/api/admin/posts/{id}` | Admin Only | Permanently delete post |

---

## 🛡️ Security & Edge-Case Protection

1. **Password Hashing:** Passwords are never stored in plain text; hashed using industry-standard `BCryptPasswordEncoder`.
2. **Stateless JWT Tokens:** Authentication runs via `Authorization: Bearer <token>` verified in `JwtAuthFilter`.
3. **Immediate Banned Account Eviction:**
   - Any request from a banned user is rejected at the HTTP filter level with `403 Forbidden` (`ACCOUNT_BANNED`).
   - The frontend `jwtInterceptor` catches this status, invalidates session storage, and redirects the user to `/login?banned=true`.
   - The login page displays a dedicated Neo-Brutalist **"Access Suspended"** modal popout and prevents re-authentication.
4. **MIME Magic Byte Verification:** Media uploads are checked with Apache Tika to inspect byte headers, blocking disguised executable scripts (`.php`, `.sh`, `.exe`).
5. **Upload Size Boundaries:** Enforces a 30MB limit configured in Spring Boot; uploads exceeding this return HTTP 413 handled gracefully by `GlobalExceptionHandler`.
6. **SQL Injection & XSS Immunity:**
   - All database access uses Spring Data JPA parameterized queries.
   - All user inputs are sanitized and rendered using Angular's safe template binding.
7. **Wildcard 404 Routing:** Unknown client paths redirect to `NotFoundComponent` without throwing console errors.

---

## 🧪 Peer-to-Peer Evaluation Guide (Audit Checklist)

During peer evaluation, demonstrate the following flows:
1. **Multi-User Interaction:**
   - Open two browser profiles (e.g., Chrome and Chrome Incognito).
   - Sign up two users: `@alice` and `@bob`.
   - Follow `@bob` from `@alice`'s account. Notice notification bell badge updates on `@bob`'s screen.
2. **Media Post & Feed:**
   - Publish a post with text and an image/video as `@bob`.
   - Verify `@alice` sees the post in her "Following" feed and receives an unread post notification.
3. **Like & Commenting:**
   - Like the post and add a comment; observe immediate counter updates and visual confirmation.
4. **Moderation & Reporting:**
   - Report `@bob`'s post using the report button (`Reason: Testing moderation`).
   - Log in as an admin user (`ROLE_ADMIN`).
   - Open `/admin`: inspect the analytics cards, locate the submitted report, test **Hide Post**, **Ban User**, or **Delete User**.
5. **Banned User Lockdown:**
   - Ban `@bob`. Within 15 seconds (or upon his next click), `@bob` is logged out and redirected to `/login` with the Neo-Brutalist "Account Banned" modal popout.
   - Attempt to log in again as `@bob`; observe the login refusal and the banned modal.
6. **Dark Mode & 404:**
   - Click the theme toggle icon in the navbar to demonstrate seamless Dark Mode switching.
   - Navigate to `/random-invalid-page` to demonstrate the custom 404 page.





cd squashfs-root
./AppRun
