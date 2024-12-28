import { useState } from 'react';
import EllipsisPopUp from './EllipsisPopUp.tsx';

interface PageProps {
    page: number | string;
    currentPage: number;
    changePage: (page:  string) => void;
}

function Page({page, currentPage, changePage}: PageProps): JSX.Element {
    const [visible, setVisible] = useState<boolean>(false);

    return (
        <>
            { page != '...' && 
                <div className={`pagination-bar__page ${currentPage.toString() == page.toString() ? 'current' : ''}`} onClick={() => changePage(page.toString())}>
                    {page}
                </div>
            }

            { page == '...' &&
                <div className="pagination-bar__page" onClick={() => {
                    setVisible(true);
                }}>
                    {page}
                    <EllipsisPopUp visible={visible} onClose={() => {
                        setVisible(false);
                    }} onPageChange={changePage}/>
                </div>
            }
        </>
    )
}

export default Page;