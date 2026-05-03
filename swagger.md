# 🚀 StartupNest API Documentation (Swagger)

This document explains the implementation, structure, and usage of the Swagger API documentation system within the StartupNest backend.

---

## 1. What it does
Swagger (OpenAPI 3.0) provides a **live, interactive interface** for our backend API. It eliminates the need for manual PDF documentation by:
- **Auto-Generating Docs**: Scans the source code for comments and builds a UI.
- **Interactive Testing**: Allows you to hit "Execute" and test real API calls (Signup, Login, Submission) directly from the browser.
- **Real-time Updates**: When you change a route's logic or parameters in the code, the documentation updates automatically.

---

## 2. Affected Files
The Swagger implementation is integrated into the following core files:

| File Path | Responsibility |
| :--- | :--- |
| **`nodeapp/index.js`** | Configures the `swagger-jsdoc` generator and mounts the `swagger-ui-express` middleware at `/api-docs`. |
| **`nodeapp/routers/userRouter.js`** | Contains documentation for Authentication (Login, Signup, Reset). |
| **`nodeapp/routers/startupProfileRoutes.js`** | Contains documentation for Mentor Profiles (Create, Search, Delete). |
| **`nodeapp/routers/startupSubmissionRoutes.js`** | Contains documentation for Submissions (Pitch Deck uploads, Status updates). |

---

## 3. How it Works
We use a "Documentation-as-Code" approach using two main libraries:
1.  **`swagger-jsdoc`**: This library reads **YAML comments** written directly inside our router files (prefixed with `@swagger`).
2.  **`swagger-ui-express`**: This library serves those generated rules as a beautiful, interactive webpage.

### **The Logic Flow:**
1.  Developer writes a `@swagger` block above an Express route.
2.  The server starts and scans all files in the `routers/` folder.
3.  The YAML is converted into a JSON "OpenAPI Specification."
4.  The user visits `http://localhost:8080/api-docs` to view the result.

---

## 4. How to Use

### **Accessing the UI**
1.  Start your backend server (`npm start`).
2.  Open your browser to: [http://localhost:8080/api-docs](http://localhost:8080/api-docs)

### **Testing an Endpoint**
1.  **Select a Route**: Click on any route (e.g., `POST /user/login`).
2.  **Try it out**: Click the white **"Try it out"** button on the right.
3.  **Enter Data**: Modify the JSON in the black box or fill in the parameters.
4.  **Execute**: Click the big blue **"Execute"** button.
5.  **Review**: Look at the "Server Response" section below to see the result.

### **Handling Authentication**
- **Cookies**: Swagger uses your browser's cookies. If you use the `/user/login` endpoint and get a success, your browser "remembers" you. You can then execute "Protected" routes (like creating a profile) without logging in again.

---

## 5. Maintenance (For Developers)
To add documentation for a new route:
1.  Open the relevant `router.js` file.
2.  Add a JSDoc comment starting with `/** @swagger`.
3.  Define the `summary`, `tags`, and `requestBody` (if any).
4.  Save the file. The documentation will update as soon as the server restarts.

---

> [!TIP]
> Always check the **"Schema"** tab in the Swagger UI. It shows you exactly which fields are mandatory and which words are allowed (Enums).
