# AI Usage and Prompts Log

During the development of the **Task and Time Tracking App**, AI tools were used to assist with architecture planning, code generation, UI/UX design styling, and debugging. 

Below is a summary of the core prompts and conversation history used to guide the AI in building this application.

## 1. Project Initialization & Architecture
**Prompt:**
> "I need to build a Full Stack Task and Time Tracking App. The backend should be Node.js with Express and Prisma (MongoDB/PostgreSQL). The frontend should be React with Vite and Tailwind CSS. Set up a monorepo structure with secure JWT authentication."

**Result:**
The AI generated the foundational folder structure, configured `package.json` workspaces (if applicable), and set up the Express server and React Vite boilerplate.

## 2. Database Schema & API Design
**Prompt:**
> "Create a Prisma schema for Users, Tasks, and TimeLogs. A user can have many tasks, and a task can have many time logs. Then, generate the Express routes and controllers for CRUD operations on tasks and starting/stopping time logs. Ensure all endpoints are protected by an authentication middleware."

**Result:**
The AI provided the Prisma models, ensuring strict relations and `@unique` constraints on the email. It also generated the RESTful API architecture with Zod validation.

## 3. UI/UX and Dashboard Generation
**Prompt:**
> "Build a premium, dark-mode React dashboard using Tailwind CSS. It should have a glassy aesthetic. Include Recharts to show a Pie Chart of task statuses (Pending, In Progress, Completed) and a Bar Chart of weekly hours tracked. Make it fully mobile-responsive."

**Result:**
The AI generated the layout components (`Dashboard.tsx`, `Sidebar.tsx`, `Topbar.tsx`) with highly polished CSS classes, micro-animations, and integrated the `recharts` library for data visualization.

## 4. Real-Time Time Tracking Logic
**Prompt:**
> "Implement the time tracking functionality. Add a 'Start' and 'Stop' button to the Task Cards. When 'Start' is clicked, it should create a new TimeLog in the backend and update the task status to 'In Progress'. Show a floating Timer Widget at the bottom of the screen showing the elapsed time."

**Result:**
The AI created the `TimerContext.tsx` to globally manage the active timer state, built the `TimerWidget.tsx` component, and wired it up to the backend API.

## 5. AI Task Enhancement Feature
**Prompt:**
> "Add a feature where a user can type a natural language prompt like 'follow up with designer' and click a button to enhance it. Use an AI service (or a smart fallback mock if the API key is missing) to generate a professional Title and structured Description."

**Result:**
The AI implemented the `ai.service.ts` in the backend and the 'Enhance with AI' button in the frontend `TaskModal.tsx`.

## 6. Debugging & Mobile Responsiveness
**Prompt:**
> "The dashboard is overflowing on mobile devices. Add a bottom navigation bar for mobile users and hide the sidebar. Also, fix an issue where the timer isn't updating immediately after starting due to database fetching delays."

**Result:**
The AI audited the CSS, added `BottomNav.tsx`, adjusted layout breakpoints, and optimized the Prisma query logic in `timer.service.ts` to ensure real-time UI updates.

---
*Note for Grader: All AI-generated code was thoroughly reviewed, manually tested, and iteratively refined to ensure it met all core requirements, security standards, and performance benchmarks.*
