import axios from 'axios';

const API_URL = import.meta.env.VITE_APP_API_URL;

async function getCategories() {
    const response = await axios.get(`${API_URL}/categories`);
    return response.data;
}

async function getCategory(categoryName: string) {
    const response = await axios.get(`${API_URL}/categories/${categoryName}`);
    return response.data;
}

export { 
    getCategories,
    getCategory
};