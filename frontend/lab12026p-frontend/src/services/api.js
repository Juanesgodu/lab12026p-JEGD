import axios from 'axios';

// Instancia centralizada de Axios.
//
// baseURL = '/api' porque el proxy configurado en vite.config.js
// redirige automáticamente cualquier petición que empiece por /api
// hacia http://localhost:8080/api (el backend de Spring Boot).
//
// Esto evita problemas de CORS sin necesidad de tocar el backend:
// desde el punto de vista del navegador, el frontend y el backend
// parecen estar en el mismo origen (http://localhost:5173).
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
