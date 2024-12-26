import { apiClient } from "./apiClient";
import axios from 'axios';

async function login(username: string, password: string) {
    try {
        const response = await apiClient.post(`/auth/login`, {
            username: username,
            password: password,
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            const errorMessage = error.response.data.error || 'Login failed';
            return { error: errorMessage };
        } else {
            return { error: 'An unexpected error occurred' };
        }
    }
}

async function register(username: string, email: string, password: string) {
    try {
        const response = await apiClient.post(`/auth/register`, {
            username: username,
            email: email,
            password: password,
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            const errorMessage = error.response.data.error || 'Registration failed';
            return { error: errorMessage };
        } else {
            return { error: 'An unexpected error occurred' };
        }
    }
}

async function changePassword(currentPassword: string, newPassword: string) {
    try {
        const response = await apiClient.patch(`/auth/change-password`, {
            old_password: currentPassword,
            new_password: newPassword,
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            const errorMessage = error.response.data.error || 'Password change failed';
            return { error: errorMessage };
        } else {
            return { error: 'An unexpected error occurred' };
        }
    }
}

async function changeEmail(currentPassword: string, newEmail: string) {
    try {
        const response = await apiClient.patch(`/auth/change-email`, {
            password: currentPassword,
            email: newEmail,
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            const errorMessage = error.response.data.error || 'Email change failed';
            return { error: errorMessage };
        } else {
            return { error: 'An unexpected error occurred' };
        }
    }
}

async function changeAvatar(avatarURL: string) {
    try {
        const response = await apiClient.patch(`/auth/change-avatar`, {
            avatar_url: avatarURL,
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            const errorMessage = error.response.data.error || 'Avatar change failed';
            return { error: errorMessage };
        } else {
            return { error: 'An unexpected error occurred' };
        }
    }
}

export {
    login,
    register,
    changePassword,
    changeEmail,
    changeAvatar,
}