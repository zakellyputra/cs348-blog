# CS348 Database Project — Blog App

Personal blog built with **Angular**, **Spring Boot**, and **MySQL**.

## Prerequisites

- **Java 17+** (the Maven wrapper handles Maven itself)
- **Node.js 20+** and **npm 11+** (Angular 21 requirement)
- **MySQL 8+** running locally on port `3306`

## 1. Database setup

The Spring Boot app auto-runs `src/main/resources/schema.sql` on startup, which creates the `blog_app` database, all tables, indexes, and seed data. You just need a MySQL user that can create databases.

Create one once:

```sql
CREATE USER 'blog_app'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON *.* TO 'blog_app'@'localhost';
FLUSH PRIVILEGES;
```

## 2. Backend (Spring Boot)

From the project root:

```bash
export DB_USERNAME=blog_app
export DB_PASSWORD=your_password
./mvnw spring-boot:run
```

The API serves on **http://localhost:8080**.

A few useful endpoints to verify it's up:

- `GET  /api/posts`            — list posts (`?sort=recent|oldest|views`)
- `GET  /api/posts/{id}`       — single post (also bumps `view_count`)
- `GET  /api/tags?type=manual` — manual tags (used by the post-create dropdown)
- `GET  /api/report?startDate=2026-01-01&endDate=2026-03-31&authorId=1` — filtered report

Admin-only endpoints (POST/PUT/DELETE) require HTTP Basic auth. The seed data creates an `admin` user; the password hash in `schema.sql` is a placeholder — generate a real one with `htpasswd -nbBC 10 "" yourpassword | cut -d: -f2` and paste it into the seed before first run.

### Other backend commands

```bash
./mvnw compile        # compile only
./mvnw test           # run tests
./mvnw clean package  # build a runnable jar in target/
```

## 3. Frontend (Angular)

In a second terminal:

```bash
cd frontend
npm install           # first time only
npm start             # equivalent to `ng serve`
```

The dev server runs on **http://localhost:4200** and proxies `/api/*` requests to the Spring Boot backend on `:8080` (see `frontend/proxy.conf.json`). Both servers must be running.

### Other frontend commands

```bash
npm run build         # production build into frontend/dist/
npm test              # Vitest unit tests
```

## Project layout

```
.
├── pom.xml                          # Spring Boot / Maven backend
├── src/main/java/...                # Java source (controllers, services, repos, models)
├── src/main/resources/
│   ├── application.properties       # DB URL, schema-init config
│   └── schema.sql                   # tables, indexes, seed data
└── frontend/
    ├── package.json                 # Angular 21 app
    ├── proxy.conf.json              # /api → :8080 dev proxy
    └── src/                         # Angular components / services
```

## Troubleshooting

- **`Access denied for user`** — the `DB_USERNAME` / `DB_PASSWORD` env vars aren't set, or the MySQL user lacks `CREATE DATABASE` privilege.
- **Schema errors on startup** — `application.properties` sets `spring.sql.init.continue-on-error=true`, so existing-table errors are ignored. To rebuild from scratch, drop the DB: `DROP DATABASE blog_app;` and restart the backend.
- **Frontend can't reach the API** — make sure the backend is running on `:8080` *before* you start `npm start`, otherwise the proxy will return 504s until you restart it.
