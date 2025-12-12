# Bookberry 🍓

A beautiful, modern personal library manager and social book discovery platform. Bookberry allows users to track their reading journey, discover new titles, and share their thoughts with a community of book lovers.

(I basically hate the existing book library managers so far soooo...)

## Getting Started

### Prerequisites

-   Node.js (v18 or higher recommended)
-   npm or yarn

### Environment Variables

Create a `.env.local` file in the root directory and add the following keys:

```bash
# Convex
CONVEX_DEPLOYMENT=...
NEXT_PUBLIC_CONVEX_URL=...

# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...
```

### Installation & Running

Bookberry uses **Next.js** for the frontend and **Convex** for the realtime backend. You need to run both concurrently.

1.  **Install dependencies:**

    ```bash
    npm install
    ```

2.  **Start the Convex backend (in a separate terminal):**
    This syncs your schema and functions with the Convex cloud.

    ```bash
    npx convex dev
    ```

3.  **Start the Next.js development server:**

    ```bash
    npm run dev
    ```

4.  Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Tech Stack

-   **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
-   **Database & Backend**: [Convex](https://convex.dev/)
-   **Authentication**: [Clerk](https://clerk.com/)
-   **Styling**: Tailwind CSS, Vanilla CSS variables
-   **Icons**: [Lucide React](https://lucide.dev/) - *I might change this*
-   **Data Source**: Google Books API - *Might look for other sources as well*

---

## Features Implemented

### Book Discovery & Management
-   **Search**: Integrated with Google Books API to find almost any book.
-   **Personal Shelf**:
    -   Categorize books: *Want to Read*, *Reading*, *Completed*.
    -   **Progress Tracking**: Track specific page numbers for books currently being read.
    -   **Smart Status**: Automatically moves books to "Completed" when progress reaches 100%.

### Reviews & Ratings
-   **Star Ratings**: Leave 1-5 star ratings for completed books.
-   **Written Reviews**: Write detailed reviews sharing your thoughts.
-   **Community Reviews**: See what others are saying about a book on the **Book Details** page.

### Social Profiles
-   **Public User Profiles**: Click on any reviewer's name to visit their profile.
-   **Public Shelves**: Browse other users' libraries and see what they are reading.
-   **Reading Goals**: Track progress towards reading goals.

---

## Project Structure

```
├── app/                  # Next.js App Router pages
│   ├── books/[id]/       # Book Details Page
│   ├── profile/          # My Shelf (Private)
│   ├── users/[userId]/   # Public User Profiles
│   └── page.ts           # Discovery / Home Page
├── components/           # React Components
│   ├── BookCard.tsx      # Core card component (Grid/List views)
│   ├── Navbar.tsx        # Main navigation & "Log" button
│   ├── BookSearch.tsx    # Search logic & Google Books integration
│   └── ui/               # Reusable atomic components (Modal, Toast, etc.)
├── convex/               # Backend Logic
│   ├── schema.ts         # Database schema definition
│   ├── books.ts          # Queries/Mutations for books & reviews
│   └── users.ts          # Queries for user profiles
└── lib/                  # Utilities & Types
```

---

## Future Roadmap!!!

-   [ ] **Social Feed**: See a timeline of friends' reading activities.
-   [ ] **Collections**: Create custom lists (e.g., "Summer 2025", "Favorites").
-   [ ] **Dark Mode**: System-wide dark theme support.
-   [ ] **Follow System**: Ability to follow other users.
-   [ ] **Reading Stats**: Detailed charts on reading habits (pages per day, genres).
-   [ ] **Mobile App**: PWA (Progressive Web App) support for mobile installation.

---

Made with ❤️ by Kei
