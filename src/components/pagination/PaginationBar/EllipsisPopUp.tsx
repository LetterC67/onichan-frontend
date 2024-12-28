import { useEffect, useRef, useState } from "react";

interface EllipsisPopUpProps {
    visible: boolean;
    onClose: () => void;
    onPageChange: (page: string) => void;
}

function EllipsisPopUp({visible, onClose, onPageChange}: EllipsisPopUpProps): JSX.Element {
    const [page, setPage] = useState<string>("");
    const popUpRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if(visible == true) {
            setPage("");
        }
    }, [visible]);

    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent): void => {
            if (popUpRef.current && !popUpRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        const handleEnter = (event: KeyboardEvent): void => {
            if (event.key === "Enter" && visible) {
                onPageChange(page);
            }
        };  

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEnter);

        return (): void => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEnter);
        }
    }, [visible, onPageChange, page, onClose]);

    return (
        <div
            ref={popUpRef}
            className={`ellipsis-pop-up ${visible ? "visible" : ""}`}
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

export default EllipsisPopUp;