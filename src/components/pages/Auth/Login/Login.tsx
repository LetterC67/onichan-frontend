import "./../Login.css";
import React, { useEffect, useState, useRef } from "react";
import rough from "roughjs";
import LoginSVG from "../../../../assets/images/login.svg"
import { useNotification } from "../../../../contexts/NotificationContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../contexts/AuthContext";
import { Input } from "../../../utils";

function Login(): JSX.Element {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const showNotification  = useNotification();
    const navigate = useNavigate();

    const usernameCanvasRef = useRef<HTMLCanvasElement>(null);
    const passwordCanvasRef = useRef<HTMLCanvasElement>(null);

    const { login } = useAuth();

    const drawRoughBorder = (canvasRef: React.RefObject<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (canvas) {
            const rc = rough.canvas(canvas);
            const width = canvas.offsetWidth;
            
            const color = getComputedStyle(document.documentElement).getPropertyValue("--secondary-color").trim();
           
            rc.line(0, 0, width, 0, {
                roughness: 2,
                strokeWidth: 2,
                stroke: color,
            });
        }
    };

    useEffect(() => {
        drawRoughBorder(usernameCanvasRef);
        drawRoughBorder(passwordCanvasRef);
    }, []);

    useEffect(() => {
        const handleEnter = (event: KeyboardEvent) => {
            if (event.key === "Enter") {
                onLogin();
            }
        };

        document.addEventListener("keydown", handleEnter);

        return () => {
            document.removeEventListener("keydown", handleEnter);
        };
    }, [username, password]);

    async function onLogin() {
        if (username === "" || password === "") {
            showNotification("please fill in all fields", "error");
            return;
        }
        
        try {
            await login(username, password).then((data: any) => {
                if (data.error) {
                    showNotification(data.error.toLowerCase(), "error");
                } else {
                    showNotification("login successful", "success");
                    navigate("/");
                }
            });
        } catch (error) {
            showNotification("an unexpected error occurred", "error");
        }
    }

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
