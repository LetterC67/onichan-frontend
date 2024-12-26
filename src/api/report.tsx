import { apiClient } from "./apiClient";

async function createReport(postID: string | number , userID: number | number) {
    try {
        const response = await apiClient.post('/reports', {
            post_id: postID,
            user_id: userID
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

async function getReports(page: string | number) {
    try {
        const response = await apiClient.get(`/reports?page=${page}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

async function resolveReport(reportID: string | number, action: boolean) {
    try {
        const response = await apiClient.patch(`/reports`, {
            report_id: reportID,
            delete_post: action
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export {
    createReport,
    getReports,
    resolveReport
};