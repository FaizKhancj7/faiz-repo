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
- **Core Mission**: A professional networking platform where **Mentors** list "Startup Opportunities" (Profiles) and **Entrepreneurs** discover them and submit "Startup Ideas" (Submissions).
- **Core Standard**: Follow the `StartupNest_PRD_v2.md`. Every feature must be role-aware, responsive, and follow the "Beginner-Friendly but Professional" code style (Verbose names, multi-step logic, try/catch everywhere).

## 2. Full Tech Stack & Dependencies

- **Backend (Node.js & Express)**:
  - `mongoose`: For MongoDB modeling.
  - `jsonwebtoken`: For auth.
  - `cookie-parser`: To handle JWT in `httpOnly` cookies.
  - `cors`: Configured with `credentials: true` and specific origin.
- **Frontend (React 18 & Vite/CRA)**:
  - `redux-toolkit`: Centralized state management.
  - `react-router-dom`: Role-based route guarding.
  - `axios`: Centralized instance with `withCredentials: true`.
  - `tailwindcss`: Main styling framework.
  - `react-toastify`: Global notification system.
  - `react-icons`: Consistent iconography (e.g., `RiRocketLine`).

## 3. The "State of the App" (Logic & Patterns)

### A. Authentication Flow (The Bridge)

- **Login**: Backend issues a JWT via an `httpOnly` cookie. Frontend Redux (`userSlice`) updates `isAuthenticated: true`.
- **The Rehydration Bridge**: Essential for refresh persistence. `App.jsx` runs a `useEffect` on mount that calls `/user/verify`. If the cookie is present, the backend returns user data, and Redux is re-populated.
- **Route Protection**:
  - `ProtectedRoute`: Wraps any page that requires a login. Redirects to `/login` if `isAuthenticated` is false.
  - `AuthRoute`: Wraps Login/Signup. Redirects to `/home` if `isAuthenticated` is true.

### B. UI Architecture (The Layout Pattern)

- **Problem**: Navbars used to flicker or disappear on page changes.
- **Solution**: Implemented a **MainLayout** in `App.jsx`. The Navbar is determined once at the layout level based on the user's role.
- **Hover Navbars**: Navbars use a hover-based dropdown pattern for cleaner organization of "Profiles" and "Ideas."

### C. Data Handling (The API Rule)

- **No LocalStorage**: User data is **never** kept in localStorage. Only the cookie exists.
- **Axios Instance**: All calls go through `apiConfig.js` which has the `baseURL` and `withCredentials` pre-set.
- **Server-Side Pagination**: Every list (Profiles, Submissions) uses 20 items per page. The backend handles the `skip` and `limit`.
- **Debounced Search**: The search input uses a 500ms delay before triggering the API to save server resources.

## 4. File-by-File Progress Map

### Backend (`nodeapp/`)

- `index.js`: Main entry. Configures CORS, CookieParser, and Global Error Handling.
- `models/User.js`: Schema for users (Email, Mobile, Hashed Password, Role, Secret Question).
- `models/StartupProfile.js`: Schema for Mentor listings (Category, Funding, Industry).
- `models/StartupSubmission.js`: Schema for Entrepreneur ideas (Market Potential, Pitch Deck, Status).
- `controllers/userController.js`: Handles Auth (Signup, Login, Verify, Password Reset).
- `controllers/startupProfileController.js`: Full CRUD for profiles with Regex search and Pagination.
- `authUtils.js`: The security layer. Contains `validateToken` and `checkRole` middlewares.

### Frontend (`reactapp/src/`)

- `App.jsx`: The "Traffic Controller." Contains the Layout logic and the Rehydration bridge.
- `userSlice.js`: Manages `isAuthenticated`, `userName`, and `role`.
- `startupSlice.js`: Manages global lists of profiles and pagination metadata.
- `apiConfig.js`: The central "Remote Control" for API calls.
- `Components/LandingPage.jsx`: High-converting landing page for guests.
- `Components/HomePage.jsx`: Dashboard entry point for logged-in users.
- `MentorComponents/StartupProfileForm.jsx`: Reusable form for Create/Update with validation.
- `MentorComponents/ViewStartupProfiles.jsx`: Table-based view with search and pagination controls.

## 5. Team Work Distribution (5 Roles)

- **Member 1 (Systems)**: Security, Auth logic, Database setup, Middleware.
- **Member 2 (API Logic)**: Building the complex Controllers and Routers for Profiles and Submissions.
- **Member 3 (Brain/State)**: Redux Store, Slices, API configuration, and Routing logic in `App.jsx`.
- **Member 4 (UI/UX)**: Creating the Reusable Design System (Table, Pagination, Input, Button) and Layouts.
- **Member 5 (Feature Dev)**: Building the actual Pages (Login, Signup, Forms) and handling user-facing validation.

## 6. Implementation Status Detail

### ✅ Completed & Verified

1.  **Identity System**: Signup and Login with full Regex validation (Email, Password strength).
2.  **Persistence**: User stays logged in on refresh (Rehydration logic).
3.  **Profile Management**: Mentors can fully manage (CRUD) startup opportunities.
4.  **Search & Pagination**: Robust server-side pagination (20/page) and debounced search implemented.
5.  **Layout System**: Role-specific Navbars that don't flicker.
6.  **Security**: Protected/Auth routes and `httpOnly` cookie implementation.

### ⏳ The Roadmap (Next Steps)

1.  **Entrepreneur Flow**: Create the `ViewStartupOpportunities.jsx` where Entrepreneurs can browse Mentor posts.
2.  **The Submission System**: Implement the frontend for "Submit Idea" (Form with file upload for pitch decks).
3.  **Submission Review**: Implement the Mentor's view to see ideas sent to them and "Shortlist/Reject" them.
4.  **Idea Management**: Entrepreneurs need a "My Submissions" page to track their progress.

## 7. Technical Gotchas & Critical Fixes

- **The Negative Number Bug**: Users could enter `-500` for funding. **Fix**: Added `min: 0` in Mongoose and a check in the React state to block negative inputs.
- **The Empty Redux Fix**: On refresh, users were kicked to login. **Fix**: Added the `/verify` call to the Root `App.jsx` so the app "remembers" the user before the Route Guard checks them.
- **Search Performance**: Typing fast caused 20+ API calls. **Fix**: Implemented `setTimeout` debouncing in the Search component.
- **Z-Index Issue**: Navbars were overlapping modals. **Fix**: Standardized Tailwind `z-index` values for the Layout components.

---

# 🚀 PROJECT STATUS BRIEF: WHAT WE HAVE DONE

This section details every technical achievement and file built so far to establish the core of StartupNest.

## 1. The Security & Identity Core (Auth)

- **Backend (Node.js)**:
  - **JWT & Cookies**: Created a secure auth system using `jsonwebtoken` and `httpOnly` cookies. This prevents XSS attacks.
  - **Rehydration Endpoint**: Built `/user/verify` which allows the frontend to "remember" the user even after a page refresh.
  - **Middleware**: Built `validateToken` (to check login) and `checkRole` (to restrict pages to Mentor/Entrepreneur only).
- **Frontend (React & Redux)**:
  - **Redux Slice (`userSlice.js`)**: Manages the "Traffic Light" logic (`null`=checking, `true`=logged in, `false`=guest).
  - **Forms**: Fully functional `Login.jsx`, `Signup.jsx`, and `ForgotPassword.jsx` with Regex validation and Toast notifications.

## 2. The Routing & Layout Pattern

- **App.jsx**: Implemented a **MainLayout** pattern. This ensures that the Navbar (Mentor or Entrepreneur) is decided once at the top level, preventing the navbar from "flickering" when you change pages.
- **Route Guards**:
  - `ProtectedRoute`: Blocks anyone not logged in.
  - `AuthRoute`: Blocks logged-in users from seeing the Signup/Login pages.

## 3. The Mentor Module (Startup Profiles)

- **Database (`StartupProfile.js`)**: Created a Mongoose model with strict validation (no negative funding, required categories).
- **Backend Logic**: Built a controller that supports:
  - **Server-Side Pagination**: Only fetches 20 items at a time to keep the app fast.
  - **API Search**: Uses Regex to find keywords across categories and descriptions.
- **Frontend UI**:
  - **StartupProfileForm.jsx**: A smart form that handles both "Create" and "Update" (pre-fills data if editing).
  - **ViewStartupProfiles.jsx**: A professional table view with search, pagination, and confirmation dialogs for deleting.

## 4. The Reusable Component Library

We built a centralized UI kit in `src/Components/Reusable` to ensure the app looks premium and consistent:

- **`Table.jsx`**: Handles all data listings.
- **`Pagination.jsx`**: Controls the 20-item-per-page logic.
- **`ConfirmDialog.jsx`**: A custom popup for "Are you sure?" actions.
- **`Input.jsx` & `Button.jsx`**: Standardized form elements.

## 5. Progress Map (Files Built)

- `nodeapp/index.js` & `routers/` (Auth & Profile routes)
- `nodeapp/controllers/` (User & Profile logic)
- `reactapp/src/App.jsx` (Central Routing)
- `reactapp/src/store.js` & `userSlice.js` (State)
- `reactapp/src/apiConfig.js` (Axios Instance)
- `reactapp/src/MentorComponents/` (Navbar, Form, View Profiles)

---

**I have documented what we did till now. Shall I move further with the roadmap of "What we have to do" to finish the project?**

<br/>
<br/>
<br/>

# 🎯 ROADMAP: WHAT WE HAVE TO DO (To Finish the Project)

This is the remaining work required to complete the full StartupNest experience for both Mentors and Entrepreneurs.

## 1. The Startup Submission Module (Backend)

We need to build the brain for the "Idea Submission" flow:

- **`startupSubmissionController.js`**:
  - **Submit Idea**: Allow Entrepreneurs to send their pitch decks.
  - **Get Submissions**: Let Mentors see who applied to their posts.
  - **Status Control**: Let Mentors "Shortlist" or "Reject" ideas.
- **`startupSubmissionRoutes.js`**: Create the endpoints and protect them with `validateToken`.

## 2. The Entrepreneur Flow (Frontend)

- **`SubmitIdea.jsx`**: A professional form where Entrepreneurs can describe their idea, request funding, and upload a pitch deck (Base64 PDF).
- **`ViewStartupOpportunities.jsx`**: Currently built, but needs to be wired so the "Submit Idea" button actually opens the form.
- **`MySubmissions.jsx`**: A private page for Entrepreneurs to see the status of their ideas (Submitted / Shortlisted / Rejected).

## 3. The Mentor Review Flow (Frontend)

- **`StartupSubmissions.jsx`**: A control panel for Mentors to see all incoming ideas.
- **Action Buttons**: Implement the "Shortlist" and "Reject" buttons with confirmation prompts and instant status updates.

## 4. Final Wiring & Services

- **`submissionService.js`**: The tool that talks to the new submission endpoints.
- **Redux Integration**: Add a `submissionSlice` to handle global updates for the submission status across the app.

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

# 📖 NEW FEATURE: Swagger API Documentation

This update integrates **Swagger (OpenAPI)** into the backend, providing a live, interactive website to view and test every API endpoint.

## 1. Files Created & Updated

- **`nodeapp/swaggerConfig.js` (NEW)**: The central configuration where we define the API title, version, and server URL.
- **`nodeapp/index.js`**: Mounted the `/api-docs` route to serve the interactive UI.
- **`nodeapp/routers/userRouter.js`**: Added the first set of JSDoc annotations to document the Signup and Login flows.

## 2. What is Swagger and How it Works?

- **The Dashboard**: Visit `http://localhost:8080/api-docs` to see a professional list of all routes.
- **Interactive Testing**: You can click **"Try it out"** on any route, enter data, and click **"Execute"** to see the real database response without needing Postman.
- **Auto-Scanning**: The system is set up to automatically scan all files in the `routers/` folder. Whenever you add a `@swagger` comment above a route, it instantly appears in the documentation.

## 3. The Implementation Flow

1. **Config**: `swaggerConfig.js` tells the app: _"Look for documentation in my router files."_
2. **Setup**: `index.js` uses `swagger-ui-express` to turn that documentation into a visual webpage.
3. **Documentation**: We use **JSDoc comments** above our routes. These comments describe what the route does, what inputs it needs (like `email`, `password`), and what it returns (like `200 OK`).
