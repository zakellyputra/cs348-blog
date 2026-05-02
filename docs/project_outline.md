# CS348 Blog App — Project Outline & Timeline

## Stack
- **Frontend:** Angular
- **Backend:** Spring Boot (Java)
- **Database:** MySQL
- **Auth:** Spring Security + BCrypt

## Design Direction
- Inspired by [daverupert.com](https://daverupert.com/archive/)
- Plaintext-forward, minimal, content-first
- See `STYLE_BRIEF.md` for full design spec
- **Colors:** Background #1E267A (dark navy), text #FFFFFF, links/accents #A0B4F0 (light lavender)
- **Sections:** About, Archives (blog posts), Books, Projects
- Navigation: simple horizontal text links, no icons or dropdowns

---

## MVP Scope (Stage 2 — Due 3/28/2026)

### Requirement 1: CRUD on Posts
- Create, edit, delete blog posts (title, body, author)
- Auto-tag posts with month-year on creation
- Manually assign tags from existing tag list
- Manage comments (guests can add, admins can delete)
- View count increments on each post read
- Sort post listing by: most viewed, most recent, oldest

### Requirement 2: Filterable Report
- Filter posts by: date range, month-year tag, manual tag, author
- Dropdowns populated dynamically from DB (tags, authors)
- Report displays: total posts, avg views per post, avg comments per post, most active author
- Report updates live when filters change

### Database
- 8 tables: roles, users, posts, tags, post_tags, comments, books, projects
- Schema defined in `src/main/resources/schema.sql` (IF NOT EXISTS + INSERT IGNORE)
- Books and Projects are separate tables (not post types) — different data shapes
- Tags system is only for posts (no book_tags or project_tags)
- Future: GitHub API auto-sync for projects (source column: manual vs github)

---

## Stage 3 Additions (Due 5/1/2026)

- SQL injection protection (prepared statements via JPA)
- Index justification for each query (indexes already in schema.sql)
- Transaction/isolation level discussion (concurrent post edits)
- AI usage disclosure
- Stretch: timeline view (frontend only, no new backend work)
- Extra credit: deploy to GCP

---

## Configuration Notes

### MySQL
- Database: `blog_app`
- Dedicated user: `bloguser` (scoped to blog_app only, not root)
- Created via: `CREATE USER 'bloguser'@'localhost' IDENTIFIED BY '...';`

### Spring Boot
- Credentials stored in `src/main/resources/application-local.properties` (gitignored)
- Main `application.properties` uses `${DB_USERNAME:}` / `${DB_PASSWORD:}` fallbacks
- Run with local profile: `mvn spring-boot:run -Dspring-boot.run.profiles=local`
- Schema init: `spring.sql.init.mode=always`
- Server port: 8080 (default)

### Admin user seed data
- Generate BCrypt hash: `htpasswd -nbBC 10 "" yourpassword | cut -d: -f2`
- Paste into schema.sql INSERT for admin user
- Email placeholder `admin@blog.local` is fine for dev — update via SQL later if needed

---

## Timeline (4 days to Stage 2 deadline)

### Day 1 — Foundation (3/24)
- [ ] MySQL running with schema + seed data
- [ ] Spring Boot connects to MySQL
- [ ] JPA entities + repositories created
- [ ] REST API endpoints for Posts, Tags, Comments
- [ ] Angular project initialized with routing
- [ ] CORS enabled for localhost:4200

### Day 2 — Frontend + Remaining Backend (3/25)
- [ ] Books + Projects REST endpoints
- [ ] Angular post list page (sortable: most viewed, recent, oldest)
- [ ] Angular post editor (create/edit form with tag selection)
- [ ] Angular post detail page (view count, comments)
- [ ] Angular comment form
- [ ] Delete post with confirmation

### Day 3 — Report + Polish (3/26)
- [ ] Angular report page with filter controls
- [ ] Dropdowns dynamically populated from DB
- [ ] Report query with stats
- [ ] About, Books, and Projects pages (static/simple CRUD)
- [ ] Apply styling from STYLE_BRIEF.md
- [ ] Auto-tagging logic verified end-to-end

### Day 4 — Demo + Buffer (3/27)
- [ ] End-to-end testing of Requirements 1 and 2
- [ ] Show report before and after data change
- [ ] Fix bugs
- [ ] Record 5-15 min demo
- [ ] Walk through code: queries, dynamic UI, CRUD operations

---

## Agentic Coding Plan — Claude Code Delegation

### How many agents?

Run **2 Claude Code agents concurrently** — one for backend, one for frontend.
These two domains have a clean boundary (REST API contract) which prevents
merge conflicts and allows parallel work.

A third agent is not worth it at this scale — the coordination overhead
outweighs the speed gain, and you'd risk conflicting database assumptions.

### Delegation workflow

```
Step 1: Define the API contract (below)
         ↓
Step 2: Share the contract + schema with both agents
         ↓
Step 3: Launch Agent 1 (backend) and Agent 2 (frontend) in parallel
         ↓
Step 4: When both are done, test end-to-end yourself
         ↓
Step 5: File bugs / adjustments as new agent tasks
```

---

## Agent 1: Backend (Spring Boot + MySQL)

**Workspace:** Project root (works in `src/main/java/...` and `src/main/resources/`)

### System prompt for Agent 1
```
You are working on a Spring Boot backend for a blog application.
The MySQL schema is in src/main/resources/schema.sql — read it before writing any code.
Use Spring Data JPA with entity classes, repositories, and a service layer.
Use prepared statements (JPA handles this) — never concatenate SQL strings.
Enable CORS for http://localhost:4200.
Package structure: com.zakellyputra.cs348.cs348_database
Existing files: HelloController.java (can be removed), Cs348DatabaseProjectApplication.java
```

### Step-by-step tasks

**Task 1: Add dependencies to pom.xml**
```
Add the following dependencies to pom.xml:
- spring-boot-starter-data-jpa
- spring-boot-starter-security
- mysql-connector-j
These are needed for database access, auth, and MySQL connectivity.
Do not remove existing dependencies.
```

**Task 2: Configure database connection**
```
Update src/main/resources/application.properties with:
- MySQL datasource URL: jdbc:mysql://localhost:3306/blog_app
- Datasource username/password using ${DB_USERNAME:} and ${DB_PASSWORD:} env vars
- spring.sql.init.mode=always
- spring.jpa.hibernate.ddl-auto=none (we manage schema with schema.sql, not Hibernate)

Create src/main/resources/application-local.properties with:
- spring.datasource.username=bloguser
- spring.datasource.password=placeholder

Add application-local.properties to .gitignore.
```

**Task 3: Create JPA entity classes**
```
Create entity classes in a new "model" package for each table in schema.sql:
- Role (role_id, role_name)
- User (user_id, username, email, password_hash, role_id FK, created_at)
- Post (post_id, title, body, author_id FK, view_count, created_at, updated_at)
- Tag (tag_id, tag_name, is_auto)
- PostTag (composite PK: post_id + tag_id)
- Comment (comment_id, post_id FK, user_id FK, body, created_at)
- Book (book_id, title, author, status enum, rating, notes, year_read, cover_url, timestamps)
- Project (project_id, title, description, repo_url, live_url, tech_stack, status enum, source enum, timestamps)

Use @ManyToOne for FK relationships. Post should have a @ManyToMany to Tag through post_tags,
and a @OneToMany to Comments. Map column names explicitly with @Column where the Java
field name differs from the SQL column name.
```

**Task 4: Create repository interfaces**
```
Create repository interfaces in a new "repository" package:
- RoleRepository
- UserRepository
- PostRepository — add methods:
    findAllByOrderByCreatedAtDesc()
    findAllByOrderByCreatedAtAsc()
    findAllByOrderByViewCountDesc()
- TagRepository — add method: findByIsAuto(boolean isAuto)
- CommentRepository — add method: findByPostId(int postId)
- BookRepository — add methods:
    findByStatus(String status)
    findAllByOrderByYearReadDesc()
- ProjectRepository — add method: findByStatus(String status)

All extend JpaRepository.
```

**Task 5: Create service layer**
```
Create service classes in a new "service" package:

PostService:
- createPost(title, body, authorId, tagIds[]) — also auto-creates month-year tag if needed
- getPost(id) — increments view_count and returns post
- updatePost(id, title, body, tagIds[])
- deletePost(id)
- listPosts(sort) — sort by "recent", "oldest", or "views"
- getReport(startDate, endDate, tagId, authorId) — returns filtered posts + stats

TagService:
- listTags(type) — "auto", "manual", or "all"
- createTag(name)

CommentService:
- addComment(postId, userId, body)
- listComments(postId)
- deleteComment(commentId)

BookService:
- CRUD operations + list by status

ProjectService:
- CRUD operations + list by status

Auto-tagging logic: when creating a post, format the current month-year
as "March 2026". Check if a tag with that name exists. If not, create it
with is_auto=true. Then link it to the post via post_tags.
```

**Task 6: Create REST controllers**
```
Create controllers in the "controller" package (remove HelloController.java):

PostController — maps to /api/posts:
  POST   /api/posts              — create post
  GET    /api/posts              — list posts (query param: sort=views|recent|oldest)
  GET    /api/posts/{id}         — get single post (increments view_count)
  PUT    /api/posts/{id}         — update post
  DELETE /api/posts/{id}         — delete post

TagController — maps to /api/tags:
  GET    /api/tags               — list tags (query param: type=auto|manual|all)
  POST   /api/tags               — create manual tag

CommentController — maps to /api/comments:
  POST   /api/posts/{id}/comments — add comment
  GET    /api/posts/{id}/comments — list comments for post
  DELETE /api/comments/{id}       — delete comment

UserController — maps to /api/users:
  GET    /api/users               — list all users (for author dropdown)

ReportController — maps to /api/report:
  GET    /api/report              — filtered report
         Query params: startDate, endDate, tagId, authorId
         Returns: { posts: [...], stats: { totalPosts, avgViews, avgComments, mostActiveAuthor } }

BookController — maps to /api/books:
  GET    /api/books               — list books (optional query param: status)
  POST   /api/books               — create book
  PUT    /api/books/{id}          — update book
  DELETE /api/books/{id}          — delete book

ProjectController — maps to /api/projects:
  GET    /api/projects            — list projects (optional query param: status)
  POST   /api/projects            — create project
  PUT    /api/projects/{id}       — update project
  DELETE /api/projects/{id}       — delete project

Add @CrossOrigin(origins = "http://localhost:4200") on each controller
or configure it globally in a WebMvcConfigurer bean.
```

**Task 7: Spring Security configuration**
```
Create a SecurityConfig class in a "config" package:
- Configure BCryptPasswordEncoder as a bean
- Set up basic HTTP security:
  - POST/PUT/DELETE endpoints require ADMIN role
  - GET endpoints are public
  - POST to /api/posts/{id}/comments is public (guests can comment)
- For Stage 2, a simple in-memory or DB-backed auth is fine
- Disable CSRF for the REST API (stateless)
```

**Task 8: Test all endpoints**
```
Test every endpoint using curl or HTTPie:
1. Create a post with tags — verify post_tags rows created and month-year auto-tag generated
2. Get the post — verify view_count incremented
3. Update the post — verify updated_at changed
4. Add a comment — verify it appears in GET /api/posts/{id}/comments
5. Delete the post — verify comments and post_tags cascaded
6. Run the report with filters — verify stats are correct
7. CRUD on books and projects
8. List tags by type — verify auto vs manual separation
Fix any issues before moving to frontend integration.
```

---

## Agent 2: Frontend (Angular)

**Workspace:** Separate `frontend/` directory (or Angular project root)

### System prompt for Agent 2
```
You are working on an Angular frontend for a personal blog.
The backend REST API runs at http://localhost:8080/api.
Read STYLE_BRIEF.md for all design and color specifications before writing any CSS.
Use Angular HttpClient for API calls. Use reactive forms for the post editor.
Use Angular Router for navigation between sections.
The site has 5 sections: Home, About, Archives, Books, Projects.
Design inspired by daverupert.com — minimal, plaintext-forward, content-first.
Colors: background #1E267A, text #FFFFFF, links/accents #A0B4F0.
```

### Step-by-step tasks

**Task 1: Project setup and global styles**
```
Initialize Angular project with routing. Set up:
- Global styles based on STYLE_BRIEF.md:
  body background #1E267A, text #FFFFFF, max-width ~65ch for content
  Links: #A0B4F0 with underline, hover to #FFFFFF
  System font stack or a clean serif for post body
- App component with navigation bar: Home, About, Archives, Books, Projects
  Simple horizontal text links, current page indicated with bold or underline
- Router configuration with routes for each section
- Footer with minimal links
```

**Task 2: Create Angular services**
```
Create services that call the backend REST API:

PostService:
  getPosts(sort: string): GET /api/posts?sort=...
  getPost(id: number): GET /api/posts/{id}
  createPost(data): POST /api/posts
  updatePost(id, data): PUT /api/posts/{id}
  deletePost(id): DELETE /api/posts/{id}

TagService:
  getTags(type: string): GET /api/tags?type=...
  createTag(name: string): POST /api/tags

CommentService:
  getComments(postId: number): GET /api/posts/{postId}/comments
  addComment(postId, data): POST /api/posts/{postId}/comments
  deleteComment(id): DELETE /api/comments/{id}

UserService:
  getUsers(): GET /api/users

ReportService:
  getReport(filters): GET /api/report?startDate=...&endDate=...&tagId=...&authorId=...

BookService:
  getBooks(status?): GET /api/books
  createBook(data): POST /api/books
  updateBook(id, data): PUT /api/books/{id}
  deleteBook(id): DELETE /api/books/{id}

ProjectService:
  getProjects(status?): GET /api/projects
  createProject(data): POST /api/projects
  updateProject(id, data): PUT /api/projects/{id}
  deleteProject(id): DELETE /api/projects/{id}
```

**Task 3: Archives page (post listing)**
```
Build the Archives page — this is the main blog listing:
- Posts grouped by year with year as heading (like daverupert.com/archive)
- Each post entry: title (linked), date below, tags as small links
- Sort controls at top as plain text links: "most viewed" / "most recent" / "oldest"
  Active sort is bold, others are regular links
- Tag list at the top for filtering (fetch from GET /api/tags)
- View count displayed subtly next to date
- This is the primary page for Requirement 1 demo
```

**Task 4: Post editor (create/edit)**
```
Build the post editor component:
- Reactive form with fields: title (text input), body (textarea)
- Tag selection: fetch tags from GET /api/tags?type=manual, display as checkboxes
- Save calls POST /api/posts (create) or PUT /api/posts/{id} (edit)
- After save, navigate to the post detail page
- Edit mode: pre-populate form from existing post data
- Include a delete button (with confirmation dialog) when editing
```

**Task 5: Post detail page**
```
Build the post detail page:
- Large title at top
- Date, author, and view count below title (small, muted #A0B4F0)
- Post body in readable paragraphs
- Tags listed at bottom as links
- Comments section below:
  - List existing comments (commenter name, date, body)
  - Add comment form: textarea + submit button (no auth required)
- Loading the page calls GET /api/posts/{id} which increments view count
```

**Task 6: Report page**
```
Build the report page for Requirement 2:
- Filter controls at top:
  - Date range: start date and end date pickers
  - Month-year tag dropdown (populated from GET /api/tags?type=auto)
  - Manual tag dropdown (populated from GET /api/tags?type=manual)
  - Author dropdown (populated from GET /api/users)
- All dropdowns built dynamically from DB data (not hardcoded)
- Results: filtered post list displayed below filters
- Stats summary row: total posts, avg views, avg comments, most active author
- Changing any filter re-fetches the report from GET /api/report
```

**Task 7: About page**
```
Build a simple About page:
- Static prose content — short bio, can be hardcoded for now
- No sidebar, no widgets
- Same typography and spacing as post body
```

**Task 8: Books page**
```
Build the Books page:
- List books fetched from GET /api/books
- Group by status: "Currently reading", "Read", "Want to read"
- Each entry: title, author, rating (if read), year read, notes
- Admin view: add/edit/delete buttons (simple forms, same minimal style)
```

**Task 9: Projects page**
```
Build the Projects page:
- List projects fetched from GET /api/projects
- Each entry: title, short description, tech stack, links to repo/live URL
- Group by status: active, completed, archived
- Admin view: add/edit/delete buttons
- Minimal style — subtle border only, no shadows
```

**Task 10: Home page**
```
Build the Home page:
- Site title at top (plain text, not a logo)
- "Latest Posts" section: 5-8 most recent posts as a simple list
  (reuse the same post list item format from Archives)
- Link to Archives: "View all posts →"
- Optionally show active projects below
```

---

## The API Contract (share with both agents)

```
POST   /api/posts              — Create post (title, body, authorId, tagIds[])
GET    /api/posts              — List posts (query params: sort=views|recent|oldest)
GET    /api/posts/{id}         — Get single post (increments view_count)
PUT    /api/posts/{id}         — Update post (title, body, tagIds[])
DELETE /api/posts/{id}         — Delete post (cascades to comments + post_tags)

GET    /api/tags               — List all tags (query param: type=auto|manual|all)
POST   /api/tags               — Create manual tag

POST   /api/posts/{id}/comments — Add comment (body, userId)
GET    /api/posts/{id}/comments — List comments for post
DELETE /api/comments/{id}       — Delete comment (admin only)

GET    /api/users               — List users (for author dropdown)

GET    /api/report              — Filtered report
        Query params: startDate, endDate, tagId, authorId
        Returns: { posts: [...], stats: { totalPosts, avgViews, avgComments, mostActiveAuthor } }

GET    /api/books               — List books (optional query param: status)
POST   /api/books               — Create book
PUT    /api/books/{id}          — Update book
DELETE /api/books/{id}          — Delete book

GET    /api/projects            — List projects (optional query param: status)
POST   /api/projects            — Create project
PUT    /api/projects/{id}       — Update project
DELETE /api/projects/{id}       — Delete project
```

---

## Tips for Working with the Agents

- **Be specific.** Don't say "build the backend." Say "create the Post JPA entity
  class with fields mapping to the posts table in schema.sql."
- **One task per prompt.** Let the agent finish, review, then move on.
- **Share context.** Paste the schema or API contract into each prompt so the
  agent doesn't have to guess.
- **Share the style brief** with Agent 2 before any CSS work.
- **Review everything.** The agents will get you 80% there — the last 20%
  (wiring things together, fixing edge cases) is your job and where you learn.
- **Git commit after each agent task.** If something breaks, you can revert cleanly.
- **Test API endpoints with curl** before connecting Angular — catch backend bugs early.

---

## Files in This Repo

| File | Purpose | Gitignored? |
|------|---------|-------------|
| `src/main/resources/schema.sql` | Database schema + seed data | No |
| `src/main/resources/application.properties` | General Spring config | No |
| `src/main/resources/application-local.properties` | DB credentials | Yes |
| `STYLE_BRIEF.md` | Frontend design spec for agents | No |
| `PROJECT_OUTLINE.md` | This file | No |
