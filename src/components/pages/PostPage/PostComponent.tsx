import { Post, Reaction } from "../../../interfaces";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import { createReport } from "../../../api/report";
import { toggleReaction } from "../../../api/post";

import { useAuth } from "../../../contexts/AuthContext";
import { useNotification } from "../../../contexts/NotificationContext";

import { ReplySVG, GoSVG, ExclamationSVG } from "../../svg";

import ReactionComponent from "./ReactionComponent";
import ReactionBox from "./ReactionBox";

import { scrollToBottom } from "../../utils";

interface PostComponentProps {
    post: Post;
    search: string;
    setReplyTo: (post: Post | null) => void;
}

function PostComponent({ post, search, setReplyTo }: PostComponentProps): JSX.Element {
    const [reactionCounts, setReactionCounts] = useState<Map<string, number>>(new Map());
    const [userReactions, setUserReactions] = useState<Set<string>>(new Set());
    const navigate = useNavigate();
    const { user } = useAuth();
    const notification = useNotification();

    const addReaction = (key: string) => {
        setReactionCounts((prevMap) => {
            const updatedMap = new Map(prevMap);
            const currentValue = updatedMap.get(key) || 0;
            updatedMap.set(key, currentValue + 1);
            return updatedMap;
        });
        userReactions.add(key);
    };

    const removeReaction = (key: string) => {
        setReactionCounts((prevMap) => {
            const updatedMap = new Map(prevMap);
            const currentValue = updatedMap.get(key) || 0;
            updatedMap.set(key, currentValue - 1);
            return updatedMap;
        });
        userReactions.delete(key);
    };
    
    useEffect(() => {
        if (post.reactions) {
            const reactionCounts = new Map<string, number>();
            post.reactions.forEach((reaction) => {
                reactionCounts.set(reaction.reaction.emoji, reaction.count);
            });
            setReactionCounts(reactionCounts);
        }
        
        const userReactions = new Set<string>();
        post.user_reactions.forEach((reaction) => {
            userReactions.add(reaction.reaction.emoji);
        });
        setUserReactions(userReactions);
    }, [post]);

    const _toggleReaction = (reaction: Reaction) => {
        if(!user) {
            notification("you must be logged in to react to a post", "error");
            return;
        }

        toggleReaction(post.ID, reaction.ID).then((data: any) => {
            if (data.message === "Reaction added") {
                addReaction(reaction.emoji);
            } else if (data.message === "Reaction removed") {
                removeReaction(reaction.emoji);
            }
        }).catch((error: any) => {
            console.error('Failed to toggle reaction:', error);
        });
    };

    function onReport() {
        if(!user) {
            notification("you must be logged in to report a post", "error");
            return;
        }

        createReport(post.ID, user ? user.ID : 0).then(() => {
            notification("post reported", "success");
        }).catch(() => {
            notification("failed to report post", "error");
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
                    
                    {(search == '') && 
                    <div className="post-page__post-meta-right-container">
                        {!post.is_deleted && <div className="post-page__post-meta-right" onClick={onReport}>
                            <ExclamationSVG />
                            <span>report</span>
                        </div>
                        }

                        <ReactionBox post={post} toggleReaction={_toggleReaction}/>

                        <div className="post-page__post-meta-right" onClick={() => {
                            setReplyTo(post);
                            scrollToBottom();
                        }}>
                            <ReplySVG />
                            <span>reply</span>
                        </div>
                    </div>
                    }

                    {(search != '') &&
                    <div className="post-page__post-meta-right-container">

                        <div className="post-page__post-meta-right" onClick={() => navigate(`/category/${post.category.name}/post/${post.parent_post_id}/${post.page}?goto=${post.ID}`)}>
                            <GoSVG />
                            <span>jump</span>
                        </div>
                   </div> 
                    }
                </div>
                
                <div>
                    {(post.reply_to && search == '') &&
                        <div className="post-page__reply-to-post-group">
                            <div className="post-page__reply-to-post-meta">
                                {post.reply_to.user.username} said
                            </div>
                            <div className={`post-page__reply-to-post`}>
                                <hr></hr>
                                <Markdown remarkPlugins={[remarkGfm]} className={post.reply_to.is_deleted ? 'deleted-post' : ''}>
                                    {post.reply_to.content}
                                </Markdown>
                            </div>
                        </div>
                    }
                </div>
                <div className="post-page__markdown-content">
                    <Markdown remarkPlugins={[remarkGfm]} className={post.is_deleted ? 'deleted-post' : ''}>{post.content}</Markdown>
                </div>
                <div className="post-page__reactions">
                    {post.reactions && post.reactions.map((reaction: any) => (
                        <ReactionComponent 
                            key={reaction.reaction.emoji} 
                            reaction={reaction.reaction} 
                            onToggleReaction={_toggleReaction}
                            reactionCounts={reactionCounts}
                            userReactions={userReactions}
                        />
                    ))}
                </div>
            </td>
        </tr>       
    )
}

export default PostComponent;