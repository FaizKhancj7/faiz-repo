# StartupNest Team — Member Contribution Briefs

This document explains the individual contributions of each team member for Monday's milestone. It is written in simple English to help beginners understand the role of each file and the logic used.

---

## 👤 Member 1: The Systems Architect (Backend Foundation)

**Files Worked On:**
- `nodeapp/controllers/startupProfileController.js` (Core CRUD logic)
- `nodeapp/routers/startupProfileRoutes.js` (Route mapping)
- `nodeapp/index.js` (Route mounting)

**What they did:**
Member 1 built the "skeleton" of the startup profile system. They defined how the server should react when someone wants to create a profile or see a list of profiles.

**Key Concepts Used:**
- **Controllers**: Functions that handle the incoming requests and send back responses.
- **Routers**: The logic that tells the server "if someone visits this URL, run this specific controller function."
- **Middleware**: Security checks (like checking if a user is a Mentor) that run before the main logic.
- **Mounting**: Attaching all the startup routes to the main app so they are accessible at `/api/startup`.

**Work Flow:**
1. Created the `createProfile` and `getAllProfiles` functions.
2. Mapped these functions to URLs in the router.
3. Connected the router to the main server in `index.js`.

---

## 👤 Member 2: The API Logic Developer (Advanced Backend)

**Files Worked On:**
- `nodeapp/controllers/startupProfileController.js` (Advanced logic)
- `nodeapp/models/StartupProfile.js` (Database schema & validation)

**What they did:**
Member 2 added the "intelligence" to the backend. They made sure the database is secure and that the data coming out is organized.

**Key Concepts Used:**
- **Mongoose Schema**: A set of rules for what data can be stored (e.g., "Funding cannot be negative").
- **Regex (Regular Expressions)**: A tool used to search for keywords inside long descriptions.
- **Server-Side Pagination**: Only sending 20 items at a time to the frontend to keep the app fast.
- **CRUD (Update & Delete)**: Logic to modify or remove records while making sure only the owner can do it.

**Work Flow:**
1. Updated the database model with `min: 0` constraints.
2. Added search and pagination filters to the list logic.
3. Built the `updateProfile` and `deleteProfile` functions with security checks.

---

## 👤 Member 3: The State & Routing Manager (Frontend Integration)

**Files Worked On:**
- `reactapp/src/services/startupService.js` (API communication)
- `reactapp/src/slices/startupSlice.js` (Redux state)
- `reactapp/src/App.jsx` (Global routing & Layouts)

**What they did:**
Member 3 connected the frontend to the backend and managed how users move through the app.

**Key Concepts Used:**
- **Axios**: A library used to send "messages" (API calls) to the Node.js server.
- **Redux Slices**: A way to store data (like the list of startups) so every component can access it easily.
- **Layout Pattern**: Creating a "frame" (Navbar + Content) so the menu stays the same while pages change.
- **Dynamic Routing**: Showing different navbars based on whether the user is a Mentor or Entrepreneur.

**Work Flow:**
1. Built the service layer to talk to the backend.
2. Set up Redux to remember the data fetched from the API.
3. Created the `MainLayout` and `RootRoute` to handle the app's navigation logic.

---

## 👤 Member 4: The UI/UX Specialist (Reusable Components & Branding)

**Files Worked On:**
- `reactapp/src/Components/LandingPage.jsx` (Marketing page)
- `reactapp/src/Components/Reusable/Table.jsx`, `Pagination.jsx`, `Loader.jsx`
- `reactapp/src/Components/Reusable/Input.jsx` (Enhanced with props)
- `reactapp/src/Components/HomePage.jsx` (Layout cleanup)

**What they did:**
Member 4 made the app look professional and created tools that other developers can reuse to save time.

**Key Concepts Used:**
- **Reusable Components**: Creating a generic "Table" or "Button" so we don't have to rewrite the code for every page.
- **Hero Sections**: Large, eye-catching parts of the page that tell the user what the app is about.
- **Grid Layouts**: Using Tailwind CSS to make the page look good on both phones and computers.
- **Props**: Passing data into a component to change how it looks (e.g., changing a button's color).

**Work Flow:**
1. Built the foundational components like Tables and Loaders.
2. Designed the premium Landing Page for new users.
3. Cleaned up the Home Page to work with the new layout system.

---

## 👤 Member 5: The Feature Developer (Interactive UI)

**Files Worked On:**
- `reactapp/src/MentorComponents/StartupProfileForm.jsx` (The main form)
- `reactapp/src/MentorComponents/ViewStartupProfiles.jsx` (Mentor's Dashboard)
- `reactapp/src/EntrepreneurComponents/ViewStartupOpportunities.jsx` (Entrepreneur's Browser)
- `reactapp/src/MentorComponents/MentorNavbar.jsx` & `EntrepreneurNavbar.jsx` (Dropdowns)
- `reactapp/src/Components/Reusable/ConfirmDialog.jsx` & `EmptyState.jsx`

**What they did:**
Member 5 built the actual pages where users do their work. They focused on making the app interactive and helpful.

**Key Concepts Used:**
- **Form Handling**: Taking what a user types and sending it to the server.
- **Debouncing**: Waiting for a user to stop typing before starting a search to save server power.
- **Conditional Rendering**: Showing "Edit" text if updating, and "Create" text if adding new.
- **Hover Menus**: Using Tailwind's `group-hover` to show dropdowns without needing extra Javascript.

**Work Flow:**
1. Built the Mentor's dashboard and the Entrepreneur's browsing list.
2. Created the dynamic Form for adding and editing profiles.
3. Added the hover dropdowns and confirmation popups to make the app feel premium.
