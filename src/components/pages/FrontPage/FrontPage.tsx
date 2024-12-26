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
        navigate(`/category/${category.name}`);
    }

    useEffect(() => {
        getCategories().then((data: any) => {
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