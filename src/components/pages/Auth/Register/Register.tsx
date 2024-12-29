import "./../Login.css";
import { useEffect, useState, useRef, useCallback } from "react";
import LoginSVG from "../../../../assets/images/login.svg";
import { register } from "../../../../api/auth";
import { useNotification } from "../../../../contexts/NotificationContext";
import { useNavigate } from "react-router-dom";
import { Input, drawRoughBorder } from "../../../utils";
import { RegisterResponse } from "../../../../interfaces";

function Register(): JSX.Element {
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");

    const showNotification  = useNotification();
    const navigate = useNavigate();

    const usernameCanvasRef = useRef<HTMLCanvasElement>(null);
    const emailCanvasRef = useRef<HTMLCanvasElement>(null);
    const passwordCanvasRef = useRef<HTMLCanvasElement>(null);
    const confirmPasswordCanvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        drawRoughBorder(usernameCanvasRef);
        drawRoughBorder(emailCanvasRef);
        drawRoughBorder(passwordCanvasRef);
        drawRoughBorder(confirmPasswordCanvasRef);
    }, []);

    const onRegister = useCallback((): void => {
        if (username === "" || password === "" || email === "" || confirmPassword === "") {
            showNotification("please fill in all fields", "error");
            return;
        }

        if (password !== confirmPassword) {
            showNotification("passwords do not match", "error");
            return;
        }

        if (password.length < 8) {
            showNotification("password must be at least 8 characters long", "error");
            return;
        }
        
        register(username, email, password).then((data: RegisterResponse) => {
            if (data.error != null) {
                showNotification(data.error.toLowerCase(), "error");
            } else {
                showNotification("registration successful, you can now login", "success");
                void navigate("/login");
            }
        }).catch(() => {
            showNotification("an unexpected error occurred", "error");
        });
    }, [username, email, password, confirmPassword, showNotification, navigate]);

    useEffect(() => {
        const handleEnter = (event: KeyboardEvent): void => {
            if (event.key === "Enter") {
                onRegister();
            }
        };

        document.addEventListener("keydown", handleEnter);

        return (): void => {
            document.removeEventListener("keydown", handleEnter);
        };
    }, [username, password, confirmPassword, email, showNotification, navigate, onRegister]);


    return (
        <div className="login">
            <div className="login__content">
            <div>
                <img src={LoginSVG} alt="login" style={{width: "100%", height: "4rem"}}/>
            </div>
            
                <Input type="text" canvasRef={usernameCanvasRef} value={username} setValue={setUsername} placeholder="username"></Input>

                <Input type="email" canvasRef={emailCanvasRef} value={email} setValue={setEmail} placeholder="email"></Input>

                <Input type="password" canvasRef={passwordCanvasRef} value={password} setValue={setPassword} placeholder="password"></Input>

                <Input type="password" canvasRef={confirmPasswordCanvasRef} value={confirmPassword} setValue={setConfirmPassword} placeholder="confirm password"></Input>

                <div className="login__options">
                    <div className="login__button" onClick={onRegister}>
                        register
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
