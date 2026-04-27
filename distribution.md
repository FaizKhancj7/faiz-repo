# Project Work Distribution Plan

## Saturday - Sunday (Completed Work):

#### **👤 Member 1 - Backend Systems Architect:**
- `nodeapp/index.js` (server setup, middleware, DB connection, route mounting)
- `nodeapp/models/userModel.js` (user schema with regex validation, secret question)
- `nodeapp/authUtils.js` (generateToken, validateToken, checkRole)
- `nodeapp/.env` (environment config)

#### **👤 Member 2 - Backend API Logic Developer:**
- `nodeapp/controllers/userController.js` (signup, login, forgot password controllers)
- `nodeapp/routers/userRouter.js` (all user auth routes)

#### **👤 Member 3 - Frontend State and Routing Manager:**
- `reactapp/src/store.js` (Redux store setup)
- `reactapp/src/slices/userSlice.js` (auth state, role, username)
- `reactapp/src/App.jsx` (AuthRoute, ProtectedRoute, cookie rehydration on reload)
- `reactapp/src/apiConfig.js` (Axios base config)

#### **👤 Member 4 - Frontend UI/UX Specialist:**
- `reactapp/src/Components/Reusable/Input.jsx` (reusable input component)
- `reactapp/src/Components/Reusable/Button.jsx` (reusable button component)
- `reactapp/src/Components/HomePage.jsx` (hero section with background image and contact us section)
- `reactapp/src/MentorComponents/MentorNavbar.jsx` (mentor role navbar with logout confirm)
- `reactapp/src/EntrepreneurComponents/EntrepreneurNavbar.jsx` (entrepreneur role navbar with logout confirm)

#### **👤 Member 5 - Frontend Feature Developer:**
- `reactapp/src/Components/Login.jsx` (login form, regex validation, redux dispatch, cookie, role redirect)
- `reactapp/src/Components/Signup.jsx` (signup form, regex validation, redirect to home on success)
- `reactapp/src/Components/ForgotPassword.jsx` (secret answer check, password reset, redirect to login)

---

## Monday: Startup Profiles & Reusable Components (COMPLETED)

#### **👤 Member 1 - Backend Systems Architect:**
- `nodeapp/controllers/startupProfileController.js` (Implemented `createProfile` and `getAllProfiles` base logic)
- `nodeapp/routers/startupProfileRoutes.js` (Mounted all startup endpoints)
- `nodeapp/index.js` (Registered startup routes at `/api/startup`)

#### **👤 Member 2 - Backend API Logic Developer:**
- `nodeapp/controllers/startupProfileController.js` (Added case-insensitive regex search, server-side pagination, and sort)
- `nodeapp/controllers/startupProfileController.js` (Implemented `updateProfile` and `deleteProfile` with ownership checks)
- `nodeapp/models/StartupProfile.js` (Applied `min: 0` constraints and validation error messages)

#### **👤 Member 3 - Frontend State and Routing Manager:**
- `reactapp/src/services/startupService.js` (Built full CRUD Axios service: Create, Get All, Update, Delete)
- `reactapp/src/slices/startupSlice.js` (Managed profile list state, loading, and pagination metadata)
- `reactapp/src/App.jsx` (Refactored `MainLayout` to dynamically render role-based navbars)
- `reactapp/src/App.jsx` (Implemented `RootRoute` logic to switch between Landing and Dashboard)

#### **👤 Member 4 - Frontend UI/UX Specialist:**
- `reactapp/src/Components/Reusable/Table.jsx`, `Pagination.jsx`, `Loader.jsx` (Created core data display library)
- `reactapp/src/Components/HomePage.jsx` (Optimized layout by removing internal navbar imports)
- `reactapp/src/Components/Reusable/Input.jsx` (Enhanced to support standard HTML attributes like `min`)
- `reactapp/src/Components/LandingPage.jsx` (Designed and implemented the premium public marketing page)

#### **👤 Member 5 - Frontend Feature Developer:**
- `reactapp/src/MentorComponents/StartupProfileForm.jsx` (Created dynamic form for both listing and editing)
- `reactapp/src/MentorComponents/ViewStartupProfiles.jsx` (Built searchable table with edit/delete actions)
- `reactapp/src/EntrepreneurComponents/ViewStartupOpportunities.jsx` (Created the entrepreneur browsing interface)
- `reactapp/src/MentorComponents/MentorNavbar.jsx` & `EntrepreneurNavbar.jsx` (Implemented hover-based navigation dropdowns)
- `reactapp/src/Components/Reusable/ConfirmDialog.jsx`, `Modal.jsx`, `EmptyState.jsx` (Added interactive UI feedback)

---

## Tuesday: Startup Submissions & Shortlisting

*To be filled after previous day is complete.*

---

## Wednesday: Admin Dashboard & Advanced Filtering

*To be filled after previous day is complete.*

---

## Thursday: Integration, Testing & Final Polish

*To be filled after previous day is complete.*
