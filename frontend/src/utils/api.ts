import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL, // Use the backend URL from the environment variable
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;