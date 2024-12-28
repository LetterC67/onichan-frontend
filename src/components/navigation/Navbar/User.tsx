import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useNotification } from '../../../contexts/NotificationContext';

function User(): JSX.Element {
    const { user } = useAuth();
    const [visible, setVisible] = useState<boolean>(false);
    const ref = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const showNotification = useNotification();
    const { logout } = useAuth();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent): void => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setVisible(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);

        return (): void => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [])

    return (
        <div className="navbar__user-infos" onClick={() => setVisible(true)}>
            <img src={user?.avatar_url} alt="avatar"/>
            <span>{user?.username}</span>

            <div ref={ref} className={`navbar__user-options ${visible ? 'visible' : ''}`}>
                <div className="navbar__user-option" onClick={(event) => {
                    event.stopPropagation();
                    setVisible(false);
                    void navigate("/settings");
                }}>
                    <span>settings</span>
                </div>
                <div className="navbar__user-option" onClick={(event) => {
                    event.stopPropagation();
                    setVisible(false);
                    showNotification("logged out successfully", "success");
                    void logout();
                    void navigate("/");
                }}>
                    <span>logout</span>
                </div>
            </div>
        </div>
    )
}

export default User;