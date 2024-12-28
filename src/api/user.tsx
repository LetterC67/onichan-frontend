import axios from 'axios';
import { Avatar, User } from '../interfaces';

const API_URL = import.meta.env.VITE_APP_API_URL;

async function getUser(userID: string): Promise<User>{ 
    const response = await axios.get(`${API_URL}/users/${userID}`);
    return response.data;
}

async function getAllAvatars(): Promise<Avatar[]> {
    const response = await axios.get(`${API_URL}/users/avatars`);
    return response.data;
}

export {
    getUser,
    getAllAvatars
}