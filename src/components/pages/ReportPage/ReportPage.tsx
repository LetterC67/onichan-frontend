import "./ReportPage.css"
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getReports } from "../../../api/report";   
import { ChickenSVG } from "../../svg";
import { useAuth } from "../../../contexts/AuthContext";
import PaginationBar from "../../pagination/PaginationBar/PaginationBar";
import { useNavigate } from "react-router-dom";
import { Report } from "../../../interfaces";
import ReportComponent from "./ReportComponent";


function ReportPage(): JSX.Element {
    const [reports, setReports] = useState<Report[]>([]);
    const [maxPages, setMaxPages] = useState<number>(0);
    const { page = '1'} = useParams() as { page: string };
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        getReports(page).then((data: any) => {
            setReports(data.reports);
            setMaxPages(data.total_pages);
        }).catch((error) => {
            console.error('Failed to fetch report:', error);
            setReports([]);
        });
    }, [page])

    function onPageChange(page: string | number) {
        navigate(`/reports/${page}`);
    }

    return (
        <>
            {user?.role == 'admin' && 
                <div className="report-page">
                    <div className="post-page__posts">
                        {(reports?.length == 0) && 
                            <div className="category-page__empty">
                                <div>
                                    <ChickenSVG />
                                    <ChickenSVG />
                                    <ChickenSVG />
                                </div>
                                <span>nobody here but us chickens</span>
                            </div>
                        }
                        <table>
                            <tbody>
                                {reports.map((report) => (
                                    <ReportComponent report={report} />
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            }

            {maxPages > 1 && <PaginationBar maxPages={maxPages} currentPage={page} onPageChange={onPageChange} />}
        </>
    )
}

export default ReportPage;