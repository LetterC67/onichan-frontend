import axios from 'axios';
import { Category } from '../interfaces';

const API_URL = import.meta.env.VITE_APP_API_URL;



async function getCategories(): Promise<Category[]> {
    const response = await axios.get(`${API_URL}/categories`);
    return response.data;
}

async function getCategory(categoryName: string): Promise<Category> {
    const response = await axios.get(`${API_URL}/categories/${categoryName}`);
    return response.data;
}

export { 
    getCategories,
    getCategory
};