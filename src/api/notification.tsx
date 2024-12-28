import { apiClient } from "./apiClient";
import { Notification } from "../interfaces";

async function getUnreadNotifications(): Promise<Notification[]> {
    const response = await apiClient.get(`/notifications`);
    return response.data;
}

async function readNotifications(): Promise<Notification> {
    const response = await apiClient.patch(`/notifications`);
    return response.data;
}

export {
    getUnreadNotifications,
    readNotifications
}