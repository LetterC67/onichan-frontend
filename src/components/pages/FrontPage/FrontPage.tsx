import { useEffect, useState } from "react";
import "./FrontPage.css";
import { getCategories } from "../../../api/category";
import { useNavigate } from "react-router-dom";
import { Category as CategoryType } from "../../../interfaces";

interface CategoryProps {
    name: string;
    imageUrl: string;
    onClickAction: () => void;
}

function Category({ name, imageUrl, onClickAction }: CategoryProps): JSX.Element {
    return (
        <div className="category" onClick={onClickAction}>
            <div className="category__image">
                <img src={imageUrl} alt="category" />
            </div>
            <div className="category__title">
                <span>{name}</span>
            </div>
        </div>
    );
}

function FrontPage(): JSX.Element {
    const navigate = useNavigate();
    const [categories, setCategories] = useState<CategoryType[]>([]);

    function toCategory(category: CategoryType): void {
        void navigate(`/category/${category.name}`);
    }

    useEffect(() => {
        function getOptimalFontSize(element: HTMLDivElement, minFont: number = 10, maxFont: number = 100): number {
            const container = element.parentElement;
            let low = minFont;
            let high = maxFont;
            let optimalFontSize = minFont;
      
            while (low <= high) {
                const mid = Math.floor((low + high) / 2);
                element.style.fontSize = `${mid}px`;
        
                const isOverflowing = container && (element.scrollWidth > container.clientWidth || element.scrollHeight > container.clientHeight);
      
                if (isOverflowing == false) {
                    optimalFontSize = mid;
                    low = mid + 1;
                } else {
                    high = mid - 1;
                }
            }
      
            return optimalFontSize;
        }
        
        function applyFontSize(className: string, minFont = 10, maxFont = 100): void {
            const elements: NodeListOf<HTMLDivElement> = document.querySelectorAll(`.${className}`);
            let smallestFontSize = maxFont;

            // select the element with smallest scroll width currently
            let element: HTMLDivElement = elements[0];
            elements.forEach(el => {
                if (el.scrollWidth > element.scrollWidth) {
                    element = el;
                }
            });

            smallestFontSize = getOptimalFontSize(element, minFont, maxFont);

            elements.forEach(el => {
                el.style.fontSize = `${smallestFontSize}px`;
            });
        }
      
        if(document.readyState === 'complete') {
            try {
                applyFontSize('category__title');
            } catch {
                console.error('Failed to apply font size');
            }
        } else {
            window.addEventListener('DOMContentLoaded', () => {
                applyFontSize('category__title');
            });
        }
    
        window.addEventListener('resize', () => {
            applyFontSize('category__title');
        });

        return (): void => {
            window.removeEventListener('DOMContentLoaded', () => {
                applyFontSize('category__title');
            });
        
            window.removeEventListener('resize', () => {
                applyFontSize('category__title');
            });
        }
    }, [categories]);

    useEffect(() => {
        getCategories().then((data: CategoryType[]) => {
            setCategories(data);
        }).catch((error) => {
            console.error('Failed to fetch categories:', error);
            setCategories([]);
        });
    }, []);

    return (
        <div className="front-page">
            <div className="front-page__categories">
                {categories.map((category) => (
                    <Category key={category.ID} name={category.name} imageUrl={category.image_url} onClickAction={() => toCategory(category)} />
                ))}
            </div>
        </div>
    )
}

export default FrontPage;