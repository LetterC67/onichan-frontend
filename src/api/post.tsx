import { apiClient } from './apiClient';

async function getPosts(category: string, page: string) {
    try {
        const response = await apiClient.get(`/posts?category_name=${category}&page=${page}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

async function getPost(slug: string, userID: string, page: string) {
    try {
        const response = await apiClient.get(`/posts/${slug}?user_id=${userID}&page=${page}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

async function toggleReaction(postID: number, reactionID: number | string) {
    try {
        const response = await apiClient.put(`/posts/reactions`, {
            post_id: postID,
            reaction_id: reactionID,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

async function comment(replyToPostID: number | null, parentPostID: number, categoryID: number, content: string) {
    try {
        const response = await apiClient.post(`/posts`, {
            reply_to_id: replyToPostID,
            parent_post_id: parentPostID,
            category_id: categoryID,
            content: content,
            title: null,
            is_master_post: false,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}


async function post(categoryID: number, content: string, title: string) {
    try {
        const response = await apiClient.post(`/posts`, {
            content: content,
            category_id: categoryID,
            title: title,
            is_master_post: true,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

async function getReactions() {
    try {
        const response = await apiClient.get(`/reactions`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

async function searchTitle(page: string, title: string, category: string) {
    try {
        const response = await apiClient.get(`/search/title?title=${title}&category=${category}&page=${page}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

async function searchContent(page: string, content: string, postID: string) {
    try {
        const response = await apiClient.get(`/search/posts?content=${content}&id=${postID}&page=${page}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export {
    getPosts,
    getPost,
    comment,
    toggleReaction,
    getReactions,
    post,
    searchTitle,
    searchContent
}