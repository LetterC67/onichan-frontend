import "./Navbar.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { WriteSVG, ExclamationSVG, ReturnSVG } from "../../svg";
import { useCategory } from "../../../contexts/CategoryContext";
import Notification from "./Notification";
import Search from "./Search";
import User from "./User";


function Navbar(): JSX.Element {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { category } = useCategory();
    const [scrolled, setScrolled] = useState<boolean>(false);

    useEffect(() => {
		const handleScroll = (): void => {
			if (window.scrollY > 20) {
				setScrolled(true);
			} else {
				setScrolled(false);
			}
		};

		window.addEventListener("scroll", handleScroll);
		return (): void => {
			window.removeEventListener("scroll", handleScroll);
		};	
	}, []);

    function Return(): void {
        if(window.location.pathname.includes("post")) {
            void navigate(`/category/${category?.name}`);
        } else {
            void navigate("/");
        }
    }

    function ReturnLogo(): void {
        if(window.location.pathname.includes("category")) {
            void navigate(`/category/${category?.name}`);
        } else {
            void navigate("/");
        }
    }

    return (
        <div className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <div className="navbar__content">
                <div className="navbar__start">
                    <div className="navbar__start-logo" >
                        <div className="navbar__start-onichan-logo">
                            <span className="navbar__start-return">
                                {category &&
                                    <div onClick={Return}>
                                        <ReturnSVG />
                                    </div>
                                }
                            </span>
                            <div className="navbar__logo-content" onClick={ReturnLogo   }>
                                <span className="navbar__onichan">onichan</span>
                                {category && <img src={category.image_url} alt="category"/>}
                                {category && <span className="navbar__category-name">{category.name}</span>}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="navbar__end">
                    {user && 
                        <div className="navbar__user-info">
                            <User/>
                            {category &&
                                <div className="navbar__write" onClick={() => void navigate(`/category/${category.name}/create-post`)}>
                                    <WriteSVG/>
                                </div>
                            }
                            {category && 
                                <Search category={category}/>
                            }
                            {user.role === "admin" &&
                                <div className="navbar__report" onClick={() => void navigate("/reports")}>
                                    <ExclamationSVG/>
                                </div>
                            }
                            <Notification/>
                        </div>
                    }
                    {!user &&
                        <>
                            <a onClick={() => void navigate("/login")}>login</a>
                            <a onClick={() => void navigate("/register")}>register</a>
                        </>
                    }
                </div>
            </div>
        </div>
    )
}

export default Navbar;