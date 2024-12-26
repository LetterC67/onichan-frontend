import './App.css'
import Navbar from './components/navigation/Navbar/Navbar.tsx'
import CategoryPage from './components/pages/CategoryPage/CategoryPage.tsx';
import FrontPage from './components/pages/FrontPage/FrontPage.tsx'
import PostPage from './components/pages/PostPage/PostPage.tsx';
import Register  from './components/pages/Auth/Register/Register.tsx';
import Login from './components/pages/Auth/Login/Login.tsx';
import CreatePost from './components/pages/CreatePost/CreatePost.tsx';
import UserSettings from './components/pages/UserSettings/UserSettings.tsx';
import ReportPage from './components/pages/ReportPage/ReportPage.tsx';
import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { useLocation } from "react-router-dom";
import 'overlayscrollbars/overlayscrollbars.css';

function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }, [pathname]);

    return null;
}

function App(): JSX.Element {
	return (
		<>
			<ScrollToTop />
			<Navbar/>
			
			<Routes>
				<Route path="/reports" element={<ReportPage />} />
				<Route path="/reports/:page" element={<ReportPage />} />
				<Route path="/settings" element={<UserSettings />} />
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
				<Route path="/" element={<FrontPage />} />
				<Route path="/category/:id/create-post" element={<CreatePost />} />
				<Route path="/category/:id" element={<CategoryPage />} />
				<Route path="/category/:id/:page" element={<CategoryPage />} />
				<Route path="/category/:category/post/:id" element={<PostPage />} />
				<Route path="/category/:category/post/:id/:page" element={<PostPage />} />
			</Routes>
		</>
	)
}

export default App
