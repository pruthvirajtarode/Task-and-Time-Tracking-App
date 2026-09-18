# TaskFlow AI

"Plan your work. Track your time. Understand your productivity."

TaskFlow AI is a premium full-stack SaaS application that allows users to seamlessly manage their tasks, track their time using a real-time global timer, and understand their productivity through comprehensive analytics. 

## 🚀 Live Demo & Deliverables
- ✅ **Live Demo Link**: [Insert Your Vercel Link Here]
- ✅ **Working Authentication**: Secure JWT Auth implemented.
- ✅ **Test Credentials**: `demo@taskflow.ai` / `DemoPassword123!`

## Features
- **Authentication**: Secure JWT-based authentication with password hashing.
- **Task Management**: Create, edit, and organize tasks with priority and status.
- **AI Task Enhancement**: Optionally enhance natural language task drafts into professional titles and descriptions.
- **Real-time Time Tracking**: Start and stop timers directly from tasks. The timer persists securely via backend storage even across page reloads.
- **Productivity Dashboard**: Today's snapshot featuring tasks worked on, time tracked, and completion stats.
- **Analytics**: Weekly bar, line, and donut charts built with Recharts to visualize productivity trends.
- **Modern UI**: Built with React, Tailwind CSS, Lucide icons, Sonner for toasts, and fully responsive across devices.

## Tech Stack
- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, React Router v7, TanStack Query, Recharts.
- **Backend**: Node.js, Express, TypeScript, Prisma ORM, PostgreSQL.
- **Validation**: Zod (Frontend & Backend).

## Architecture
The application is structured as a monorepo containing `frontend` and `backend` directories. The frontend uses a context-based global state for Auth and the Timer, combined with TanStack query for server state. The backend uses a layered architecture (Routes -> Controllers -> Services) for clean separation of concerns.

## Local Setup

### Requirements
- Node.js (v18+)
- PostgreSQL (Local or Hosted)

### 1. Database Setup
You can either use a hosted Postgres database (e.g., Supabase, Render) or use the included `docker-compose.yml`:
```bash
docker-compose up -d
```

### 2. Backend Setup
```bash
cd backend
npm install
# Rename .env.example to .env and configure your variables
cp .env.example .env
# Run database migrations
npx prisma db push
# Seed the database with demo user
npx prisma db seed
# Start backend in development mode
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
# Rename .env.example to .env
cp .env.example .env
# Start frontend
npm run dev
```

## Environment Variables

**Backend (`backend/.env`)**
- `PORT`: 5000
- `DATABASE_URL`: Your PostgreSQL connection string.
- `JWT_SECRET`: Secret for signing tokens.
- `CLIENT_URL`: URL of the frontend for CORS.
- `AI_API_KEY`: (Optional) OpenAI API key for task enhancement.

**Frontend (`frontend/.env`)**
- `VITE_API_URL`: Backend API URL (e.g., `http://localhost:5000/api`)

## Deployment Instructions

### Frontend (Vercel)
1. Import the repository into Vercel.
2. Set the Root Directory to `frontend`.
3. Build command: `npm run build`
4. Add environment variable: `VITE_API_URL` pointing to the live backend.

### Backend (Render / Heroku)
1. Deploy the `backend` directory.
2. Add environment variables: `DATABASE_URL`, `JWT_SECRET`, `CLIENT_URL`.
3. Set Build Command: `npm install && npx tsc && npx prisma generate`
4. Set Start Command: `node dist/server.js`

## Demo Credentials
If you ran the seed script, you can log in with:
- **Email**: demo@taskflow.ai
- **Password**: DemoPassword123!

## AI Usage
AI development tools were used during the implementation of this assignment for architecture suggestions, code generation assistance, debugging, documentation, and UI improvements. All generated code was reviewed, integrated, tested, and modified as required. Please see `AI_USAGE.md` for specific prompts used.
