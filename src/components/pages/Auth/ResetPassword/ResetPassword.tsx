import "./ResetPassword.css";
import { useEffect, useState } from 'react';
import { resetPassword } from '../../../../api/auth';

function ResetPassword(): JSX.Element {
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token') ?? '';
    const [password, setPassword] = useState<string | undefined>(undefined);

    useEffect(() => {
        resetPassword(token).then((data) => {
            if(data.error != null) {
                setPassword("");
                console.error(data.error);
            } else {
                setPassword(data.password);
                console.log("Password reset successfully");
            }
        }).catch(() => {
            console.error("Failed to reset password");
        });
    }, []);

    return (
        <>
            {(password != undefined && password != "") &&
                <div className="reset-password">
                    <p className="reset-password__new-password">your new password is: <span className="reset-password__password">{password}</span></p>
                </div>
            }

            {(password == undefined || password == "") &&
                <div className="reset-password">
                    <p className="reset-password__new-password">failed to reset password!</p>
                </div>
            }
        </>
    )
}

export default ResetPassword;