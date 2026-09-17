# AI Usage

AI development tools were used during the implementation of this assignment for architecture suggestions, code generation assistance, debugging, documentation, and UI improvements. All generated code was reviewed, integrated, tested, and modified as required.

## 1. Project Architecture Prompt
"Design a monorepo file structure for a React/Node.js/PostgreSQL application focusing on a clean layered backend (Controllers/Services/Routes) and a context-driven Vite React frontend."

## 2. Database Design Prompt
"Write a Prisma schema for a task and time tracking app. I need User, Task, and TimeLog models. A user has many tasks, a user has many timelogs, and a task has many timelogs. Include indexes for efficient querying."

## 3. Authentication Implementation Prompt
"Generate Express middleware for JWT authentication. Extract the Bearer token, verify it, and attach the user ID to the request object. Also generate the login and register controller logic using bcrypt."

## 4. Time Tracking Prompt
"Design a resilient backend algorithm for a Start/Stop timer. Only one active timer can exist per user at a time. The database should be the source of truth, storing `startedAt` so that page refreshes don't reset the timer."

## 5. Dashboard & Analytics Prompt
"Write Prisma queries to aggregate time logs and completed tasks. I need to calculate total tracked seconds today, and an array of the last 7 days showing total tracked seconds per day to feed into Recharts."

## 6. UI/UX Prompt
"Create a Tailwind CSS configuration and index.css for a premium SaaS dashboard. Use a dark mode color palette similar to Linear or Notion, with subtle borders and glowing gradients."
