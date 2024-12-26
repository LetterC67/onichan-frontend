interface Reaction {
    ID: number;
    name: string;
    emoji: string;
}

interface Category {
    ID: number;
    name: string;
    image_url: string;
}

interface Report {
    ID: number;
    post: Post;
    resolved: boolean;
}

interface PostReactionsCount {
    reaction: Reaction,
    count: number
}

interface User {
    ID: number;
    username: string;
    avatar_url: string;
    role: string;
    email: string;
	created_at: Date;
}

interface DecodedToken {
    user_id: string;
}

interface AuthContextType {
    user: User | null;
    login: (username: string, password: string) => Promise<any>;
    logout: () => void;
    reload: () => void;
    jwt: string | null;
}


interface Post {
    ID: number;
    title: string;
    content: string;
    parent_post_id: number;
    user: User;
    category: Category;
    created_at: Date;
    last_updated: Date;
    reply_to: Post | null;
    replies: number;
    reactions: PostReactionsCount[];
    user_reactions: PostReactionsCount[];
    page: number;
    is_deleted: boolean;
}


interface Report {
    ID: number;
    post: Post;
    resolved: boolean;
}

interface Avatar {
    avatar_url: string;
}

export type {
    Category,
    Report,
    User,
    DecodedToken,
    AuthContextType,
    Post,
    PostReactionsCount,
    Reaction,
    Avatar
}