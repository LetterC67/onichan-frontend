import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import useWebSocket from "react-use-websocket";
import { getUnreadNotifications, readNotifications } from "../../../api/notification";
import { BellFilledSVG, BellSVG, ChickenSVG } from "../../svg";

const WS_URL = import.meta.env.VITE_APP_WS_URL;

function Notification() {   
    const [notifications, setNotifications] = useState<any>([]);
    const [visible, setVisible] = useState<boolean>(false);
    const [isRead, setIsRead] = useState<boolean>(true);
    const notificationRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const { jwt } = useAuth();

    const { lastJsonMessage } = useWebSocket<{ type: string, data: any }>(WS_URL + "/ws?token=" + jwt, {
        share: true,
        shouldReconnect: () => true,
    });

    useEffect(() => {
        if(lastJsonMessage) {
            if (lastJsonMessage?.type == "notification") {
                setNotifications((notifications: any) => [lastJsonMessage.data, ...notifications]);
                setIsRead(false);
            }
        }

        //console.log(`Got a new message: ${JSON.stringify(lastJsonMessage)}`);
    }, [lastJsonMessage])
    
    useEffect(() => {
        getUnreadNotifications().then((data) => {
            setNotifications(data);
        }).catch((error) => {
            console.error('Failed to fetch notifications:', error);
            setNotifications([]);
        });
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setVisible(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, []);

    useEffect(() => {
        if(notifications.length > 0) {
            setIsRead(false);   
        }
    }, [notifications]);

    useEffect(() => {
        if(visible) {
            setIsRead(true);
            readNotifications();
        }
    }, [visible]);

    return (
        <div className="navbar__notification" onClick={() => setVisible(true)}>
            {!isRead && <BellFilledSVG/>}
            {isRead && <BellSVG/>}
            <div ref={notificationRef} className={`navbar__notifications ${visible ? 'visible' : ''}`}>
                {notifications.map((notification: any) => (
                    <div key={notification.ID} className="navbar____notification" onClick={(event) => 
                        {
                            event.stopPropagation();
                            setVisible(false);
                            navigate(`/category/${notification.post.category.name}/post/${notification.post.parent_post_id}/${notification.post.page}?goto=${notification.post.ID}`)
                        }
                    }>
                        <span>
                            <img src={notification.from_user.avatar_url} alt="avatar"/>
                        </span>
                        <span>
                            <span className="navbar___notification-username">{notification.from_user.username}</span>
                            <span>&nbsp;</span>
                            {notification.notification_type === "comment" && <span>commented on your post</span>}
                            {notification.notification_type === "reply" && <span>replied to your post</span>}
                        </span>
                    </div>
                ))}

                {notifications.length === 0 &&
                    <div className="navbar__no-notification">
                        <ChickenSVG/>
                        <span>nobody here but us chickens</span>
                    </div>
                }
            </div>
        </div>
    )
}

export default Notification;