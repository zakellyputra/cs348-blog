# Frontend Style Brief

## Reference Site
https://daverupert.com — Study this site's archive page, homepage, and about page.
Do NOT clone it. Use it as a design direction reference.

## Design Principles
- Plaintext-forward, minimal, content-first
- No card shadows, no gradients, no rounded corners, no hero images
- Generous whitespace — let the content breathe
- Black text on white background, minimal accent color (one muted color for links)
- Typography does all the heavy lifting — no decorative elements
- The site should feel like a well-formatted document, not a "web app"

## Typography
- Use a system font stack or a single clean serif/monospace font
- Post titles are just larger/bolder text — no boxes, no cards
- Dates and tags should be small, muted, secondary to the title
- Body text should be comfortable reading width (~65ch max)

## Navigation
Simple horizontal nav bar at the top with plain text links:
- About
- Archives (blog posts)
- Books
- Projects

No hamburger menu, no icons, no dropdowns. Just links in a row.
The current page's nav link should be subtly indicated (bold or underline).

## Pages & Layout

### Home
- Site name/title at top (plain text, not a logo)
- Nav bar
- "Latest Posts" section showing the 5-8 most recent posts as a simple list:
  each entry is just: **Post Title** (linked), date below it, optional tag(s)
- Footer with minimal links

### Archives (main blog listing)
- Posts grouped by year, with the year as a heading
- Each post: title (linked), date, tags — in a flat list, no cards
- Tag cloud or tag list at the top for filtering (like daverupert.com/archive)
- Sort controls (most viewed / most recent / oldest) as simple text links, not buttons

### Single Post View
- Title large at top
- Date and author below title, small and muted
- Body text in clean readable paragraphs
- Tags listed at the bottom
- Comments section below the post (simple, minimal)
- View count displayed subtly (e.g. "142 views" near the date)

### Report Page
- Filter controls at top: dropdowns for tag, author, month-year
- Date range pickers for start/end
- Results displayed as a simple table or list below filters
- Stats summary (total posts, avg views, avg comments) in a small row above results

### About
- Simple prose page with a short bio
- No sidebar, no widgets

### Books
- A list of books with title, author, and optional short note
- Grouped by year or status (reading / read / want to read)

### Projects
- A grid or list of projects with title, short description, and link
- Minimal — project cards can have a subtle border but no shadows

## Color Palette
- Background: dark navy (#1E267A)
- Text: white (#FFFFFF)
- Muted text (dates, metadata): light lavender (#A0B4F0) at reduced opacity or slightly dimmed
- Links: light lavender (#A0B4F0), underlined (like daverupert.com's style)
- Link hover: white (#FFFFFF) — brightens on hover for feedback
- Tags: light lavender (#A0B4F0), underlined same as links
- Code blocks / preformatted: slightly lighter navy background (#252E8A) with white text

## What to Avoid
- Bootstrap or Material Design aesthetics
- Card layouts with shadows and rounded corners
- Bright colors, gradients, or decorative backgrounds
- Heavy use of icons
- Animations or transitions (subtle hover underlines are fine)
- Anything that looks like a SaaS dashboard
