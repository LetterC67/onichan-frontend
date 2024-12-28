import { apiClient } from "./apiClient";
import { CreateReportResponse, GetReportsResponse, ResolveReportResponse } from "../interfaces";

async function createReport(postID: string | number , userID: number | number): Promise<CreateReportResponse> {
    const response = await apiClient.post('/reports', {
        post_id: postID,
        user_id: userID
    });
    return response.data;
}

async function getReports(page: string | number): Promise<GetReportsResponse>{
    const response = await apiClient.get(`/reports?page=${page}`);
    return response.data;
}

async function resolveReport(reportID: string | number, action: boolean): Promise<ResolveReportResponse> {
    const response = await apiClient.patch(`/reports`, {
        report_id: reportID,
        delete_post: action
    });
    return response.data;
}

export {
    createReport,
    getReports,
    resolveReport
};