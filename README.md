# Role Tracker Client

React frontend for the Role-Based Issue Tracking API. Built with Vite, React, and Tailwind CSS.

## Live Demo
[role-tracker-client.vercel.app](https://role-tracker-client.vercel.app)

## Features
- JWT authentication with protected routes
- Dashboard with issue list, search, and status filter
- Create issues with title and description
- Issue workspace — update status, assign users, manage comments
- Role-aware UI — admin can delete any comment, users can only delete their own
- Responsive design with Tailwind CSS

## Tech Stack
- React 18 + Vite
- React Router v6
- Axios with JWT interceptor
- React Hook Form
- Context API for global auth state
- Tailwind CSS v3

## Pages
| Page | Route | Description |
|------|-------|-------------|
| Login | /login | JWT login |
| Signup | /signup | Register account |
| Dashboard | /dashboard | View and filter all issues |
| Create Issue | /create-issue | New issue form with live preview |
| Issue Workspace | /issue/:id | Edit issue, assign users, comments |

## Setup

```bash
git clone https://github.com/krishivperiwal/role-tracker-client
cd role-tracker-client
npm install
npm run dev
```

Make sure the backend is running on `http://localhost:5000`.

## Backend
API repo: [role-based-issue-tracking-api](https://github.com/krishivperiwal/role-based-issue-tracking-api)
