import "./../Login.css";
import { useEffect, useState, useRef, useCallback } from "react";
import LoginSVG from "../../../../assets/images/login.svg"
import { useNotification } from "../../../../contexts/NotificationContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../contexts/AuthContext";
import { Input } from "../../../utils";
import { drawRoughBorder } from "../../../utils";
import { LoginResponse } from "../../../../interfaces";

function Login(): JSX.Element {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const showNotification  = useNotification();
    const navigate = useNavigate();

    const usernameCanvasRef = useRef<HTMLCanvasElement>(null);
    const passwordCanvasRef = useRef<HTMLCanvasElement>(null);

    const { login } = useAuth();

    const onLogin = useCallback((): void => {
        if (username === "" || password === "") {
            showNotification("please fill in all fields", "error");
            return;
        }
        
        login(username, password).then((data: LoginResponse) => {
            if (data.error != null) {
                showNotification(data.error.toLowerCase(), "error");
            } else {
                showNotification("login successful", "success");
                void navigate("/");
            }
        }).catch (() => {
        showNotification("an unexpected error occurred", "error");
        });
    }, [username, password, showNotification, navigate, login]);

    useEffect(() => {
        drawRoughBorder(usernameCanvasRef);
        drawRoughBorder(passwordCanvasRef);
    }, []);

    useEffect(() => {
        const handleEnter = (event: KeyboardEvent): void => {
            if (event.key === "Enter") {
                onLogin();
            }
        };

        document.addEventListener("keydown", handleEnter);

        return (): void => {
            document.removeEventListener("keydown", handleEnter);
        };
    }, [username, password, onLogin]);

    return (
        <div className="login">
            <div className="login__content">
                <div>
                    <img src={LoginSVG} alt="login" style={{width: "100%", height: "4rem"}}/>
                </div>
                
                <Input type="text" canvasRef={usernameCanvasRef} value={username} setValue={setUsername} placeholder="username"></Input>

                <Input type="password" canvasRef={passwordCanvasRef} value={password} setValue={setPassword} placeholder="password"></Input>
                <div className="login__options">
                    <div className="login__button" onClick={onLogin}>
                        login
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
