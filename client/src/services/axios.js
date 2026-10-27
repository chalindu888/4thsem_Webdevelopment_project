import axios from 'axios';

const API = axios.create({
  baseURL: '/api', // Forwarded to the backend by the Vite proxy (vite.config.js)
  headers: {
    'Content-Type': 'application/json',
  },
});

export default API;