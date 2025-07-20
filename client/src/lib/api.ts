import axios from 'axios';
import { toast } from 'sonner';
import useAuth from '../hooks/useAuth';

export const baseUrl = import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL: baseUrl,
    withCredentials: true, // 🔐 include cookies in requests
});

export const useApi = () => {
    const { logout } = useAuth();

    api.interceptors.response.use(
        (res) => res,
        (err) => {
            if (err.response?.status === 401) {
                logout();
                toast.error('Session expired. Please login again.');
            }
            return Promise.reject(err);
        }
    );

    return api;
};

