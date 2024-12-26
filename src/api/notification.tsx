import { apiClient } from "./apiClient";

async function getUnreadNotifications() {
    try {
        const response = await apiClient.get(`/notifications`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

async function readNotifications() {
    try {
        const response = await apiClient.patch(`/notifications`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export {
    getUnreadNotifications,
    readNotifications
}