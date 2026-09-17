# TaskFlow API Documentation

Base URL: `/api`
All routes require authentication via `Authorization: Bearer <token>` unless stated otherwise.

## Authentication

### `POST /auth/register`
Creates a new user account.
- **Body:** `{ "name": "...", "email": "...", "password": "..." }`
- **Response:** `{ "success": true, "data": { "user": {...}, "token": "..." } }`

### `POST /auth/login`
Authenticates a user.
- **Body:** `{ "email": "...", "password": "..." }`
- **Response:** `{ "success": true, "data": { "user": {...}, "token": "..." } }`

### `GET /auth/me`
Fetches the currently authenticated user.

### `POST /auth/logout`
Logs out the user (client should discard token).

---

## Tasks

### `GET /tasks`
Fetch all tasks for the authenticated user.
- **Query Params:** `status` (ALL | PENDING | IN_PROGRESS | COMPLETED), `search` (string).

### `POST /tasks`
Create a task.
- **Body:** `{ "title": "...", "description": "...", "priority": "..." }`

### `PATCH /tasks/:id/status`
Update a task's status.
- **Body:** `{ "status": "COMPLETED" }`

### `PUT /tasks/:id`
### `DELETE /tasks/:id`

### `POST /tasks/enhance`
Enhance a task draft using AI.
- **Body:** `{ "input": "follow up with team" }`
- **Response:** `{ "success": true, "data": { "title": "Follow Up", "description": "..." } }`

---

## Timer & Time Logs

### `POST /tasks/:id/timer/start`
Starts a timer for a specific task. Fails if another timer is active.

### `POST /tasks/:id/timer/stop`
Stops the currently active timer for a task and records the duration.

### `GET /timer/active`
Fetches the globally active timer for the user, if any.

### `GET /timer`
Fetches all completed time logs for the user.

---

## Analytics & Dashboard

### `GET /dashboard/summary`
Returns today's aggregate statistics (Tasks Worked On, Total Time Tracked, etc.).

### `GET /analytics/weekly`
Returns daily tracked time and completed tasks array, along with top 5 tasks by time spent.
