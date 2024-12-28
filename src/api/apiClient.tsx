import axios from 'axios';

const API_URL = import.meta.env.VITE_APP_API_URL;


function readJwtFromCookie(): string | null {
    const cookies = document.cookie.split("; ");
    const authorizationCookie = cookies.find(cookie => cookie.startsWith("Authorization="));
    if (authorizationCookie != null) {
        const value = authorizationCookie.split("=")[1];
        if (value.startsWith("Bearer ")) {
            return value.slice(7);
        }
    }
    return null;
}

const getToken = (): string | null => {
    return readJwtFromCookie();   
};


const apiClient = axios.create({
    baseURL: API_URL, 
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(
    config => {
        const token = getToken();
        if (token != null) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

export {
    apiClient,
    API_URL
}