import "./PostPage.css";
import { useState, useEffect, useRef } from "react";
import { getPost, searchContent } from "../../../api/post";
import PaginationBar from "../../pagination/PaginationBar/PaginationBar";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { useNotification } from "../../../contexts/NotificationContext";
import { SearchSVG, ChickenSVG, UserSVG, TimeSVG } from "../../svg";
import useWebSocket from "react-use-websocket";
import { useCategory } from "../../../contexts/CategoryContext";
import Loading from "../../Loading";
import { Post } from "../../../interfaces";

import PostComponent from "./PostComponent";
import ReplyBox from "./ReplyBox";
import { scrollPostIntoView } from "../../utils";

const WS_URL = import.meta.env.VITE_APP_WS_URL;

function PostPage(): JSX.Element {
    const { page = '1'} = useParams() as { page: string };
    const { id } = useParams() as { id: string };
    
    const [maxPages, setMaxPages] = useState<number>(1);
    const [posts, setPosts] = useState<Post[] | null>(null);
    const [masterPost, setMasterPost] = useState<Post>({} as Post);
    const [replyTo, setReplyTo] = useState<Post | null>(null);
    
    
    const { user, jwt } = useAuth();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { category } = useCategory();
    const notification = useNotification();

    const goto:string = searchParams.get('goto') || '';
    const search:string = searchParams.get('search') || '';

    const shouldGoto = useRef<boolean>(true);
    
    const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket<{ type: string, data: any }>(WS_URL + "/ws?token=" + jwt, {
        share: true,
        shouldReconnect: () => true,
    });

    useEffect(() => {
        if (readyState === WebSocket.OPEN) {
            sendJsonMessage({ type: "post", data: id});
        }
    }, [readyState]);

    useEffect(() => {
        if(lastJsonMessage) {
            if (lastJsonMessage?.type == "post") {
                getPost(id, user ? user.ID.toString() : '0', page).then((data: any) => {
                    setPosts(data.posts);
                    setMasterPost(data.master_post);
                    setMaxPages(parseInt(data.total_pages));
                }).catch((error) => {
                    console.error('Failed to fetch posts:', error);
                });
                shouldGoto.current = false
            }
        }

        console.log(`Got a new message: ${JSON.stringify(lastJsonMessage)}`);
    }, [lastJsonMessage])

    useEffect(() => {
        if(goto != '') {
            if(shouldGoto.current) {
                scrollPostIntoView(goto);
            } else {
                shouldGoto.current = true;
            }        
        }
    }, [goto, posts, user]);

    useEffect(() => {
        if (search == '') {
            let userID = 0;
            if(user) {
                userID = user.ID;
            }
            getPost(id, userID.toString(), page).then((data: any) => {
                setPosts(data.posts);
                setMasterPost(data.master_post);
                setMaxPages(parseInt(data.total_pages));
            }).catch((error) => {
                console.error('Failed to fetch posts:', error);
                setPosts(null);
                notification("Failed to fetch posts", "error");
            });
        } else {
            searchContent(page, search, id).then((data: any) => {
                setPosts(data.posts);
                setMaxPages(parseInt(data.total_pages));
            }).catch((error) => {
                console.error('Failed to fetch posts:', error);
                setPosts(null);
                notification("Failed to fetch posts", "error");
            });
        }
        
    }, [page, goto, search, user]);

    function onPageChange(page: string | number) {
        navigate(`/category/${category?.name}/post/${id}/${page}`);
    }

    return (
        <>
            {(posts != null) && <div className="post-page">
                <div className="post-page__header">
                    {search  && <div className="post-page__search">
                        <SearchSVG />
                        <span>search result for: {search}</span>
                    </div>
                    }
                </div>
                {search == '' && <div className="post-page__master-post">
                    <div className={`post-page__master-post-title ${masterPost?.is_deleted ? 'deleted-post' : ''}`}>
                        {masterPost && masterPost.title}
                    </div>
                    <div className="post-page__master-post-meta">
                        <div className="post-page__master-post-username">
                            <UserSVG />
                            <span>
                                {masterPost?.user.username}
                            </span>
                        </div>
                        <div className="post-page__master-post-time">
                            <TimeSVG />
                            <span>
                                {masterPost && new Date(masterPost.created_at).toLocaleString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit',
                                    hour12: false
                                })}
                            </span>
                        </div>
                    </div>
                </div>
                }

                <div className="post-page__posts">
                    {(search != '' && posts?.length == 0) && 
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
                            {posts && posts.map((post) => (
                                <PostComponent search={search} setReplyTo={setReplyTo} key={post.ID} post={post} />
                            ))}
                            {(user && search == '') &&
                            <ReplyBox masterPost={masterPost} replyTo={replyTo} setReplyTo={setReplyTo} user={user}></ReplyBox>
                            }

                        </tbody>
                    </table>
                    {(!user && search == '') &&
                        <div className="post-page__please-login" onClick={() => navigate("/login")}>
                            <span>
                                please login to post  
                            </span>
                        </div>   
                    }
                </div>


            </div>
            }

            {(posts == null) &&
                <Loading />
            }
            {maxPages > 1 && <PaginationBar maxPages={maxPages} currentPage={page} onPageChange={onPageChange} />}
        </>
    )
}

export default PostPage;