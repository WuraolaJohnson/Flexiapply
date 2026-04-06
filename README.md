# FlexiApply — Admissions Portal

FlexiApply is a modern web-based admissions portal that allows students to discover institutions, browse programs, and submit applications — while giving administrators a dedicated dashboard to review and manage those applications.

## Tech Stack

- **Frontend:** React + Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router DOM
- **Forms:** React Hook Form
- **Mock Backend:** JSON Server (`db.json`)

## Getting Started

```bash
npm install
npm run dev
```

## User Roles

| Role    | Access                                              |
|---------|-----------------------------------------------------|
| Student | Browse institutions, apply to programs, view status |
| Admin   | Review applications, manage student records         |

## Admin Registration

To register a new administrator account, navigate to the **Admin Login** page and click **"Register as Admin"**.

You will be prompted to enter an **Admin Passcode** in addition to your name, email, and password. Without the correct passcode, registration will be denied.

> **Admin Passcode:** `admin1`

Keep this passcode confidential. Only share it with trusted personnel who should have admin access.

## Project Structure

```
src/
├── api/          # Mock API and initial data
├── components/   # Reusable UI components
├── context/      # Auth context and providers
├── hooks/        # Custom React hooks
├── pages/        # Route-level page components
└── utils/        # Utility helpers
```
Vercel link: https://flexiapply.vercel.app/