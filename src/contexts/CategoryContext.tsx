import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getCategory } from '../api/category';
import { useLocation } from 'react-router-dom';
import { Category } from '../interfaces';

interface CategoryContextType {
    category: Category | null;
    setCategory: (category: Category | null) => void;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

function CategoryProvider({ children }: { children: ReactNode }): JSX.Element {
    const [category, setCategory] = useState<Category | null>(null);
    const location = useLocation();

    
    useEffect(() => {
        function getCategoryFromURL(): string {
            const parts = location.pathname.split('/').filter(part => part !== '');
    
            if (parts.length >= 2 && parts[0] === 'category') {
                return parts[1];
            }
    
            return "";
        }

        const category:(string) = getCategoryFromURL();

        if (category === "") {
            setCategory(null);
            return;
        }

        getCategory(category).then((data: Category) => {
            setCategory(data);
        }).catch((error) => {
            console.error('Failed to fetch category:', error);
            setCategory(null);
        });
    }, [location.pathname]);

    return (
        <CategoryContext.Provider value={{ category, setCategory }}>
            {children}
        </CategoryContext.Provider>
    );
}

function useCategory(): CategoryContextType {
    const context = useContext(CategoryContext);
    if (context === undefined) {
        throw new Error('useCategory must be used within a CategoryProvider');
    }
    return context;
}

export { CategoryProvider, useCategory };