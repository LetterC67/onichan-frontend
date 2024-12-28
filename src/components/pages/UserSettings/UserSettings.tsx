import "./UserSettings.css";
import { useAuth } from "../../../contexts/AuthContext";
import { useState } from "react";
import PasswordSettings from "./PasswordSettings";
import EmailSettings from "./EmailSettings";
import PfpSettings from "./PfpSettings";

function UserSettings(): JSX.Element {
    const { user } = useAuth();
    const [tab, setTab] = useState<string>("password");

    const tabs:string[] =  [
        "password",
        "email",
        "pfp"
    ]

    function Header(): JSX.Element {
        return (
            <div className="user-settings__header">
                <div className="user-settings__user">
                    <div className="user-settings__user-avatar">
                        <img src={user?.avatar_url} alt="user avatar"/>
                    </div>
                    <div className="user-settings__user-meta">
                        <span className="user-settings__username">{user?.username}</span>
                        <span className="user-settings__email">{user?.email}</span>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="user-settings">
            <Header/>
            <div className="user-settings__tab">
                {tab === "password" &&
                    <PasswordSettings></PasswordSettings>
                }
                {tab === "email" &&
                    <EmailSettings></EmailSettings>
                }
                {tab === "pfp" &&
                    <PfpSettings></PfpSettings>
                }
            </div>
            <div className="user-settings__footer">
                <div className="user-settings__tab-options">
                {tabs.map((t) => (
                    <div key={t} className={`user-settings__tab-option ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
                        {t}
                    </div>
                ))}
                </div>
            </div>
        </div>
    );
}

export default UserSettings;