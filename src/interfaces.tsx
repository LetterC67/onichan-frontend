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
    login: (username: string, password: string) => Promise<LoginResponse>;
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

interface Notification {
    ID: number;
    user_id: number;
    from_user_id: number;
    post_id: number;
    post: Post;
    from_user: User;
    notification_type: string;
    is_read: boolean;
}

interface GetPostsResponse {
    posts?: Post[];
    total_pages?: number;
    error?: string;
}

interface GetPostResponse {
    posts?: Post[];
    master_post?: Post;
    total_pages?: number;
    error?: string;
}

interface ToggleReactionResponse {
    message?: string;
    error?: string;
}

interface CreatePostResponse {
    error?: string;
    page?: number;
    id?: number;
}

interface SearchResponse     {
    posts?: Post[];
    total_pages?: number;
    error?: string;
}

interface CreateReportResponse {
    error?: string;
    message?: string;
    id?: number;
}

interface GetReportsResponse {
    reports?: Report[];
    error?: string;
    total_pages?: number;
}

interface ResolveReportResponse {
    error?: string;
    message?: string;
}

interface UploadResponse {
    error?: string;
    message?: string;
    path?: string;
}

interface LoginResponse {
    token?: string;
    error?: string;
}

interface RegisterResponse {
    message?: string;
    error?: string;
}

interface ChangeEmailResponse {
    message?: string;
    error?: string;
}

interface ChangePasswordResponse {
    message?: string;
    error?: string;
}


interface ChangeAvatarResponse {
    message?: string;
    error?: string;
}

interface ForgotPasswordResponse {
    message?: string;
    error?: string;
}

interface ResetPasswordResponse {
    password?: string;
    error?: string;
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
    Avatar,
    Notification,
    GetPostsResponse,
    GetPostResponse,
    ToggleReactionResponse,
    CreatePostResponse,
    SearchResponse,
    CreateReportResponse,
    GetReportsResponse,
    ResolveReportResponse,
    UploadResponse,
    LoginResponse,
    RegisterResponse,
    ChangeEmailResponse,
    ChangePasswordResponse,
    ChangeAvatarResponse,
    ForgotPasswordResponse,
    ResetPasswordResponse
}