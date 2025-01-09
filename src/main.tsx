import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { OverlayScrollbars } from "overlayscrollbars";
import 'overlayscrollbars/overlayscrollbars.css';
import { NotificationProvider } from './contexts/NotificationContext.tsx';
import { AuthProvider } from './contexts/AuthContext.tsx';
import { CategoryProvider } from './contexts/CategoryContext.tsx'
import { LoadingBarContainer } from "react-top-loading-bar";


const rootElement = document.getElementById("root");
const root = createRoot(rootElement!);
OverlayScrollbars(document.body, { scrollbars: { autoHide: "scroll" } });

root.render(
	<StrictMode>
    	<BrowserRouter>
			<CategoryProvider>
				<AuthProvider>
					<NotificationProvider>
						<LoadingBarContainer>
							<App />
						</LoadingBarContainer>
					</NotificationProvider>
				</AuthProvider>
			</CategoryProvider>
		</BrowserRouter>
  	</StrictMode>,
)
