import "./PaginationBar.css"
import { useState, useEffect } from "react";
import Page from "./Page";


interface PaginationBarProps {
    maxPages: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}

function PaginationBar({maxPages, currentPage, onPageChange}: PaginationBarProps): JSX.Element {
    const [pages, setPages] = useState<(number | string)[]>([]);
    const [bottomed, setBottomed] = useState(false);

    const handleScroll = (): void => {
        if ((window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight) {
            setBottomed(true);
        } else {
            setBottomed(false);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        window.addEventListener('load', handleScroll);
    
        return (): void => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('load', handleScroll);
        };
    }, [currentPage]);

    useEffect(() => {
        handleScroll();
    });
    

    useEffect(() => {
        const _pages = [];
        const _currentPage = currentPage;
        _pages.push(1);

        if(currentPage > 4) {
            _pages.push("...")
        }

        for(let i = _currentPage - 2; i <= _currentPage + 2; i++) {
            if(i > 1 && i < maxPages) {
                _pages.push(i.toString());
            }
        }
        
        if(_currentPage < maxPages - 3) {
            _pages.push("...");
        }

        if (maxPages > 1) _pages.push(maxPages.toString());

        setPages(_pages);
    }, [maxPages, currentPage]);

    function changePage(page: string): void {
        if(isNaN(parseInt(page))) {
            return;
        }

        if(parseInt(page) < 1 || parseInt(page) > maxPages) {
            return;
        }

        onPageChange(parseInt(page));
    }

    return (
        <div className={`pagination-bar ${!bottomed ? 'bottom' : ''}`}>
            <div className="pagination-bar__content">
                {pages.map((page) => (
                    <Page currentPage={currentPage} changePage={changePage} page={page} />
                ))}
            </div>
        </div>
    )
}

export default PaginationBar;