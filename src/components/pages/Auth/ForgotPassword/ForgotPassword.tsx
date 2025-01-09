import "./../Login.css";
import { useEffect, useState, useRef, useCallback } from "react";
import LoginSVG from "../../../../assets/images/login.svg"
import { useNotification } from "../../../../contexts/NotificationContext";
import { forgotPassword } from "../../../../api/auth";
import { useNavigate } from "react-router-dom";
import { Input } from "../../../utils";
import { drawRoughBorder } from "../../../utils";
import { ForgotPasswordResponse } from "../../../../interfaces";
import useTopLoadingBar from "../../../../hooks/useTopLoadingBar";

function Login(): JSX.Element {
    const [email, setEmail] = useState<string>("");
    const showNotification  = useNotification();
    const navigate = useNavigate();

    const emailCanvasRef = useRef<HTMLCanvasElement>(null);

    const { start, complete } = useTopLoadingBar();

    useEffect(() => {
        drawRoughBorder(emailCanvasRef);
    }, []);

    const onForgotPassword = useCallback((): void => {
        if (email === "") {
            showNotification("please enter email", "error");
            return;
        }

        start();

        forgotPassword(email).then((data: ForgotPasswordResponse) => {
            if(data.error != null) {
                showNotification(data.error.toLowerCase(), "error");
            } else {
                showNotification("password reset email sent", "success");
            }
        }).catch(() => {
            showNotification("an unexpected error occurred", "error");
        }).finally(() => {
            complete();
        });
    }, [email, showNotification, navigate, start, complete]);

    useEffect(() => {
        const handleEnter = (event: KeyboardEvent): void => {
            if (event.key === "Enter") {
                onForgotPassword();
            }
        };

        document.addEventListener("keydown", handleEnter);

        return (): void => {
            document.removeEventListener("keydown", handleEnter);
        };
    }, [email]);

    return (
        <div className="login">
            <div className="login__content">
                <div>
                    <img src={LoginSVG} alt="login" style={{width: "100%", height: "4rem"}}/>
                </div>
                
                <Input type="text" canvasRef={emailCanvasRef} value={email} setValue={setEmail} placeholder="email"></Input>

                <div className="login__options">
                    <div className="login__button" onClick={onForgotPassword}>
                        reset password
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
