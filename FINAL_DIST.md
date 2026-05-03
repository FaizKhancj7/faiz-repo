# StartupNest — 7-Day Development Plan

## Complete Project File Inventory

### Backend (nodeapp/)
| File | Lines | Purpose |
|------|-------|---------|
| `index.js` | 63 | Server setup, middleware, DB connection, route mounting |
| `authUtils.js` | 67 | generateToken, validateToken, checkRole middleware |
| `models/userModel.js` | 60 | User schema with regex validation, secret question |
| `models/StartupProfile.js` | 80 | Mentor startup profile schema |
| `models/StartupSubmission.js` | 75 | Submission schema with status enum, withdrawal fields |
| `models/ErrorLog.js` | 15 | Error logging model |
| `controllers/userController.js` | 130 | signup, login, forgotPassword, verify |
| `controllers/startupProfileController.js` | 95 | createProfile, getAllProfiles, updateProfile, deleteProfile |
| `controllers/startupSubmissionController.js` | 230 | create, getEntrepreneur, getMentor, shortlist, reject, withdraw, delete |
| `routers/userRouter.js` | 20 | Auth route definitions |
| `routers/startupProfileRoutes.js` | 30 | Profile CRUD route definitions |
| `routers/startupSubmissionRoutes.js` | 70 | Submission route definitions with role guards |
| `utils/asyncHandler.js` | 12 | Try-catch wrapper for controllers |
| `utils/pagination.js` | 12 | Server-side pagination helper |
| `utils/responseHandler.js` | 20 | Standardized API response format |
| `utils/validators.js` | 25 | Input validation utilities |
| **Backend Total** | **~1004** | |

### Frontend (reactapp/src/)
| File | Lines | Purpose |
|------|-------|---------|
| `index.js` | 35 | React DOM entry point with Redux Provider |
| `index.css` | 200 | Global CSS, keyframe animations, theme utilities |
| `App.jsx` | 172 | MainLayout, RootRoute, routing, auth rehydration, AnimatedBackground |
| `config/apiConfig.js` | 8 | Axios base configuration |
| `config/themeConfig.js` | 180 | 4 theme definitions (Obsidian, Light, Midnight, Sunset) |
| `context/ThemeContext.jsx` | 88 | Theme provider with localStorage persistence |
| `store/index.js` | 15 | Redux store configuration |
| `store/userSlice.js` | 40 | Auth state (role, userName, isAuthenticated) |
| `store/startupSlice.js` | 45 | Profile list state, loading, pagination |
| `services/startupService.js` | 60 | Axios CRUD service for startup profiles |
| `services/startupSubmissionService.js` | 110 | Axios service for submissions (create, get, reject, withdraw, delete) |
| `routes/AuthRoute.jsx` | 20 | Redirects logged-in users away from auth pages |
| `routes/ProtectedRoute.jsx` | 25 | Blocks unauthenticated users, checks role |
| `components/layout/Navbar.jsx` | 450 | Role-based dynamic navbar with hover dropdowns |
| `components/layout/Footer.jsx` | 110 | Themed footer with links |
| `components/ui/Input.jsx` | 60 | Reusable themed input with error display |
| `components/ui/Button.jsx` | 45 | Reusable gradient button |
| `components/ui/ConfirmDialog.jsx` | 130 | Confirm/cancel modal with customizable actions |
| `components/ui/Dropdown.jsx` | 130 | Animated dropdown menu |
| `components/ui/EmptyState.jsx` | 35 | "No data" placeholder |
| `components/ui/Loader.jsx` | 40 | Skeleton/spinner loader |
| `components/ui/Modal.jsx` | 75 | Generic modal wrapper |
| `components/ui/Pagination.jsx` | 115 | Page navigation with prev/next |
| `components/ui/TableSkeleton.jsx` | 115 | Loading skeleton for tables |
| `components/ui/AnimatedBackground.jsx` | 70 | Particles, mesh gradients, grid, beams |
| `pages/public/LandingPage.jsx` | 190 | Public marketing page with hero, features, stats |
| `pages/public/HomePage.jsx` | 210 | Post-login dashboard with stats cards |
| `pages/auth/Login.jsx` | 225 | Login form with validation, Redux dispatch |
| `pages/auth/Signup.jsx` | 280 | Signup form with regex, role selection, secret question |
| `pages/auth/ForgotPassword.jsx` | 215 | Password reset with security answer |
| `pages/entrepreneur/ViewStartupOpportunities.jsx` | 600 | Browse mentors, "Already Applied" logic, debounced search |
| `pages/entrepreneur/SubmitIdea.jsx` | 450 | Idea form with PDF upload, funding validation |
| `pages/entrepreneur/MySubmissions.jsx` | 1100 | Full dashboard: search, PDF viewer, status tracking, withdrawal |
| `pages/mentor/StartupProfileForm.jsx` | 420 | Create/edit mentor profile form |
| `pages/mentor/ViewStartupProfiles.jsx` | 650 | Searchable table with edit/delete actions |
| `pages/mentor/StartupSubmissions.jsx` | 1100 | Admin panel: view, shortlist, reject with feedback |
| **Frontend Total** | **~7057** | |

### Grand Total: ~8061 lines | Per Member: ~1612 lines

---

## 7-Day Development Timeline

---

### 📅 DAY 1 — Project Foundation & User Authentication (Backend)

| Role | Member | Files Created/Updated | What Was Done |
|------|--------|----------------------|---------------|
| **Backend** | **Prashant** | `nodeapp/index.js`, `nodeapp/package.json`, `.env` | Set up Express server with middleware (cors, cookieParser, express.json), connected MongoDB, configured environment variables, mounted route prefixes (`/user`, `/startup`, `/submission`), wrote global error handler |
| **Backend** | **Faiz** | `nodeapp/authUtils.js`, `nodeapp/models/userModel.js` | Created JWT token generation with 1-hour expiry, built `validateToken` middleware to read cookies, built `checkRole` middleware for role-based access, designed User schema with email/mobile regex validation and secretQuestionAnswer field |
| **Frontend** | **Disha** | `reactapp/src/index.js`, `reactapp/src/index.css`, `reactapp/src/config/apiConfig.js` | Created React DOM entry point with Redux Provider, wrote base CSS with font imports and root variables, configured Axios instance with `baseURL: localhost:8080` and `withCredentials: true` |
| **Frontend** | **Animesh** | `reactapp/src/store/index.js`, `reactapp/src/store/userSlice.js` | Configured Redux Toolkit store with `configureStore`, created `userSlice` with `loginSuccess` and `logoutSuccess` reducers managing `userName`, `role`, and `isAuthenticated` state |
| **Frontend** | **Surbhi** | `reactapp/src/components/ui/Input.jsx`, `reactapp/src/components/ui/Button.jsx` | Built reusable `Input` component with label, error message display, focus border animation using theme variables. Built reusable `Button` with gradient background and hover lift effect |

---

### 📅 DAY 2 — User Authentication (Complete Flow)

| Role | Member | Files Created/Updated | What Was Done |
|------|--------|----------------------|---------------|
| **Backend** | **Disha** | `nodeapp/controllers/userController.js` | Implemented `signup` (duplicate check, password hashing, user creation), `login` (credential verification, JWT cookie setting), `forgotPassword` (secret answer validation, password update), `verify` (token-based session check) |
| **Backend** | **Animesh** | `nodeapp/routers/userRouter.js`, `nodeapp/utils/asyncHandler.js`, `nodeapp/utils/responseHandler.js` | Mounted POST `/signup`, `/login`, `/forgotPassword` and GET `/verify` routes, created async error wrapper to eliminate repetitive try-catch blocks, standardized API response format `{success, message, data}` |
| **Frontend** | **Prashant** | `reactapp/src/pages/auth/Login.jsx` | Built login page with email/password inputs, regex validation, error display, Redux `loginSuccess` dispatch on success, cookie-based auth, navigation to `/home`, "Forgot Password" link |
| **Frontend** | **Faiz** | `reactapp/src/pages/auth/Signup.jsx` | Built signup form with userName, email, mobile, password, confirmPassword, role dropdown (Entrepreneur/Mentor), secret question answer. Added regex validation for all fields, API integration, redirect on success |
| **Frontend** | **Surbhi** | `reactapp/src/pages/auth/ForgotPassword.jsx` | Built password reset page with email input, security question verification, new password + confirm fields, strong password regex validation, API call to `/forgotPassword`, redirect to `/login` on success |

---

### 📅 DAY 3 — Theme Engine, Landing Page & Navigation

| Role | Member | Files Created/Updated | What Was Done |
|------|--------|----------------------|---------------|
| **Backend** | **Surbhi** | `nodeapp/utils/validators.js`, `nodeapp/utils/pagination.js` | Created input validation helpers (email regex, funding limit checks, string sanitization), built reusable pagination utility that calculates `skip`, `limit`, `totalPages` from query params |
| **Backend** | **Prashant** | `nodeapp/models/ErrorLog.js` | Created error logging model for tracking server errors, tested all Day 1-2 auth endpoints for edge cases and error responses |
| **Frontend** | **Faiz** | `reactapp/src/config/themeConfig.js`, `reactapp/src/context/ThemeContext.jsx` | Designed 4 complete themes (Obsidian Dark, Light, Midnight Blue, Sunset) with 40+ CSS variables each (colors, gradients, shadows, borders, status colors). Built ThemeContext with `cycleTheme()`, localStorage persistence, and dynamic `document.documentElement` style injection |
| **Frontend** | **Disha** | `reactapp/src/pages/public/LandingPage.jsx`, `reactapp/src/components/layout/Footer.jsx` | Built premium public landing page with hero section (centered gradient text, bouncing badge, CTA buttons), dual-role ecosystem cards, network effect stats grid, scroll-reveal animations. Created themed footer with logo, links, social icons |
| **Frontend** | **Animesh** | `reactapp/src/components/layout/Navbar.jsx`, `reactapp/src/components/ui/Dropdown.jsx` | Built dynamic role-based navbar that renders different links for Mentor vs Entrepreneur, implemented hover-activated dropdown menus with sub-links and descriptions, added theme toggle button, mobile-responsive hamburger menu, logout with cookie clearing |

---

### 📅 DAY 4 — Startup Profile Management (Mentor CRUD)

| Role | Member | Files Created/Updated | What Was Done |
|------|--------|----------------------|---------------|
| **Backend** | **Faiz** | `nodeapp/models/StartupProfile.js`, `nodeapp/routers/startupProfileRoutes.js` | Designed StartupProfile schema with fields: title, category, description, fundingLimit (min: 0), equity, deadline, mentorId. Mounted CRUD routes: POST `/create`, GET `/all`, PUT `/:id`, DELETE `/:id` with `validateToken` and `checkRole('Mentor')` guards |
| **Backend** | **Animesh** | `nodeapp/controllers/startupProfileController.js` | Implemented `createProfile` (with mentor ownership via `req.user`), `getAllProfiles` (with case-insensitive regex search, server-side pagination, sort by newest), `updateProfile` and `deleteProfile` (both with ownership verification — only the creator can modify/remove) |
| **Frontend** | **Prashant** | `reactapp/src/pages/mentor/StartupProfileForm.jsx` | Built dynamic form that works for both creating new profiles and editing existing ones (detects via navigation state), implemented all field inputs with validation, category dropdown, funding limit input, submission with success/error toasts |
| **Frontend** | **Surbhi** | `reactapp/src/pages/mentor/ViewStartupProfiles.jsx` | Built searchable profiles table with columns (Title, Category, Funding Limit, Equity, Deadline), integrated search bar with debounce, pagination controls, edit button (navigates to form with pre-filled data), delete button with ConfirmDialog |
| **Frontend** | **Disha** | `reactapp/src/services/startupService.js`, `reactapp/src/store/startupSlice.js` | Created full Axios CRUD service: `createProfile()`, `getAllProfiles(params)`, `updateProfile(id, data)`, `deleteProfile(id)`. Built Redux slice to manage profile list, loading state, and pagination metadata |

---

### 📅 DAY 5 — Startup Submission System (Entrepreneur Side)

| Role | Member | Files Created/Updated | What Was Done |
|------|--------|----------------------|---------------|
| **Backend** | **Disha** | `nodeapp/models/StartupSubmission.js`, `nodeapp/routers/startupSubmissionRoutes.js` | Designed StartupSubmission schema with fields: entrepreneurId, profileId, ideaTitle, ideaDescription, fundingRequired, businessPlan (PDF path), status (enum: pending/approved/rejected), rejectionFeedback, isWithdrawn, withdrawalReason, withdrawnAt. Mounted all routes with role-specific middleware |
| **Backend** | **Surbhi** | `nodeapp/controllers/startupSubmissionController.js` (createSubmission, getEntrepreneurSubmissions, getMentorSubmissions) | Implemented `createSubmission` with Multer PDF upload and funding limit validation against mentor profile, `getEntrepreneurSubmissions` with pagination and category search, `getMentorSubmissions` filtered by mentor's own profiles |
| **Frontend** | **Faiz** | `reactapp/src/services/startupSubmissionService.js` | Built complete submission API service: `submitIdea()` with multipart/form-data for PDF, `getMySubmissions()` with pagination/search params, `getMentorSubmissions()`, `shortlistSubmission()`, `rejectSubmission()`, `withdrawSubmission()`, `deleteMySubmission()` |
| **Frontend** | **Prashant** | `reactapp/src/pages/entrepreneur/ViewStartupOpportunities.jsx` | Built mentor browsing page: displays all available startup profiles in card layout, 500ms debounced search, "Already Applied" button disabling by comparing user's submission history with profile list, "Submit Idea" button that packs profileId/category/fundingLimit into navigation state |
| **Frontend** | **Animesh** | `reactapp/src/pages/entrepreneur/SubmitIdea.jsx` | Built idea submission form: receives mentor profile context from navigation state, ideaTitle, ideaDescription inputs, fundingRequired with inline validation against mentor's fundingLimit, PDF file upload with type/size validation, success modal on submission, redirect back to opportunities |

---

### 📅 DAY 6 — Mentor Review Panel & Entrepreneur Dashboard

| Role | Member | Files Created/Updated | What Was Done |
|------|--------|----------------------|---------------|
| **Backend** | **Prashant** | `nodeapp/controllers/startupSubmissionController.js` (shortlistSubmission, rejectSubmission) | Implemented `shortlistSubmission` (status change to 'approved' with validation), `rejectSubmission` with mandatory rejectionFeedback field requiring minimum 10 characters, both with ownership checks ensuring only the profile's mentor can act |
| **Backend** | **Animesh** | `nodeapp/controllers/startupSubmissionController.js` (deleteSubmission, withdrawSubmission) | Implemented `deleteEntrepreneurSubmission` with strict ownership validation, `withdrawSubmission` allowing only 'approved' (shortlisted) submissions to be withdrawn, recording withdrawalReason and withdrawnAt timestamp |
| **Frontend** | **Disha** | `reactapp/src/pages/mentor/StartupSubmissions.jsx` | Built full mentor admin panel: tabular display of all received submissions, PDF document viewer in modal, "View Details" expanding card, "Shortlist" button with confirm dialog, "Reject" button opening feedback modal with 10-char minimum validation, status badges, conditional action-locking for already-processed or withdrawn submissions |
| **Frontend** | **Surbhi** | `reactapp/src/pages/entrepreneur/MySubmissions.jsx` | Built entrepreneur tracking dashboard: searchable submission history table, PDF viewer modal, profile detail expansion, color-coded status badges (pending=amber, approved=green, rejected=red, withdrawn=grey), rejection feedback display in soft-red alert box, withdrawal modal with required reason input, mobile-responsive card layout |
| **Frontend** | **Faiz** | `reactapp/src/components/ui/ConfirmDialog.jsx`, `reactapp/src/components/ui/Modal.jsx`, `reactapp/src/components/ui/EmptyState.jsx` | Built ConfirmDialog with customizable title/message/confirmText/cancelText and showCancel toggle for success-only modals. Built generic Modal wrapper with backdrop click-to-close. Built EmptyState placeholder with icon and message |

---

### 📅 DAY 7 — Animations, Route Guards & Final Polish

| Role | Member | Files Created/Updated | What Was Done |
|------|--------|----------------------|---------------|
| **Backend** | **Disha** | `nodeapp/controllers/startupSubmissionController.js`, `nodeapp/models/StartupSubmission.js` | Final data integrity audit: ensured status enum consistency across all controllers, verified all ownership checks, tested pagination edge cases (empty results, last page), confirmed rejection feedback and withdrawal reason persistence |
| **Backend** | **Animesh** | `nodeapp/index.js`, `nodeapp/routers/startupSubmissionRoutes.js` | Final API security audit: verified all protected routes have `validateToken` + `checkRole` guards, tested CORS configuration, validated global error handler catches all edge cases, confirmed cookie settings |
| **Frontend** | **Surbhi** | `reactapp/src/components/ui/AnimatedBackground.jsx`, `reactapp/src/index.css` (animations) | Created reusable AnimatedBackground component with 200-particle digital system, hue-shifting mesh gradients, animated tech-grid overlay, sweeping energy beams. Added CSS keyframes: `badgeBounce`, `liquid`, `float`, `gridMove`, `beamSweep`, `hueRotate`, `particleFlow` |
| **Frontend** | **Faiz** | `reactapp/src/App.jsx`, `reactapp/src/routes/AuthRoute.jsx`, `reactapp/src/routes/ProtectedRoute.jsx` | Integrated AnimatedBackground into MainLayout for global dashboard animations, finalized RootRoute logic (landing vs dashboard), built AuthRoute guard (redirects logged-in users to /home), built ProtectedRoute guard (blocks unauthenticated + wrong role), added water-drop click effect |
| **Frontend** | **Prashant** | `reactapp/src/pages/public/HomePage.jsx`, `reactapp/src/components/ui/Pagination.jsx`, `reactapp/src/components/ui/TableSkeleton.jsx`, `reactapp/src/components/ui/Loader.jsx` | Built post-login dashboard with dynamic stats cards (Total, Pending, Shortlisted, Rejected) fetched from API, role-aware messaging. Created Pagination component with prev/next/page buttons, TableSkeleton loading placeholder, and Loader spinner |

---

## Member Contribution Summary

### Prashant
| Day | Role | Key Contribution |
|-----|------|-----------------|
| Day 1 | Backend | Server setup, Express middleware, MongoDB connection |
| Day 2 | Frontend | Login page with validation and Redux auth dispatch |
| Day 3 | Backend | Error logging model, auth API testing |
| Day 4 | Frontend | Startup Profile create/edit form |
| Day 5 | Frontend | Browse Mentors page with "Already Applied" logic |
| Day 6 | Backend | Shortlist & Reject controllers with feedback validation |
| Day 7 | Frontend | Dashboard stats cards, Pagination, TableSkeleton, Loader |

### Faiz
| Day | Role | Key Contribution |
|-----|------|-----------------|
| Day 1 | Backend | JWT auth system, validateToken/checkRole, User schema |
| Day 2 | Frontend | Signup form with full regex validation |
| Day 3 | Frontend | 4-theme design system (themeConfig + ThemeContext) |
| Day 4 | Backend | StartupProfile model & routes |
| Day 5 | Frontend | Submission API service layer |
| Day 6 | Frontend | ConfirmDialog, Modal, EmptyState components |
| Day 7 | Frontend | App routing, route guards, AnimatedBackground integration |

### Disha
| Day | Role | Key Contribution |
|-----|------|-----------------|
| Day 1 | Frontend | React entry point, base CSS, Axios config |
| Day 2 | Backend | User controller (signup, login, forgotPassword, verify) |
| Day 3 | Frontend | Landing page, Footer |
| Day 4 | Frontend | Startup API service, Redux startupSlice |
| Day 5 | Backend | Submission model & routes with role guards |
| Day 6 | Frontend | Mentor admin panel (StartupSubmissions.jsx) |
| Day 7 | Backend | Data integrity audit, status enum validation |

### Animesh
| Day | Role | Key Contribution |
|-----|------|-----------------|
| Day 1 | Frontend | Redux store setup, userSlice |
| Day 2 | Backend | User routes, asyncHandler, responseHandler utilities |
| Day 3 | Frontend | Dynamic Navbar with dropdowns, Dropdown component |
| Day 4 | Backend | Profile CRUD controller (search, pagination, ownership) |
| Day 5 | Frontend | SubmitIdea form with PDF upload & funding validation |
| Day 6 | Backend | Delete & Withdraw submission controllers |
| Day 7 | Backend | API security audit, route guard verification |

### Surbhi
| Day | Role | Key Contribution |
|-----|------|-----------------|
| Day 1 | Frontend | Reusable Input & Button components |
| Day 2 | Frontend | ForgotPassword page with security question flow |
| Day 3 | Backend | Input validators, pagination utility |
| Day 4 | Frontend | ViewStartupProfiles searchable table |
| Day 5 | Backend | Submission create/get controllers with funding validation |
| Day 6 | Frontend | Entrepreneur MySubmissions dashboard |
| Day 7 | Frontend | AnimatedBackground component, CSS animations |

---

## Backend/Frontend Split Per Member

| Member | Backend Days | Frontend Days | Total |
|--------|-------------|---------------|-------|
| Prashant | 3 (Day 1, 3, 6) | 4 (Day 2, 4, 5, 7) | 7 |
| Faiz | 2 (Day 1, 4) | 5 (Day 2, 3, 5, 6, 7) | 7 |
| Disha | 3 (Day 2, 5, 7) | 4 (Day 1, 3, 4, 6) | 7 |
| Animesh | 3 (Day 2, 4, 6) | 4 (Day 1, 3, 5, 7) | 7 |
| Surbhi | 2 (Day 3, 5) | 5 (Day 1, 2, 4, 6, 7) | 7 |
