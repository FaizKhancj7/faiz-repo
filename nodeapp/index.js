// This is the main file for our Node.js server.
// It sets up the server, connects to the database, and tells the server how to handle requests.

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
// We import the router that handles all user-related paths (like signup and login)
const userRouter = require('./routers/userRouter');
const startupRouter = require('./routers/startupProfileRoutes');
const submissionRouter = require('./routers/startupSubmissionRoutes');
const ErrorLog = require('./models/ErrorLog');

// SWAGGER SETUP
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'StartupNest API',
            version: '1.0.0',
            description: 'Interactive API documentation for the StartupNest platform',
        },
        servers: [
            {
                url: 'http://localhost:8080',
            },
        ],
    },
    apis: ['./routers/*.js'], // This tells swagger to look for comments in all files inside the routers folder
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);


const app = express();
const PORT = 8080;

// MIDDLEWARES - These are like helpers that process requests before they reach our routes

// This helper lets our server understand JSON data sent in request bodies
app.use(express.json());

// This helper lets our server read cookies sent by the browser
app.use(cookieParser());

// This helper lets our server read files from the 'uploads' folder directly
app.use('/uploads', express.static('uploads'));

// This helper handles CORS so our frontend can talk to our backend safely
app.use(cors({ origin: true, credentials: true })); 

// DATABASE CONNECTION
// We connect to MongoDB to store all our app's information
mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/startupnest")
    .then(() => console.log("Database Connected Successfully"))
    .catch(err => console.error("Database Connection Error:", err));

// ROUTE SETUP
// We tell the app to use the routers for specific paths
app.use('/user', userRouter);
app.use('/startup', startupRouter);
app.use('/submission', submissionRouter);

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


// GLOBAL ERROR HANDLER
app.use(async (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Something went wrong on the server!";

    console.error("Error Found:", message);

    // LOG ERROR TO DATABASE
    try {
        await ErrorLog.create({
            message: message,
            stack: err.stack,
            statusCode: statusCode,
            path: req.originalUrl,
            method: req.method,
            user: req.user ? req.user.id : null
        });
    } catch (dbErr) {
        console.error("Failed to log error to DB:", dbErr);
    }
    
    res.status(statusCode).json({ 
        success: false, 
        message: message,
        data: {}
    });
});

// START THE SERVER
// We tell the server to start listening for requests on our port (8080)
app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`));