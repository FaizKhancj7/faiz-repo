# 📝 NEW FEATURE: Frontend Architecture Refactor

We transitioned the React application from a monolithic `Components/` folder structure to a standardized, scalable layout.

1. **Domain Segmentation**: Moved monolithic logic into `src/pages/mentor/` and `src/pages/entrepreneur/` based on role functionality.
2. **Component Granularity**: Extracted layout containers (Navbar, Footer) into `src/components/layout/` and generic visual elements (Buttons, Loaders, Pagination) into `src/components/ui/`.
3. **Public & Error Pages**: Organized standalone pages into `src/pages/public/` (LandingPage, HomePage) and `src/pages/errors/` (ErrorPage, Unauthorized).
4. **Resolved Casing Constraints**: Mitigated Windows-specific caching errors by forcing the lowercasing of `src/components/`.

---

# 🔄 System Logic: Five Detailed Codebase Workflows

### Flow 1: User Authentication & Rehydration Bridge

1. **App Initialization**: When a user loads `App.jsx`, Redux `userSlice` initializes with `isAuthenticated: null` (the "Checking" state).
2. **Token Verification**: The `useEffect` hook in `App.jsx` fires `api.get('/user/verify')`. The browser silently attaches the secure `httpOnly` JWT cookie due to `withCredentials: true`.
3. **Backend Middleware Validation**: The Express route `userRouter.get('/verify')` runs through `authMiddleware`. It extracts the cookie, decodes the JWT using the secret key, and queries the MongoDB `User` model.
4. **State Injection**: The backend returns `success: true` alongside the `userName` and `role`. The frontend catches this and runs `dispatch(loginSuccess(data))`, flipping Redux to `isAuthenticated: true`.
5. **Route Guarding execution**: `RootRoute` detects the true boolean and redirects the user from the `LandingPage` into `/home` via the `ProtectedRoute` wrapper.

### Flow 2: Mentor Opportunity Creation

1. **Frontend Dispatch**: The Mentor fills out `StartupProfileForm.jsx` and clicks submit. The frontend performs regex/number validation and constructs a payload.
2. **API Communication**: The data is sent via `startupService.createProfile(payload)`.
3. **Backend Injection & Controller**: `startupProfileRoutes` traps the POST request, runs it through `authMiddleware` (to securely append the mentor's `req.userId` to the body), and hits `startupProfileController`.
4. **Database Write**: MongoDB creates a new `StartupProfile` document, saving the `fundingLimit`, `description`, `category`, and associating it structurally with the Mentor's User ID.
5. **Redux Refetch**: The API responds 200 OK. The frontend receives a success toast and redirects the Mentor to `ViewStartupProfiles.jsx`, which subsequently triggers a `dispatch(fetchStart())` to pull the latest profile list from the database.

### Flow 3: Entrepreneur Idea Submission (Pitch Flow)

1. **Discovery**: The Entrepreneur navigates to `ViewStartupOpportunities.jsx`. This component fetches active StartupProfiles from the database using pagination logic.
2. **Action Trigger**: The Entrepreneur selects an opportunity and navigates to `SubmitIdea.jsx`, passing the `profileId` and `fundingLimit` via `react-router-dom`'s location state to avoid redundant API calls.
3. **FormData Construction**: Because the pitch requires a PDF pitch deck, the frontend constructs a `FormData` object (multipart/form-data) instead of JSON, attaching text fields and the binary file.
4. **Multer & S3/Local Storage**: The Express backend receives the payload via `upload.single('pitchDeckFile')`. Multer parses the PDF, assigns it a secure UUID filename, and saves it locally. The file path is appended to the `req.body`.
5. **Database Transaction**: The `startupSubmissionController` creates a `StartupSubmission` document linking the Entrepreneur (`req.userId`), the target `profileId`, and the new pitch data. The status defaults to `'pending'`.

### Flow 4: Mentor Pitch Review & Rejection

1. **Dashboard Load**: The Mentor opens `StartupSubmissions.jsx`. The UI queries the backend using `startupSubmissionService.getMentorSubmissions()`.
2. **Aggregation Pipeline**: The Node.js controller uses `.populate('entrepreneurId')` and `.populate('startupProfileId')` to join data, sending the Mentor a full context of who applied to which opportunity.
3. \**Rejection Modal TriggerhdrawnAt` timestamp. It does *not\* delete the document.
4. **Cross-Role Visibility**: Both dashboards instantly reflect this state. The Mentor's table renders a gray "Withdrawn" pill and allows them to view the Entrepre\*\*: The Mentor clicks "Reject" on a pending pitch, opening a dynamic modal where they must type a justification (>10 characters).
5. **Status Mutation**: The frontend fires `PUT /submission/:id/reject` with the text reason. The backend updates the MongoDB document, flipping the `status` enum to `'rejected'` and permanently saving the `rejectionFeedback` string.
6. **Feedback Loop Closure**: Upon success, the UI refreshes. The Entrepreneur's dashboard (`MySubmissions.jsx`) detects the new status and renders a red "Rejected" badge alongside a message icon that opens the Mentor's feedback.

### Flow 5: Entrepreneur Pitch Withdrawal

1. **Requirement Check**: In `MySubmissions.jsx`, the UI logic dictates that an Entrepreneur can only withdraw an idea if the current status is `'approved'` and `isWithdrawn` is false.
2. **Withdrawal Modal**: The Entrepreneur clicks "Withdraw" and is prompted to provide a mandatory `withdrawalReason`.
3. **API Padatch**: The frontend sends a POST request to `/submission/:id/withdraw` with the reason.
4. **Database Archival**: The backend updates the specific document setting `isWithdrawn = true`, recording the `withdrawalReason`, and setting a `witneur's recor reason, while the action buttons are permanently disabled, creating a secure historical ledger of the interaction.
   ded
