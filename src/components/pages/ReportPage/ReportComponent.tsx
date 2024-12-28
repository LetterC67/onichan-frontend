import { useEffect, useState } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CrossSVG, TickSVG } from '../../svg';
import { Post, Report } from '../../../interfaces';
import { resolveReport } from '../../../api/report';
import { useNotification } from '../../../contexts/NotificationContext';

interface ReportComponentProps {
    report: Report;
}

function ReportComponent({ report }: ReportComponentProps): JSX.Element {
    const post:Post = report.post;
    const [done, setDone] = useState<boolean>(false);
    const notification = useNotification();

    useEffect(() => {
        setDone(false);
    }, [post])

    function onResolve(action: boolean): void {
        resolveReport(report.ID, action).then(() => {
            setDone(true);
            notification('report resolved', 'success');
        }).catch(() => {
            notification('failed to resolve report', 'error');
        });
    }

    return (
        <tr className="post-page__post" id={`post-${post.ID}`} >
            <td className="post-page__post-meta">
                <div className="post-page__post-avatar">
                    <img src={post.user.avatar_url} alt="avatar"/>
                </div>
                <span>
                    {post.user.username}
                </span>
            </td>
            <td className="post-page__post-content">
                <div className="post-page__post-content-meta">
                    <div>
                        {new Date(post.created_at).toLocaleString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                            hour12: false
                        })}
                    </div>
                    
                    <div className="post-page__post-meta-right-container">
                        {(!report.resolved && !done) && <div className="post-page__post-meta-right" onClick={() => onResolve(true)}>
                            <CrossSVG />
                            <span>remove post</span>
                        </div>
                        }

                        {(!report.resolved && !done) && <div className="post-page__post-meta-right" onClick={() => onResolve(false)}>
                            <TickSVG />
                            <span>approve post</span>
                        </div>
                        }

                        {(report.resolved || done) && <div>
                            <span>this report has been resolved</span>
                        </div>
                        }
                    </div>
                </div>

                <div className="post-page__markdown-content">
                    <Markdown remarkPlugins={[remarkGfm]} className={post.is_deleted ? 'deleted-post' : ''}>{post.content}</Markdown>
                </div>
            </td>
        </tr>       
    )
}

export default ReportComponent;