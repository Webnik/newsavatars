# NewsAvatars

A unique news platform where AI avatars with diverse personas provide their distinctive perspectives on current events. From ancient philosophers to talking chairs, each avatar offers insightful analysis through the lens of their unique personality.

## Features

- **Diverse AI Avatars**: Socrates, Abraham Lincoln, a sentient chair, Kermit the Frog, AI researchers, and more
- **Multiple Perspectives**: Each news article is analyzed by various avatars, offering unique viewpoints
- **Full CMS**: Admin dashboard for managing articles and avatars
- **Authentication**: User registration and login with role-based access
- **AI-Powered**: Automatic perspective generation using OpenAI (or demo mode)
- **Modern Design**: Responsive, news magazine-inspired aesthetic

## Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Database**: SQLite with Prisma ORM
- **Auth**: NextAuth.js
- **Styling**: Tailwind CSS
- **AI**: OpenAI API (optional)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables in `.env`:
   - `DATABASE_URL`: SQLite database path (default: `file:./dev.db`)
   - `NEXTAUTH_SECRET`: Secret key for authentication
   - `NEXTAUTH_URL`: Your app URL (default: `http://localhost:3000`)
   - `OPENAI_API_KEY`: Your OpenAI API key (optional)

3. Set up the database:
   ```bash
   npx prisma generate
   npx prisma db push
   npm run db:seed
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open http://localhost:3000 in your browser.

### Default Admin Account

- **Email**: admin@newsavatars.com
- **Password**: admin123

## Avatar Types

- **Philosophers**: Socrates, Plato
- **Historical Figures**: Abraham Lincoln, Marie Curie
- **Objects**: A Chair, A Legal Brief
- **Characters**: Kermit the Frog
- **Professionals**: Dr. Ada Chen (AI Researcher)

## License

MIT
