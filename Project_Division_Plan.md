# StartupNest Platform: Team Division & Code Ownership Plan

This document outlines the division of the StartupNest platform into five strategic development areas. Each member is responsible for approximately equal "Lines of Code" (LOC) and complexity, ensuring a balanced workload across the full-stack ecosystem.

---

### **Member 1: Backend Architecture & Service Layer**
**Primary Focus**: Data Security, API Performance, and Universal Communication.
- **Responsibility**: Ensuring the backend can scale to thousands of records while maintaining strict role-based security.
- **Files Assigned**:
    - `nodeapp/controllers/startupSubmissionController.js` (~170 lines)
    - `nodeapp/routers/startupSubmissionRoutes.js`
    - `nodeapp/utils/pagination.js`
    - `reactapp/src/services/startupSubmissionService.js`
    - `nodeapp/utils/responseHandler.js`

---

### **Member 2: Mentor Pipeline & Review Ecosystem**
**Primary Focus**: Review Workflows, Status Management, and Documentation Auditing.
- **Responsibility**: Building the interface where mentors analyze pitches and progress startups through the pipeline.
- **Files Assigned**:
    - `reactapp/src/MentorComponents/StartupSubmissions.jsx` (~400 lines)
    - `nodeapp/models/StartupSubmission.js`
    - `reactapp/src/Components/Reusable/Modal.jsx`
    - `reactapp/src/Components/Reusable/ConfirmDialog.jsx`

---

### **Member 3: Entrepreneur Portfolio & Data Autonomy**
**Primary Focus**: User Autonomy, Idea Submissions, and Pitch Management.
- **Responsibility**: Managing the entrepreneur's "My Portfolio" experience and the secure "Soft Delete" withdrawal mechanism.
- **Files Assigned**:
    - `reactapp/src/EntrepreneurComponents/MySubmissions.jsx` (~340 lines)
    - `reactapp/src/EntrepreneurComponents/SubmitIdea.jsx`
    - `reactapp/src/services/startupService.js`
    - `reactapp/src/slices/startupSlice.js`

---

### **Member 4: Platform Discovery & Profile Management**
**Primary Focus**: Marketplace Logic, Advanced Search, and Opportunity Creation.
- **Responsibility**: Scaling the discovery engine where startups find mentors and mentors manage their profiles.
- **Files Assigned**:
    - `reactapp/src/EntrepreneurComponents/ViewStartupOpportunities.jsx` (~280 lines)
    - `nodeapp/controllers/startupProfileController.js` (~100 lines)
    - `nodeapp/routers/startupProfileRoutes.js`
    - `nodeapp/models/StartupProfile.js`
    - `reactapp/src/MentorComponents/ViewStartupProfiles.jsx`

---

### **Member 5: UI/UX System & Data Analytics**
**Primary Focus**: Brand Identity, Live KPIs, and Responsive Integrity.
- **Responsibility**: Maintaining the "Ascent Modernism" design system and ensuring the platform is "Zero-Leak" on mobile.
- **Files Assigned**:
    - `reactapp/src/Components/HomePage.jsx` (~160 lines)
    - `reactapp/src/Components/Reusable/Navbar.jsx`
    - `reactapp/src/index.css` (Global Design System)
    - `reactapp/src/Components/Reusable/Pagination.jsx`
    - `reactapp/src/Components/Reusable/Loader.jsx`

---

### **Team Summary Matrix**

| Member | Domain | Key Technology |
| :--- | :--- | :--- |
| **Member 1** | Core Architecture | Node/Express / Middleware |
| **Member 2** | Mentor Review | React / Complex State / PDF Integration |
| **Member 3** | Entrepreneurship | React / Redux / CRUD Operations |
| **Member 4** | Discovery Engine | MongoDB / Search Logic / Relationship Mapping |
| **Member 5** | UI/UX & Analytics | Tailwind CSS / Data Visualization / Responsive Design |

---
