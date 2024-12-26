import { useEffect, useRef, useState } from "react";
import { changeEmail } from "../../../api/auth";
import { useNotification } from "../../../contexts/NotificationContext";
import { useAuth } from "../../../contexts/AuthContext";
import { drawRoughBorder } from "../../utils";
import { Input } from "../../utils";

function EmailSettings(): JSX.Element {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const currentPasswordCanvasRef = useRef<HTMLCanvasElement>(null);
    const emailCanvasRef = useRef<HTMLCanvasElement>(null);

    const showNotification = useNotification();

    const { reload } = useAuth();

    useEffect (() => {
        drawRoughBorder(currentPasswordCanvasRef);
        drawRoughBorder(emailCanvasRef);
    }, []);

    useEffect(() => {
        const handleEnter = (event: KeyboardEvent) => {
            if (event.key === "Enter") {
                onChangeEmail();
            }
        };

        document.addEventListener("keydown", handleEnter);

        return () => {
            document.removeEventListener("keydown", handleEnter);
        };
    }, []);

    function onChangeEmail() {
        if (email === "") {
            showNotification("Please enter an email", "error");
            return;
        }

        if (password === "") {
            showNotification("Please enter your password", "error");
            return;
        }

        changeEmail(password, email).then((data) => {
            if(data.error) {
                showNotification(data.error.toLowerCase(), "error");
                return;
            } else {
                showNotification("Email changed successfully", "success");
                reload();
            }
        }).catch(() => {
            showNotification("Failed to change email", "error");
        });
    }

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