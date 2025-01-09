import { drawRoughBorder } from "../../utils";
import { Input } from "../../utils";
import { changePassword } from "../../../api/auth";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNotification } from "../../../contexts/NotificationContext";
import useTopLoadingBar from "../../../hooks/useTopLoadingBar";

function PasswordSettings(): JSX.Element {
    const [currentPassword, setCurrentPassoword] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");

    const showNotification  = useNotification();

    const currentPasswordCanvasRef = useRef<HTMLCanvasElement>(null);
    const passwordCanvasRef = useRef<HTMLCanvasElement>(null);
    const confirmPasswordCanvasRef = useRef<HTMLCanvasElement>(null);

    const { start, complete } = useTopLoadingBar();

    const onChangePassword = useCallback((): void => {
        if (password !== confirmPassword) {
            showNotification("Passwords do not match", "error");
            return;
        }

        if (password.length < 8) {
            showNotification("Password must be at least 8 characters long", "error");
            return;
        }

        start();

        changePassword(currentPassword, password).then((data) => {
            if(data.error != null) {
                showNotification(data.error.toLowerCase(), "error");
                return;
            } else {
                showNotification("Password changed successfully", "success");
            }
        }).catch(() => {
            showNotification("Failed to change password", "error");
        });

        complete();
    }, [currentPassword, password, confirmPassword, showNotification]);

    useEffect (() => {
        drawRoughBorder(currentPasswordCanvasRef);
        drawRoughBorder(passwordCanvasRef);
        drawRoughBorder(confirmPasswordCanvasRef);
    }, []);

    useEffect(() => {
        const handleEnter = (event: KeyboardEvent): void => {
            if (event.key === "Enter") {
                onChangePassword();
            }
        };

        document.addEventListener("keydown", handleEnter);

        return (): void => {
            document.removeEventListener("keydown", handleEnter);
        };
    }, [onChangePassword]);

    return (
        <div className="user-settings__password">
            <div className="login__content">
                <Input canvasRef={currentPasswordCanvasRef} value={currentPassword} setValue={setCurrentPassoword} placeholder="current password"></Input>
                <Input canvasRef={passwordCanvasRef} value={password} setValue={setPassword} placeholder="new password"></Input>
                <Input canvasRef={confirmPasswordCanvasRef} value={confirmPassword} setValue={setConfirmPassword} placeholder="repeat new password"></Input>
                <div className="user-settings__change-password" onClick={onChangePassword}>
                    change password
                </div>
            </div>
        </div>
    )
}

export default PasswordSettings;