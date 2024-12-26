import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { login as apiLogin } from '../api/auth';
import {jwtDecode} from 'jwt-decode';
import { getUser } from '../api/user';

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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [jwt, setJwt] = useState<string | null>(null);

    function writeJwtToCookie(jwt: string) {
        const cookieValue = `Bearer ${jwt}`;
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 120);
        document.cookie = `Authorization=${cookieValue}; path=/; expires=${expirationDate.toUTCString()}; SameSite=None; Secure`;
    }

    function readJwtFromCookie() {
        const cookies = document.cookie.split("; ");
        const authorizationCookie = cookies.find(cookie => cookie.startsWith("Authorization="));
        if (authorizationCookie) {
            const value = authorizationCookie.split("=")[1];
            if (value.startsWith("Bearer ")) {
                return value.slice(7);
            }
        }
        return null;
    }

    async function login(username: string, password: string) {
        return apiLogin(username, password).then((data: any) => {
            if (!data.error) {
                writeJwtToCookie(data.token);
                setJwt(data.token);
            }
            return data;
        });
    }

    async function logout() {
        document.cookie = 'Authorization=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        setJwt(null);
        setUser(null);
    }

    async function reload() {
        try {
            if (jwt) {
                const decoded: DecodedToken = jwtDecode(jwt);
                getUser(decoded.user_id).then((data: any) => {
                    setUser(data);
                }).catch((error: unknown) => {
                    console.error('Failed to fetch user:', error);
                    setUser(null);
                });
            } else {
                setUser(null);
            }
        } catch (error) {
            setUser(null);
        }
    }

    useEffect(() => {
        const jwt = readJwtFromCookie();
        setJwt(jwt);
    }, []);

    useEffect(() => {
        reload();
    }, [jwt]);

    return (
        <AuthContext.Provider value={{ user, login, logout, reload, jwt}}>
            {children}
        </AuthContext.Provider>
    );
}

function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export { AuthProvider, useAuth };