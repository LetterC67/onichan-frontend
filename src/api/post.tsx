import { apiClient } from './apiClient';
import { GetPostsResponse, GetPostResponse, ToggleReactionResponse, CreatePostResponse, SearchResponse } from '../interfaces';

async function getPosts(category: string, page: string): Promise<GetPostsResponse> {
    const response = await apiClient.get(`/posts?category_name=${category}&page=${page}`);
    return response.data;
}

async function getPost(slug: string, userID: string, page: string): Promise<GetPostResponse> {
    const response = await apiClient.get(`/posts/${slug}?user_id=${userID}&page=${page}`);
    return response.data;
}

async function toggleReaction(postID: number, reactionID: number | string): Promise<ToggleReactionResponse> {
    const response = await apiClient.put(`/posts/reactions`, {
        post_id: postID,
        reaction_id: reactionID,
    });
    return response.data;
}

async function comment(replyToPostID: number | null, parentPostID: number, categoryID: number, content: string): Promise<CreatePostResponse> {
    const response = await apiClient.post(`/posts`, {
        reply_to_id: replyToPostID,
        parent_post_id: parentPostID,
        category_id: categoryID,
        content: content,
        title: null,
        is_master_post: false,
    });
    return response.data;
}


async function post(categoryID: number, content: string, title: string): Promise<CreatePostResponse> {
    const response = await apiClient.post(`/posts`, {
        content: content,
        category_id: categoryID,
        title: title,
        is_master_post: true,
    });
    return response.data;
}

async function searchTitle(page: string, title: string, category: string): Promise<SearchResponse> {
    const response = await apiClient.get(`/search/title?title=${title}&category=${category}&page=${page}`);
    return response.data;
}

async function searchContent(page: string, content: string, postID: string): Promise<SearchResponse> {
    const response = await apiClient.get(`/search/posts?content=${content}&id=${postID}&page=${page}`);
    return response.data;
}

export {
    getPosts,
    getPost,
    comment,
    toggleReaction,
    post,
    searchTitle,
    searchContent
}