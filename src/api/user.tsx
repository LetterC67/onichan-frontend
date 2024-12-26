import axios from 'axios';

const API_URL = import.meta.env.VITE_APP_API_URL;

async function getUser(userID: string) { 
    try {
        const response = await axios.get(`${API_URL}/users/${userID}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

async function getAllAvatars() {
    try {
        const response = await axios.get(`${API_URL}/users/avatars`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export {
    getUser,
    getAllAvatars
}