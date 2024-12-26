import { useEffect, useState, useRef } from "react";
import autosize from 'autosize';
import { useCategory } from "../../../contexts/CategoryContext";
import "./CreatePost.css";
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { post } from "../../../api/post";
import { useNotification } from "../../../contexts/NotificationContext";
import { useNavigate } from "react-router-dom";
import { upload } from "../../../api/upload";
import { API_URL } from "../../../api/apiClient";
import { useAuth } from "../../../contexts/AuthContext";

import { EyeSVG, EditSVG, TickSVG, PlusSVG } from "../../svg";



const scrollToBottom = () => {
    window.scrollTo({ left: 0, top: document.body.scrollHeight, behavior: "smooth" });
}


function CreatePost() {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [title, setTitle] = useState<string>("");
    const [textareaValue, setTextareaValue] = useState<string>("");
    const [isEditing, setIsEditing] = useState<boolean>(true);
    const notification = useNotification();
    const navigate = useNavigate();
    const {user} = useAuth();
    const { category } = useCategory();

    useEffect(() => {
        textareaRef.current?.focus();
        if(textareaRef.current) {
            autosize(textareaRef.current);
        }
    }, [isEditing]);
    
    useEffect(() => {
        scrollToBottom();
    }, [textareaRef.current?.style.height]);

    useEffect(() => {
        const handlePaste = (event: any) => {
            const clipboardItems = event.clipboardData.items;
            let imageFound = false;
            let file = null;
        
            for (const item of clipboardItems) {
                if (item.type.startsWith("image/")) {
                    file = item.getAsFile();
            
                    imageFound = true;
                    break;
                }
            }
        
            if (imageFound) {
                event.preventDefault();
                upload(file).then((data: any) => {
                    setTextareaValue(textareaValue + `![image](${API_URL + "/" + data.path})`);
                    notification("image uploaded successfully", "success");
                }).catch((error) => {
                    notification("failed to upload image", "error");
                    console.error('Failed to upload image:', error);
                });
            }
        };

        textareaRef.current?.addEventListener("paste", handlePaste);

        return () => {
            textareaRef.current?.removeEventListener("paste", handlePaste);
        };
    }, []);

    function onPost() {
        post(category ? category.ID : 0, textareaValue, title).then((data: any) => {
            notification("post created successfully", "success");
            navigate(`/category/${category?.ID}/post/${data.id}`);
        }).catch(() => {
            notification("failed to create post", "success");
        });
    }

    return (
        <div className="create-post-page">
            {user &&
            <>
                <div className="create-post-page__header">
                    <span className="create-post-page__create-post">
                        <div>create post</div>
                        <PlusSVG />
                    </span>
                </div>
                <div className="create-post-page__content">
                    <input placeholder="write post title" value={title} onChange={(e) => setTitle(e.target.value)}></input>
                    {isEditing &&
                        <textarea  onChange={(e) => setTextareaValue(e.target.value)} value={textareaValue} ref={textareaRef} placeholder="write post content"></textarea>
                    }

                    {!isEditing && <div className="create-post-page__markdown-content">
                        <Markdown remarkPlugins={[remarkGfm]}>{textareaValue}</Markdown>
                    </div>}
                </div>
                <div className="create-post-page__footer">
                    {isEditing && <div className="create-post-page__footer-button" onClick={() => setIsEditing(false)}>
                        <EyeSVG />
                        <span>preview</span>
                    </div>
                    }
                    {!isEditing && <div className="create-post-page__footer-button" onClick={() => setIsEditing(true)}>
                        <EditSVG />
                        <span>edit</span>
                    </div>}
                    <div className="create-post-page__footer-button" onClick={onPost}>
                        <TickSVG />
                        <span>post</span>
                    </div>
                </div>
            </>
            }

            {!user &&
                <div className="create-post-page__please-login" onClick={() => navigate("/login")}>
                    <span>
                        please login to post  
                    </span>
                </div>   
            }
        </div>

    )
}

export default CreatePost;