import {
	createContext,
	useState,
	useContext,
	useCallback,
	ReactNode,
	FC
} from 'react';

type NotificationType = 'info' | 'success' | 'error';

interface NotificationContextType {
	showNotification: (message: string, type?: NotificationType, duration?: number) => void;
}

interface NotificationProviderProps {
	children: ReactNode;
}

interface NotificationState {
	message: string;
	type: NotificationType;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: FC<NotificationProviderProps> = ({ children }) => {
const [notification, setNotification] = useState<NotificationState | null>(null);
const [isVisible, setIsVisible] = useState<boolean>(false);
const [hideTimer, setHideTimer] = useState<number | null>(null);

const showNotification = useCallback(
	(message: string, type: NotificationType = 'info', duration = 3000) => {
		if (hideTimer !== null) {
			clearTimeout(hideTimer);
		}

		setNotification({ message, type });
		setIsVisible(true);

		const timer = window.setTimeout(() => {
		setIsVisible(false);
		}, duration);

		setHideTimer(timer);
	},
	[hideTimer]
);

const getNotificationClass = (): string => {
	if (!notification) return 'notification-wrapper';
	return `notification-wrapper ${notification.type} ${isVisible ? 'visible' : ''}`;
};

return (
	<NotificationContext.Provider value={{ showNotification }}>
		{children}
		{notification && (
			<div className={getNotificationClass()}>
			{notification.message}
			</div>
		)}
	</NotificationContext.Provider>
	);
};

export const useNotification = (): NotificationContextType['showNotification'] => {
	const context = useContext(NotificationContext);
	if (!context) {
		throw new Error('useNotification must be used within a NotificationProvider');
	}
	return context.showNotification;
};
