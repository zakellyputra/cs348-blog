# Stage 3 Demo Script

**Target length: 7 minutes** (rubric allows 5–10).
**Format:** screen recording + voiceover. Each section says what to put on screen and what to say. Stage directions in *italics*.

---

## 0. Intro — 15 sec

*Open on the running app at `http://localhost:4200`.*

> "Hi, this is Zach Putra. This is the stage 3 demo for my CS348 project — a personal blog built with Angular, Spring Boot, and MySQL. I'm going to walk through four things: how the app protects against SQL injection, the indexes I added and what they support, transactions and isolation, and how I used AI tools. I'll also point out what changed between stage 2 and stage 3."

---

## 1. SQL Injection protection (1a) — 90 sec

*Open `src/main/java/com/zakellyputra/cs348/cs348_database/repository/PostRepository.java` side-by-side with `service/PostService.java`.*

> "The whole app talks to MySQL through Spring Data JPA, which compiles every query into a JDBC `PreparedStatement` with bound parameters. There's no string concatenation of SQL anywhere."

*Highlight `PostRepository.java:25` — the `findByIdWithTagsAndComments` query.*

> "The `:id` here is a named parameter. Hibernate translates this into `WHERE post_id = ?` and sends the value separately to MySQL — so even an input like `1 OR 1=1` is just compared as an integer, never parsed as SQL."

*Scroll to `PostRepository.java:28-30` — the new `incrementViewCount`.*

> "Same pattern for the modifying queries — bound parameters, no concatenation."

*Switch to `PostService.java:114` — the `getReport` method.*

> "The most important place to look is the report query, because it builds the WHERE clause dynamically from up to four user filters: date range, tag, and author. This is exactly where naive code would concatenate strings."

*Highlight the `cb.greaterThanOrEqualTo`, `cb.equal`, and `cb.lessThan` calls.*

> "I'm using JPA's Criteria API. `cb.equal` and friends produce bound parameters, not SQL fragments. So even though the shape of the query changes per request, every value the user supplies is parameterized."

*Switch briefly to `PostController.java:28` (the `sort` parameter) and `PostService.java:79`.*

> "One more thing — the post list takes a `sort` query string from the user. That string is never interpolated into SQL. Instead I use a `switch` to route it to one of three pre-written queries. The user's input is a key into a whitelist."

*Mention briefly:*

> "Passwords are hashed with BCrypt in `SecurityConfig`, so the login path also doesn't expose raw input to the database."

---

## 2. Indexes (1b) — 90 sec

*Open `src/main/resources/schema.sql` and scroll to lines 94–110.*

> "I have eight secondary indexes. They group into three categories — let me walk through them."

*Highlight `idx_posts_created_at`, `idx_posts_view_count`, `idx_posts_author_id`.*

> "First, three indexes on `posts`. The blog's home page is a sorted list of posts — created-at descending by default, with options for oldest and most-viewed. Without these, every list query would be a full table scan plus filesort. With them, MySQL serves the list as an ordered index scan."

*Switch to `PostService.java:79-83`.*

> "You can see the three sort modes here — they map directly to those three indexes."

*Back to `schema.sql`, highlight `idx_posts_author_id`.*

> "`idx_posts_author_id` also supports the report's author filter — `WHERE author_id = ?`."

*Highlight `idx_comments_post_id`.*

> "Next, the foreign-key index on comments. Every time you open a post, the app runs `WHERE post_id = ?` to load the comment thread. InnoDB doesn't auto-index foreign-key columns, so without this every comment lookup would scan the whole table."

*Highlight `idx_tags_is_auto`.*

> "`idx_tags_is_auto` supports the manual-tag dropdown when creating a post. The frontend hits `/api/tags?type=manual`, which runs `WHERE is_auto = false`. This index also satisfies stage 2's deliverable 2c — the dropdown is built dynamically from the database, not hardcoded."

*Highlight `idx_books_status`, `idx_books_year_read`, `idx_projects_status`.*

> "The last three indexes back the books and projects pages — both have status filters and the books page also filters by year. Same pattern: equality on a low-to-medium-cardinality column."

*Optional — drop into MySQL CLI and run:*
```sql
EXPLAIN SELECT * FROM posts WHERE author_id = 1 AND created_at >= '2026-01-01';
```

> "Quick `EXPLAIN` to confirm — the optimizer picks `idx_posts_author_id` for this query."

---

## 3. Transactions and isolation (1c) — 120 sec

*Open `PostService.java`. Show the `@Transactional` annotations.*

> "Every service method is wrapped in `@Transactional`. Spring opens a JDBC transaction on entry and commits on normal return. Read-heavy methods like `listPosts` and `getReport` are tagged `readOnly = true` so Hibernate skips dirty-checking."

> "I run at MySQL's default isolation, which is `REPEATABLE READ`, but for this workload `READ COMMITTED` would also be appropriate — it avoids gap locks and the app doesn't need repeatable-read semantics."

### The interesting case: the view_count race

*Open Git history or just describe.*

> "The most interesting concurrency case in the app is the post view counter. Let me show you how this looked in stage 2 and how I fixed it for stage 3."

*Pull up the old code — either via git or just verbally describe.*

> "In stage 2, `getPost` did this: load the post, increment the view count in Java, then save. Inside one transaction. The problem is that under any standard isolation level, two concurrent reads of the same post both see `view_count = N`, both write `N+1`, and one increment is silently lost."

*Switch to the new `PostService.java:69-77`.*

> "Here's the fix. Instead of read-modify-write in Java, I issue a single SQL UPDATE — `view_count = view_count + 1` — through a `@Modifying @Query` method on the repository."

*Switch to `PostRepository.java:28-30` and highlight `incrementViewCount`.*

> "InnoDB takes a row lock on this single statement, so the read and the write happen atomically on the database side. No more lost updates."

*Back to `PostService.java`.*

> "The 404 case is now driven by the UPDATE's affected-row count — if it returns zero, the post doesn't exist. Then I re-fetch the post so the response reflects the new view count."

### Other transactional points worth mentioning

*Stay in `PostService.java`.*

> "Two other transactional boundaries worth pointing out. First, `updatePost`: it clears the post's tags and re-adds them. Wrapping that in one transaction means a concurrent reader either sees the old tag set or the new one — never an empty intermediate state."

*Show `createPost`, `PostService.java:55-62`.*

> "Second, in `createPost`, I look up an auto date-tag and create it if it doesn't exist. There's a small race where two simultaneous post creations in the same month could both try to insert the same tag — but the `UNIQUE` constraint on `tags.tag_name` prevents duplicates. The loser's transaction rolls back, which is acceptable for this traffic level."

> "Cascading deletes — `posts → comments` and `posts → post_tags` — also happen inside the delete transaction, so you can never end up with orphan rows."

---

## 4. AI Usage — 60 sec

*Switch to a slide or just narrate over the editor.*

> "Per the AI Acceptable Use Policy, here's how I used AI on this project."

> "**Tools used:** Claude Code as my coding assistant, mainly through the CLI."

> "**What it helped with:**
> - Generating boilerplate — DTO records, repository interfaces, the basic CRUD service layer.
> - Explaining unfamiliar Spring annotations like `@Modifying` and JPA's Criteria API while I was building the report query.
> - Reviewing the code for the stage 3 deliverables and pointing out the view_count race in `getPost`, which I then fixed.
> - Writing the README and parts of this script."

> "**How I verified the output:**
> - Every Spring/JPA pattern I checked against the official Spring Data JPA docs before committing — especially the `@Modifying` semantics and the Criteria API.
> - I ran the app and tested each endpoint myself with curl and through the Angular UI.
> - For the view-count fix, I reasoned through why the atomic UPDATE solves the race before applying it."

> "**What I did NOT do:**
> - I did not paste AI-generated code I couldn't explain. Everything in this demo I can justify from first principles."

---

## 5. Outro — 15 sec

*Cut back to the running app.*

> "That covers SQL injection, indexes, transactions, and AI usage. The code is at [GitHub URL]. Thanks for watching."

---

## Pre-recording checklist

- [ ] Backend running: `./mvnw spring-boot:run` with `DB_USERNAME` / `DB_PASSWORD` set
- [ ] Frontend running: `cd frontend && npm start`
- [ ] MySQL CLI open in a second terminal (for the optional `EXPLAIN` demo)
- [ ] Editor zoom level cranked up (~150%) so code is readable on video
- [ ] These tabs/files pre-opened:
  - `src/main/resources/schema.sql`
  - `src/main/java/.../repository/PostRepository.java`
  - `src/main/java/.../service/PostService.java`
  - `src/main/java/.../config/SecurityConfig.java`
  - Browser at `http://localhost:4200`
- [ ] Audio level checked
- [ ] One dry run before recording the final take
