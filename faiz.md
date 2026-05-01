# 🚀 StartupNest: Authentication & State Management Core Concepts

## 1. Redux: The App's "Temporary Memory"

Since React components are independent, we need a way to share data (like the user's name) between them. We use **Redux** as a central storage.

- **The Store (`store.js`)**: The physical "Brain" or "Vault" where all data is kept.
- **The Slice (`userSlice.js`)**: A specific section of the vault dedicated only to **User Information**.
- **Initial State**: The starting values when the app wakes up.
  - `isAuthenticated: null` (The "Checking" state)
  - `userName: null`
  - `role: null`

### How we update the Slice (Actions):

- **`loginSuccess`**: This is like a "Deposit" form. When the API says the user is valid, we send their name and role here to save them in memory.
- **`logoutSuccess`**: This is the "Clear All" button. It resets the state to `false` and `null` so the app knows the user is gone.
- **The Reducer**: The logic that actually changes the data inside the vault based on these actions.

## 2. The "Traffic Light" Logic (Handling Auth States)

We use three states for `isAuthenticated` to ensure a smooth user experience:

- 🟡 **`null` (Yellow)**: The app is still checking for cookies (Loading state).
- 🟢 **`true` (Green)**: The user is confirmed and logged in.
- 🔴 **`false` (Red)**: The user is confirmed as a guest/logged out.

## 3. Rehydration: Fixing "App Amnesia"

When you refresh the browser, Redux memory is wiped. We use a **Rehydration Bridge** in `App.js` to fix this:

- **The Process**: On every page load, `useEffect` calls the backend `/user/verify` endpoint.
- **The Cookie**: The backend looks at your browser's **Cookie** (which survives a refresh).
- **The Update**: If the cookie is valid, the backend sends user data, and we **Dispatch** it back into Redux memory.

## 4. Route Guards: The Security Gates

We use two custom components to control who sees which page:

### A. ProtectedRoute (The Member Gate)

- Used for: `HomePage`, `Dashboards`.
- Rule: If `isAuthenticated` is **NOT** true, it kicks you to `/login`.
- Purpose: Ensures only logged-in members can see private content.

### B. AuthRoute (The Guest Gate)

- Used for: `Login`, `Signup`, `ForgotPassword`.
- Rule: If `isAuthenticated` is **ALREADY** true, it kicks you to `/home`.
- Purpose: Prevents logged-in users from seeing "Join Us" forms they've already completed.

## 5. Security Standards (PRD Compliance)

- **Cookies Only**: We **never** store sensitive data or tokens in `localStorage`. This prevents XSS attacks.
- **HTTP-Only**: Our JWT token is stored in an `httpOnly` cookie, meaning JavaScript cannot touch it—only the browser and server can see it.
- **Global Redirect**: Per your specific rule, every page on the site is now **Protected** except for the 3 main Auth pages.

## 6. API Communication (`apiConfig.js`)

Instead of just exporting a string (URL), we use **`axios.create()`** to create a custom "API Tool."

### Why `axios.create` vs. a Simple String?

- **Value vs. Tool**: A string is just text. `axios.create` is a pre-configured version of the Axios library.
- **Auto-Config**: It automatically adds the `baseURL` and `withCredentials` to every request. You don't have to type them manually in every file.
- **Centralization**: If you want to add "Interceptors" (like a global error handler or a loading spinner), you can do it once in this file.

### What is `withCredentials: true`?

This is a **predefined browser keyword** that handles "Keychain" access.

- **The Browser's Rule**: By default, browsers are "shy." They won't send your login cookies to a different port (3000 to 8080) for security.
- **The Unlock**: Setting this to `true` tells the browser: _"It's okay, attach the cookies for this backend to my request."_
- **The Requirement**: This **must** be set to `true` on both the Frontend (Axios) and the Backend (CORS) for authentication to work.

---

# 📋 Project Context Summary (Full AI Handoff Document)

## 1. Project Overview & Identity
- **Project Name**: StartupNest
- **Core Mission**: A professional networking platform where **Mentors** list "Startup Opportunities" and **Entrepreneurs** discover them.

## 2. Full Tech Stack
- **Backend**: Node.js, Express, MongoDB.
- **Frontend**: React, Redux Toolkit, TailwindCSS.

---

# 📝 NEW FEATURE: Mentor Rejection Feedback

This update implements a professional "Decline with Reason" flow, ensuring Entrepreneurs receive constructive feedback when their pitch is rejected.

## 1. Files Changed & Updated
- **Backend (Node.js)**:
    - `models/StartupSubmission.js`: Updated the data schema to support string-based statuses and feedback storage.
    - `controllers/startupSubmissionController.js`: Added the `rejectSubmission` logic and updated status filtering.
    - `routers/startupSubmissionRoutes.js`: Mounted the new `PUT /:id/reject` endpoint.
- **Frontend (React)**:
    - `services/startupSubmissionService.js`: Added the `rejectSubmission` API bridge.
    - `MentorComponents/StartupSubmissions.jsx`: Implemented the Rejection Modal and transitioned to string-based statuses.
    - `EntrepreneurComponents/MySubmissions.jsx`: Developed the UI for displaying rejection reasons via a professional **Message Icon** and **Justification Modal**.

## 2. The Technical Upgrade
We moved away from numbers (`1, 2, 3`) and transitioned to a professional **String Enum** in the database:
- `'pending'`: Initial state.
- `'approved'`: Shortlisted.
- `'rejected'`: Declined with feedback.

---

# 📝 NEW FEATURE: Entrepreneur Idea Withdrawal

Allows Entrepreneurs to retract shortlisted ideas with a documented reason, accessible to Mentors via a clean modal interface.

1.  **Audit Trail**: Added `isWithdrawn`, `withdrawalReason`, and `withdrawnAt` to the database.
2.  **UI flow**: Integrated the **Withdrawal Details Modal** in the Mentor dashboard for transparency without table clutter.

---

**Everything is reverted to the state before the Nodemailer implementation. Ready to continue!**
