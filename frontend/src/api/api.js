import axios from 'axios';

const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();

const defaultApiUrl = import.meta.env.PROD ? '/api' : 'http://localhost:8080/api';

const API = axios.create({
    baseURL: configuredApiUrl || defaultApiUrl,
    withCredentials: true,
});

export default API;
