-- ============================================
-- CS348 Blog Application - Database Schema
-- Stack: Angular / Spring Boot / MySQL
-- ============================================

CREATE DATABASE IF NOT EXISTS blog_app;
USE blog_app;

-- ============================================
-- TABLES
-- ============================================

CREATE TABLE IF NOT EXISTS roles (
    role_id   INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS users (
    user_id       INT AUTO_INCREMENT PRIMARY KEY,
    username      VARCHAR(100) NOT NULL,
    email         VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role_id       INT NOT NULL,
    created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(role_id)
);

CREATE TABLE IF NOT EXISTS posts (
    post_id    INT AUTO_INCREMENT PRIMARY KEY,
    title      VARCHAR(255) NOT NULL,
    body       TEXT NOT NULL,
    author_id  INT NOT NULL,
    view_count INT NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS tags (
    tag_id   INT AUTO_INCREMENT PRIMARY KEY,
    tag_name VARCHAR(100) NOT NULL UNIQUE,
    is_auto  BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS post_tags (
    post_id INT NOT NULL,
    tag_id  INT NOT NULL,
    PRIMARY KEY (post_id, tag_id),
    FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id)  REFERENCES tags(tag_id)  ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS comments (
    comment_id INT AUTO_INCREMENT PRIMARY KEY,
    post_id    INT NOT NULL,
    user_id    INT NOT NULL,
    body       TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS books (
    book_id     INT AUTO_INCREMENT PRIMARY KEY,
    title       VARCHAR(255) NOT NULL,
    author      VARCHAR(255) NOT NULL,
    status      ENUM('reading', 'read', 'want_to_read') NOT NULL DEFAULT 'want_to_read',
    rating      TINYINT CHECK (rating BETWEEN 1 AND 5),
    notes       TEXT,
    year_read   YEAR,
    cover_url   VARCHAR(500),
    created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS projects (
    project_id  INT AUTO_INCREMENT PRIMARY KEY,
    title       VARCHAR(255) NOT NULL,
    description TEXT,
    repo_url    VARCHAR(500),
    live_url    VARCHAR(500),
    tech_stack  VARCHAR(500),
    status      ENUM('active', 'completed', 'archived') NOT NULL DEFAULT 'active',
    source      ENUM('manual', 'github') NOT NULL DEFAULT 'manual',
    created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- INDEXES
-- (Stage 3 discussion material)
-- ============================================

-- Posts
CREATE INDEX idx_posts_created_at ON posts(created_at);   -- sort by most recent / oldest
CREATE INDEX idx_posts_view_count ON posts(view_count);    -- sort by most viewed
CREATE INDEX idx_posts_author_id  ON posts(author_id);     -- filter by author (report + dropdown)

-- Comments
CREATE INDEX idx_comments_post_id ON comments(post_id);    -- fetch comments for a post

-- Tags
CREATE INDEX idx_tags_is_auto ON tags(is_auto);            -- filter auto vs manual for dropdowns

-- Books
CREATE INDEX idx_books_status    ON books(status);         -- filter by reading status
CREATE INDEX idx_books_year_read ON books(year_read);      -- group/filter by year

-- Projects
CREATE INDEX idx_projects_status ON projects(status);      -- filter by active/completed/archived

-- ============================================
-- SEED DATA
-- ============================================

-- Default roles
INSERT IGNORE INTO roles (role_name) VALUES ('admin'), ('guest');

-- Sample admin user
-- To regenerate the hash for a different password:
--   htpasswd -nbBC 10 "" yourpassword | cut -d: -f2
INSERT IGNORE INTO users (username, email, password_hash, role_id)
VALUES ('admin', 'admin@blog.local', '$2y$10$YxJmpa4A7Q4O12TtcrUuA.NoCoaIWSNH10fldCQ3hwHhGxtrFObwW', 1);

-- Sample manual tags
INSERT IGNORE INTO tags (tag_name, is_auto) VALUES
    ('technology', FALSE),
    ('travel',     FALSE),
    ('cooking',    FALSE),
    ('fitness',    FALSE),
    ('coding',     FALSE),
    ('embedded',   FALSE),
    ('mandarin',   FALSE);

-- Sample auto date tags
INSERT IGNORE INTO tags (tag_name, is_auto) VALUES
    ('November 2025', TRUE),
    ('December 2025', TRUE),
    ('January 2026',  TRUE),
    ('February 2026', TRUE),
    ('March 2026',    TRUE);

-- Sample posts (2 per month, Nov 2025 – Mar 2026)
INSERT IGNORE INTO posts (post_id, title, body, author_id, view_count, created_at, updated_at) VALUES
    (1,  'Getting Started with ESP32',          'A beginner-friendly walkthrough of setting up the ESP32 development environment and blinking your first LED.',                              1, 42,  '2025-11-05 10:00:00', '2025-11-05 10:00:00'),
    (2,  'My Mandarin Study Routine',           'How I structure daily Mandarin practice using spaced repetition, podcasts, and conversation exchanges.',                                    1, 28,  '2025-11-18 14:30:00', '2025-11-18 14:30:00'),
    (3,  'Winter Break Project Ideas',           'A list of side-project ideas to tackle over winter break, from home automation to recipe apps.',                                           1, 65,  '2025-12-03 09:15:00', '2025-12-03 09:15:00'),
    (4,  'Reflections on Fall Semester',          'Looking back on courses, group projects, and lessons learned during the fall 2025 semester.',                                              1, 31,  '2025-12-20 16:45:00', '2025-12-20 16:45:00'),
    (5,  'Setting Up a Spring Boot API',         'Step-by-step guide to bootstrapping a REST API with Spring Boot, JPA, and MySQL.',                                                         1, 87,  '2026-01-08 11:00:00', '2026-01-08 11:00:00'),
    (6,  'Favorite Cooking Experiments',          'Documenting my best (and worst) kitchen experiments from the past month, including a surprisingly good miso carbonara.',                   1, 53,  '2026-01-22 19:00:00', '2026-01-22 19:00:00'),
    (7,  'Angular Signals Deep Dive',            'Exploring Angular signals and how they compare to RxJS-based state management patterns.',                                                  1, 74,  '2026-02-04 08:30:00', '2026-02-04 08:30:00'),
    (8,  'Running in the Cold',                  'Tips and gear recommendations for keeping up a running habit through the coldest weeks of winter.',                                         1, 19,  '2026-02-17 13:00:00', '2026-02-17 13:00:00'),
    (9,  'Database Indexing Strategies',          'Explaining B-tree vs hash indexes, composite indexes, and when to add them to your schema.',                                               1, 96,  '2026-03-06 10:00:00', '2026-03-06 10:00:00'),
    (10, 'Mid-Semester Check-In',                'A quick update on how the spring semester is going and what I am working on next.',                                                         1, 38,  '2026-03-21 15:30:00', '2026-03-21 15:30:00');

-- Link posts to their auto date tags + a manual tag each
INSERT IGNORE INTO post_tags (post_id, tag_id) VALUES
    -- Nov 2025 posts → 'November 2025' tag + manual tags
    (1,  (SELECT tag_id FROM tags WHERE tag_name = 'November 2025')),
    (1,  (SELECT tag_id FROM tags WHERE tag_name = 'embedded')),
    (2,  (SELECT tag_id FROM tags WHERE tag_name = 'November 2025')),
    (2,  (SELECT tag_id FROM tags WHERE tag_name = 'mandarin')),
    -- Dec 2025 posts
    (3,  (SELECT tag_id FROM tags WHERE tag_name = 'December 2025')),
    (3,  (SELECT tag_id FROM tags WHERE tag_name = 'coding')),
    (4,  (SELECT tag_id FROM tags WHERE tag_name = 'December 2025')),
    (4,  (SELECT tag_id FROM tags WHERE tag_name = 'technology')),
    -- Jan 2026 posts
    (5,  (SELECT tag_id FROM tags WHERE tag_name = 'January 2026')),
    (5,  (SELECT tag_id FROM tags WHERE tag_name = 'coding')),
    (6,  (SELECT tag_id FROM tags WHERE tag_name = 'January 2026')),
    (6,  (SELECT tag_id FROM tags WHERE tag_name = 'cooking')),
    -- Feb 2026 posts
    (7,  (SELECT tag_id FROM tags WHERE tag_name = 'February 2026')),
    (7,  (SELECT tag_id FROM tags WHERE tag_name = 'coding')),
    (8,  (SELECT tag_id FROM tags WHERE tag_name = 'February 2026')),
    (8,  (SELECT tag_id FROM tags WHERE tag_name = 'fitness')),
    -- Mar 2026 posts
    (9,  (SELECT tag_id FROM tags WHERE tag_name = 'March 2026')),
    (9,  (SELECT tag_id FROM tags WHERE tag_name = 'technology')),
    (10, (SELECT tag_id FROM tags WHERE tag_name = 'March 2026')),
    (10, (SELECT tag_id FROM tags WHERE tag_name = 'coding'));

-- Sample comments on a few posts
INSERT IGNORE INTO comments (comment_id, post_id, user_id, body, created_at) VALUES
    (1, 1, 1, 'Great intro! I just got my first ESP32 board.',       '2025-11-06 08:00:00'),
    (2, 5, 1, 'This saved me so much setup time, thanks!',          '2026-01-09 12:00:00'),
    (3, 7, 1, 'Signals are a game-changer for Angular.',             '2026-02-05 09:30:00'),
    (4, 9, 1, 'The composite index section was really helpful.',     '2026-03-07 11:00:00'),
    (5, 9, 1, 'Would love a follow-up on query plan analysis.',      '2026-03-08 14:00:00');

-- Sample books
INSERT IGNORE INTO books (title, author, status, rating, year_read) VALUES
    ('The C Programming Language', 'Kernighan & Ritchie', 'read', 5, 2025),
    ('Designing Data-Intensive Applications', 'Martin Kleppmann', 'reading', NULL, NULL);

-- Sample projects
INSERT IGNORE INTO projects (title, description, repo_url, tech_stack, status, source) VALUES
    ('Adventure Bug', 'Browser-controlled ESP32 exploration robots with live camera feeds', NULL, 'ESP32, WebSocket, C++', 'completed', 'manual'),
    ('CS348 Blog', 'Personal blog built with Angular, Spring Boot, and MySQL', NULL, 'Angular, Spring Boot, MySQL', 'active', 'manual');
