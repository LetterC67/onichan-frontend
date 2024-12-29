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
      
            elements.forEach(el => {
                const requiredFontSize = getOptimalFontSize(el, minFont, maxFont);
                if (requiredFontSize < smallestFontSize) {
                    smallestFontSize = requiredFontSize;
                }
            });
            
            elements.forEach(el => {
                console.log(el);
                el.style.fontSize = `${smallestFontSize}px`;
            });
        }
      
        window.addEventListener('load', () => {
            applyFontSize('category__title');
        });
    
        window.addEventListener('resize', () => {
            applyFontSize('category__title');
        });
    }, []);

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