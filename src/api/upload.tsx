import { apiClient } from './apiClient';

async function upload(file: File) {
    try {
        const formData = new FormData();
        formData.append('file', file);
        const response = await apiClient.post(`/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export {
    upload
}