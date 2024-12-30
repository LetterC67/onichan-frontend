import { useEffect, useRef, useState } from "react";
import { Category } from "../../../interfaces";
import { useLocation, useNavigate } from "react-router-dom";
import { SearchSVG } from "../../svg";

interface SearchProps {
    category: Category | null;
}

function Search({category}: SearchProps): JSX.Element {
    const [visible, setVisible] = useState<boolean>(false);
    const searchRef = useRef<HTMLInputElement | null>(null);
    const searchContentRef = useRef<HTMLInputElement | null>(null);
    const navigate = useNavigate();
    const location = useLocation();

    function removeLastPageSegment(pathname: string): string {
        const segments = pathname.split('/');
        const lastSegment = segments[segments.length - 1];
        const secondToLastSegment = segments[segments.length - 2];
        if (!isNaN(Number(lastSegment)) && !isNaN(Number(secondToLastSegment))) {
            return segments.slice(0, -1).join('/');
        }
        return pathname;
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent): void => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setVisible(false);
            }
        }

        const handleEnter = (event: KeyboardEvent): void => {
            if(event.key === "Enter" && visible) {
                if(location.pathname.includes("post")) {
                    void navigate(removeLastPageSegment(location.pathname) + `/1?search=${searchContentRef.current?.value}`);
                } else {
                    void navigate(`/category/${category?.name}?search=${searchContentRef.current?.value}`);
                    setVisible(false);
                }
            }
        }

        document.addEventListener('keydown', handleEnter);
        document.addEventListener('mousedown', handleClickOutside);

        return (): void => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEnter);
        }
    }, [visible, category, navigate, location.pathname]);


    return (
        <div className={`navbar__search-wrapper`} onClick={() => setVisible(true)}>
            <SearchSVG/>
            <div ref={searchRef} className={`navbar__search ${visible ? 'visible' : ''}`}>
                <input ref={searchContentRef} type="text" placeholder="search"/>
            </div>
        </div>
    )
}

export default Search;