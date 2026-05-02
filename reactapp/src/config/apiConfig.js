import axios from 'axios';

// We create an instance of axios with our backend URL.
const api = axios.create({
    baseURL: 'http://localhost:8080',
    withCredentials: true 
});

export default api;
