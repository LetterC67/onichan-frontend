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

    function removeLastPageSegment(pathname: string) {
        const segments = pathname.split('/');
        const lastSegment = segments[segments.length - 1];
        if (!isNaN(Number(lastSegment))) {
            return segments.slice(0, -1).join('/');
        }
        return pathname;
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setVisible(false);
            }
        }

        const handleEnter = (event: KeyboardEvent) => {
            if(event.key === "Enter" && visible) {
                if(location.pathname.includes("post")) {
                    navigate(removeLastPageSegment(location.pathname) + `/1?search=${searchContentRef.current?.value}`);
                } else {
                    navigate(`/category/${category?.name}?search=${searchContentRef.current?.value}`);
                    setVisible(false);
                }
            }
        }

        document.addEventListener('keydown', handleEnter);
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEnter);
        }
    }, [visible]);


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