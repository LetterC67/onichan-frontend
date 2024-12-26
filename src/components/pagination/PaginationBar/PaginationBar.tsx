import "./PaginationBar.css"
import { useState, useEffect, useRef } from "react";

function EllipsisPopUp(props: any) {
    const [page, setPage] = useState<string>("");
    const popUpRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if(props.visible == true) {
            setPage("");
        }
    }, [props.visible]);

    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popUpRef.current && !popUpRef.current.contains(event.target as Node)) {
                if (props.onClose) {
                    props.onClose();
                }
            }
        };

        const handleEnter = (event: KeyboardEvent) => {
            if (event.key === "Enter" && props.visible) {
                props.onPageChange(page);
            }
        };  

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEnter);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEnter);
        }
    }, [props.visible, props.onPageChange, page]);

    return (
        <div
            ref={popUpRef}
            className={`ellipsis-pop-up ${props.visible ? "visible" : ""}`}
        >
            <div className="ellipsis-pop-up__content">
                <div className="ellipsis-pop-up__title">
                    <span>go to page</span>
                </div>
                <div className="ellipsis-pop-up__input">
                    <input
                        placeholder="0"
                        type="number"
                        className="cursor-only"
                        value={page}
                        onChange={(e) => setPage(e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
}

function PaginationBar(props: any) {
    const maxPages = props.maxPages;
    const currentPage = props.currentPage;
    const onPageChange = props.onPageChange;
    const [pages, setPages] = useState<string[]>([]);
    const [bottomed, setBottomed] = useState(false);

    const handleScroll = () => {
        if ((window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight) {
            setBottomed(true);
        } else {
            setBottomed(false);
        }
    };

    useEffect(() => {
        const handleInitial = () => {
            handleScroll();
        };
    
        window.addEventListener('scroll', handleScroll);
        window.addEventListener('load', handleInitial);
    
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('load', handleInitial);
        };
    }, [currentPage]);

    useEffect(() => {
        handleScroll();
    });
    

    useEffect(() => {
        const _pages = [];
        const _currentPage = parseInt(currentPage);
        _pages.push("1");

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

    function changePage(page: string) {
        if(isNaN(parseInt(page))) {
            return;
        }

        if(parseInt(page) < 1 || parseInt(page) > maxPages) {
            return;
        }

        onPageChange(page);
    }

    function Page(props: any) {
        const [visible, setVisible] = useState<boolean>(false);

        return (
            <>
            { props.page != '...' && 
                <div className={`pagination-bar__page ${currentPage.toString() == props.page ? 'current' : ''}`} onClick={() => changePage(props.page)}>
                    {props.page}
                </div>
            }

            { props.page == '...' &&
                <div className="pagination-bar__page" onClick={() => {
                    setVisible(true);
                }}>
                    {props.page}
                    <EllipsisPopUp visible={visible} onClose={() => {
                        setVisible(false);
                    }} onPageChange={changePage}/>
                </div>
            }
            </>
        )
    }

    return (
        <div className={`pagination-bar ${!bottomed ? 'bottom' : ''}`}>
            <div className="pagination-bar__content">
                {pages.map((page) => (
                    <Page page={page} />
                ))}
            </div>
        </div>
    )
}

export default PaginationBar;