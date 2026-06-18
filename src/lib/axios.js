import axios from "axios";
import Cookies from 'js-cookie';
import { MOCK_ROUTES } from '../data/mock.js';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000'
})

api.interceptors.request.use((config) => {
    const token = Cookies.get('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// Mock interceptor — intercepts all responses and returns static data
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const url = error.config?.url?.split('?')[0] // strip query params

        // Find matching mock route (exact or prefix match)
        const match = Object.keys(MOCK_ROUTES).find(route =>
            url === route || url?.startsWith(route + '/')
        )

        if (match) {
            return Promise.resolve({
                data: { data: MOCK_ROUTES[match].data },
                status: 200,
                config: error.config,
            })
        }

        // For write operations (POST/PUT/PATCH/DELETE) with no mock, return success
        const method = error.config?.method?.toLowerCase()
        if (['post', 'put', 'patch', 'delete'].includes(method)) {
            return Promise.resolve({
                data: { data: {}, message: 'Demo mode — operación simulada' },
                status: 200,
                config: error.config,
            })
        }

        return Promise.reject(error)
    }
)

export default api;
