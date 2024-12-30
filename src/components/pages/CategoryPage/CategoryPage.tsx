import "./CategoryPage.css"
import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import PaginationBar from "../../pagination/PaginationBar/PaginationBar";
import { getPosts, searchTitle } from "../../../api/post";
import { SearchSVG, ChickenSVG } from "../../svg";
import Loading from "../../Loading";
import { Post, SearchResponse, GetPostsResponse } from "../../../interfaces";

function CategoryPage(): JSX.Element {
    const navigate = useNavigate();
    const [maxPages, setMaxPages] = useState<number>(1);
    const { id } = useParams() as { id: string };
    const { page = '1'} = useParams() as { page: string };
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const search = searchParams.get('search') ?? '';
    const [posts, setPosts] = useState<Post[] | null>(null);

    useEffect(() => {
        if(search !== '') {
            searchTitle(page, search, id).then((data: SearchResponse) => {
                setPosts(data.posts ?? []);
                setMaxPages(data.total_pages ?? 1);
            }).catch((error) => {
                console.error('Failed to fetch posts:', error);
                setPosts([]);
            });
        } else {
            getPosts(id, page).then((data: GetPostsResponse) => {
                setPosts(data.posts ?? []);
                setMaxPages(data.total_pages ?? 1);
            }).catch((error) => {
                console.error('Failed to fetch posts:', error);
                setPosts([]);
            });
        }
    }, [page, search, id]);

    function onPageChange(page: string | number): void {
        void navigate(`/category/${id}/${page}`);
    }

    return (
        <>
            {(posts != null) && 
                <div className="category-page">
                    {search &&<div className="category-page__header">
                        <div className="category-page__search">
                            <SearchSVG />
                            <span>search result for: {search}</span>
                        </div>
                    </div>
                    }
                    <div className="category-posts">
                        {posts?.length === 0 &&
                            <div className="category-page__empty">
                                <div>
                                    <ChickenSVG />
                                    <ChickenSVG />
                                    <ChickenSVG />
                                </div>
                                <span>nobody here but us chickens</span>
                            </div>
                        }
                            {posts?.map((post) => (
                                <div key={post.ID} className="category-post" onClick={() => {
                                    void navigate(`/category/${id}/post/${post.ID}`);
                                }}>
                                    <div className="category-post__left">
                                        <div className="category-post__avatar">
                                            <img src={post.user.avatar_url} alt="avatar" />
                                        </div>
                                        <div className="category-post__title">
                                            <p className={`category-post__post-title ${post.is_deleted ? 'deleted-post' : ''}`}>
                                                {post.title}
                                            </p>
                                            <p className="category-post__username">
                                                {post.user.username}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="category-post__meta">
                                        <div className="category-placeholder">
                                        </div>
                                        <div className="category-post__date">
                                            {new Date(post.last_updated).toLocaleString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                second: '2-digit',
                                                hour12: false
                                            })}
                                        </div>
                                        <div className="category-post__reply-count">
                                            {post.replies} replies
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            }

            {posts == null && 
                <div>
                    <Loading />
                </div>
            }

            {maxPages > 1 && <PaginationBar maxPages={maxPages} currentPage={parseInt(page)} onPageChange={onPageChange} />}
        </>
    )
}

export default CategoryPage;