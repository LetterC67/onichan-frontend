import { CreatePostResponse, Post, UploadResponse, User } from "../../../interfaces";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import autosize from 'autosize';
import { useCategory } from "../../../contexts/CategoryContext";
import { comment } from "../../../api/post";
import { API_URL } from "../../../api/apiClient";
import { upload } from "../../../api/upload";
import { useNotification } from "../../../contexts/NotificationContext";
import { GoUpSVG, CancelSVG, EyeSVG, EditSVG, Tick2SVG } from "../../svg";
import { scrollToBottom, scrollPostIntoView } from "../../utils";

interface ReplyBoxProps {
    user: User;
    replyTo: Post | null;
    masterPost: Post;
    setReplyTo: (post: Post | null) => void;
}

function ReplyBox({ user, replyTo, masterPost, setReplyTo }: ReplyBoxProps): JSX.Element {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [textareaValue, setTextareaValue] = useState<string>("");
    const [isEditing, setIsEditing] = useState<boolean>(true);
    const [startedEditing, setStartedEditing] = useState<boolean>(false);
    const navigate = useNavigate();
    const { category } = useCategory();
    const notification  = useNotification();
    
    useEffect(() => {
        if(startedEditing) {
            textareaRef.current?.focus();
        }
        if (textareaRef.current) {
            autosize(textareaRef.current);
        }
    }, [isEditing, startedEditing]);
    
    useEffect(() => {
        if(!startedEditing) {
            return;
        }
        scrollToBottom();
    }, [isEditing, textareaRef.current?.style.height, startedEditing]);


    useEffect(() => {
        const handlePaste = (event: ClipboardEvent): void => {
            const clipboardItems = event.clipboardData?.items;
            let imageFound = false;
            let file = null;
            
            if (!clipboardItems) return;
            for (const item of clipboardItems) {
                if (item.type.startsWith("image/")) {
                    file = item.getAsFile();
            
                    imageFound = true;
                    break;
                }
            }
        
            if (imageFound) {
                event.preventDefault();
                if (!file) return;
                upload(file).then((data: UploadResponse) => {
                    setTextareaValue(textareaValue + `![image](${API_URL + "/" + data.path})`);
                    notification("image uploaded successfully", "success");
                }).catch((error) => {
                    notification("failed to upload image", "error");
                    console.error('Failed to upload image:', error);
                });
            }
        };

        const textarea = textareaRef.current;
        textarea?.addEventListener("paste", handlePaste);

        return (): void => {
            textarea?.removeEventListener("paste", handlePaste);
        };
    }, [notification, textareaValue]);


    function postComment(): void {
        if (!textareaValue) {
            return;
        }

        comment(replyTo?.ID ?? null, masterPost.ID, masterPost.category.ID, textareaValue).then((data: CreatePostResponse) => {
            setTextareaValue("");
            setIsEditing(true);
            setReplyTo(null);
            void navigate(`/category/${category?.name}/post/${masterPost.ID}/${data.page}?goto=${data.id}`);
            notification('comment posted successfully', 'success');
        }).catch((error) => {
            console.error('Failed to post comment:', error);
        });
    }

    return (
        <tr className="post-page__post">
            <td className="post-page__post-meta">
                <div className="post-page__post-avatar">
                    <img src={user?.avatar_url} alt="avatar"/>
                </div>
                <span>
                    {user?.username}
                </span>
            </td>
            <td className="post-page__reply">
                <div className="post-page__post-content-meta">
                    <span className="post-page__reply-go-up" style={{display: 'flex', flexDirection:'row', gap:'0.5rem'}}>
                        <span>{'replying to '}</span>
                        {replyTo  && 
                            <>
                                <span>{replyTo.user.username + ' '}</span>
                                <span className="post-page__reply-icon" onClick={() => scrollPostIntoView(replyTo.ID)}>
                                    <GoUpSVG />
                                </span>
                                <span className="post-page__reply-icon" onClick={() => setReplyTo(null)}>
                                    <CancelSVG />
                                </span>
                            </>
                        }
                        {!replyTo && <span>{'[master post]'}</span>}
                    </span>    
                    <div className="post-page__post-options">
                        {isEditing &&
                        <div className="post-page__post-option" onClick={() => {
                            setIsEditing(false);
                        }}>
                            <EyeSVG />
                            <span>preview</span>
                        </div>
                        }

                        {!isEditing &&
                        <div className="post-page__post-option" onClick={() => setIsEditing(true)}>
                            <EditSVG />
                            <span>edit</span>
                        </div>
                        }

                        <div className="post-page__post-option" onClick={postComment}>
                            <Tick2SVG />
                            <span>post</span>
                        </div>
                    </div>
                </div>
                {isEditing &&
                    <textarea onFocus={() => setStartedEditing(true)} onChange={(e) => setTextareaValue(e.target.value)} value={textareaValue} ref={textareaRef} placeholder="write your reply"></textarea>
                }
                {!isEditing &&
                    <Markdown remarkPlugins={[remarkGfm]}>{textareaValue}</Markdown>
                }
            </td>
        </tr>     
    )
}

export default ReplyBox;