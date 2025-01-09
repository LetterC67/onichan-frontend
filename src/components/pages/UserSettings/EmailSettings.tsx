import { useCallback, useEffect, useRef, useState } from "react";
import { changeEmail } from "../../../api/auth";
import { useNotification } from "../../../contexts/NotificationContext";
import { useAuth } from "../../../contexts/AuthContext";
import { drawRoughBorder } from "../../utils";
import { Input } from "../../utils";
import { ChangeEmailResponse } from "../../../interfaces";
import useTopLoadingBar from "../../../hooks/useTopLoadingBar";

function EmailSettings(): JSX.Element {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const currentPasswordCanvasRef = useRef<HTMLCanvasElement>(null);
    const emailCanvasRef = useRef<HTMLCanvasElement>(null);

    const showNotification = useNotification();

    const { reload } = useAuth();
    const { start, complete } = useTopLoadingBar();

    useEffect (() => {
        drawRoughBorder(currentPasswordCanvasRef);
        drawRoughBorder(emailCanvasRef);
    }, []);

    const onChangeEmail = useCallback((): void => {
        if (email === "") {
            showNotification("Please enter an email", "error");
            return;
        }

        if (password === "") {
            showNotification("Please enter your password", "error");
            return;
        }

        start();

        changeEmail(password, email).then((data: ChangeEmailResponse) => {
            if(data.error != null) {
                showNotification(data.error.toLowerCase(), "error");
                return;
            } else {
                showNotification("Email changed successfully", "success");
                void reload();
            }
        }).catch(() => {
            showNotification("Failed to change email", "error");
        });

        complete();
    }, [email, password, showNotification, reload]);

    useEffect(() => {
        const handleEnter = (event: KeyboardEvent): void => {
            if (event.key === "Enter") {
                onChangeEmail();
            }
        };

        document.addEventListener("keydown", handleEnter);

        return (): void => {
            document.removeEventListener("keydown", handleEnter);
        };
    }, [onChangeEmail]);

    

    return (
        <div className="user-settings__tab-email">
            <div className="login__content">
                <Input canvasRef={currentPasswordCanvasRef} value={password} setValue={setPassword} placeholder="current password"></Input>
                <Input type="email" canvasRef={emailCanvasRef} value={email} setValue={setEmail} placeholder="new email"></Input>
                <div className="user-settings__change-email" onClick={onChangeEmail}>
                    change email
                </div>
            </div>
        </div>
    )
}

export default EmailSettings;