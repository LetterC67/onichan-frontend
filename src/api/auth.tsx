import { apiClient } from "./apiClient";
import axios from 'axios';
import { ChangeAvatarResponse, ChangeEmailResponse, ChangePasswordResponse, LoginResponse, RegisterResponse, ForgotPasswordResponse, ResetPasswordResponse } from "../interfaces";

async function login(username: string, password: string): Promise<LoginResponse> {
    try {
        const response = await apiClient.post(`/auth/login`, {
            username: username,
            password: password,
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return { error: error.response.data.error };
        } else {
            return { error: 'An unexpected error occurred' };
        }
    }
}



async function register(username: string, email: string, password: string): Promise<RegisterResponse> {
    try {
        const response = await apiClient.post(`/auth/register`, {
            username: username,
            email: email,
            password: password,
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return { error: error.response.data.error };
        } else {
            return { error: 'An unexpected error occurred' };
        }
    }
}


async function changePassword(currentPassword: string, newPassword: string): Promise<ChangePasswordResponse> {
    try {
        const response = await apiClient.patch(`/auth/change-password`, {
            old_password: currentPassword,
            new_password: newPassword,
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return { error: error.response.data.error };
        } else {
            return { error: 'An unexpected error occurred' };
        }
    }
}



async function changeEmail(currentPassword: string, newEmail: string): Promise<ChangeEmailResponse> {
    try {
        const response = await apiClient.patch(`/auth/change-email`, {
            password: currentPassword,
            email: newEmail,
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return { error: error.response.data.error };
        } else {
            return { error: 'An unexpected error occurred' };
        }
    }
}

async function changeAvatar(avatarURL: string): Promise<ChangeAvatarResponse> {
    try {
        const response = await apiClient.patch(`/auth/change-avatar`, {
            avatar_url: avatarURL,
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return { error: error.response.data.error };
        } else {
            return { error: 'An unexpected error occurred' };
        }
    }
}

async function forgotPassword(email: string): Promise<ForgotPasswordResponse> {
    try {
        const response = await apiClient.post(`/auth/forgot-password`, {
            email: email,
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return { error: error.response.data.error };
        } else {
            return { error: 'An unexpected error occurred' };
        }
    }
}

async function resetPassword(token: string): Promise<ResetPasswordResponse> {
    try {
        const response = await apiClient.post(`/auth/reset-password`, {
            token: token,
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return { error: error.response.data.error };
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
    forgotPassword,
    resetPassword,
};