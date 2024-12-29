import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { login as apiLogin } from '../api/auth';
import {jwtDecode} from 'jwt-decode';
import { getUser } from '../api/user';
import { LoginResponse } from '../interfaces';

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
    logout: () => Promise<void>;
    reload: () => Promise<void>;
    jwt: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function AuthProvider({ children }: { children: ReactNode }): JSX.Element {
    const [user, setUser] = useState<User | null>(null);
    const [jwt, setJwt] = useState<string | null>(null);

    function writeJwtToCookie(jwt: string): void {
        const cookieValue = `Bearer ${jwt}`;
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 120);
        document.cookie = `Authorization=${cookieValue}; path=/; expires=${expirationDate.toUTCString()}`;
    }

    function readJwtFromCookie(): string | null {
        const cookies = document.cookie.split("; ");
        const authorizationCookie = cookies.find(cookie => cookie.startsWith("Authorization="));
        if (authorizationCookie != null) {
            const value = authorizationCookie.split("=")[1];
            if (value.startsWith("Bearer ")) {
                return value.slice(7);
            }
        }
        return null;
    }

    async function login(username: string, password: string): Promise<LoginResponse> {
        return apiLogin(username, password).then((data: LoginResponse) => {
            if (data.error == null) {
                writeJwtToCookie(data.token ?? '');
                setJwt(data.token ?? '');
            }
            return data;
        });
    }

    async function logout(): Promise<void> {
        document.cookie = 'Authorization=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        setJwt(null);
        setUser(null);
    }

   const reload = useCallback(async (): Promise<void> => {
        try {
            if (jwt != null) {
                const decoded: DecodedToken = jwtDecode(jwt);
                getUser(decoded.user_id).then((data: User) => {
                    setUser(data);
                }).catch((error: unknown) => {
                    console.error('Failed to fetch user:', error);
                    setUser(null);
                });
            } else {
                setUser(null);
            }
        } catch {
            setUser(null);
        }
    }, [jwt]);

    useEffect(() => {
        const jwt = readJwtFromCookie();
        setJwt(jwt);
    }, []);

    useEffect(() => {
        void reload();
    }, [jwt, reload]);

    return (
        <AuthContext.Provider value={{ user, login, logout, reload, jwt}}>
            {children}
        </AuthContext.Provider>
    );
}

function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export { AuthProvider, useAuth };