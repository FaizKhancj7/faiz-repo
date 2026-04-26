// This file sets up Axios, which is the tool we use to talk to our backend server.
// We configure it here once so we don't have to repeat the base URL in every file.

import axios from 'axios';

// We create an instance of axios with our backend URL.
// The "withCredentials: true" part is very important because it tells the browser 
// to send our login cookie along with every request.
const api = axios.create({
    baseURL: 'http://localhost:8080',
    withCredentials: true 
});

export default api;
