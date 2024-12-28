import { useEffect, useState } from 'react';
import { Avatar, ChangeAvatarResponse } from '../../../interfaces';
import { getAllAvatars } from '../../../api/user';
import { useAuth } from '../../../contexts/AuthContext';
import { useNotification } from '../../../contexts/NotificationContext';
import { changeAvatar } from '../../../api/auth';

function PfpSettings(): JSX.Element {
    const [avatars, setAvatars] = useState<Avatar[]>([]);
    const { reload } = useAuth();
    const showNotification = useNotification();

    useEffect(() => {
        getAllAvatars().then((data) => {
            setAvatars(data);
        }).catch((error) => {
            console.error('Failed to fetch avatars:', error);
        });
    }, []);

    function onChangeAvatar(avatarURL: string): void {
        changeAvatar(avatarURL).then((data: ChangeAvatarResponse) => {
            if(data.error != null) {
                showNotification(data.error.toLowerCase(), "error");
            } else {
                showNotification("Avatar changed successfully", "success");
                void reload();
            }
        }).catch(() => {
            showNotification("Failed to change avatar", "error");
        });
    }

    return (
        <div className="user-settings__tab-pfp">
            <div className="user-settings__pfps">
                {avatars.map((p: Avatar) => (
                    <div key={p.avatar_url} className="user-settings__pfp" onClick={() => onChangeAvatar(p.avatar_url)}>
                        <img src={p.avatar_url} alt="avatar"/>
                    </div>
                ))}    
            </div>
        </div>
    )
}

export default PfpSettings;