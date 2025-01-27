import { useAppDispatch } from '../../../app/hook';
import { addToast } from '../../../features/toaster/toasterSlice';
import {
	SYSTEM_WINDOW_FOLDER,
	SYSTEM_WINDOW_MUSIC_PLAYER,
	SYSTEM_WINDOW_POMODORO,
} from '../../../features/window/constants';
import { openWindowAsync } from '../../../features/window/windowSlice';
import styles from './Dock.module.css';

interface DockButtonProps {
	icon: string;
	tooltip: string;
	onClick: () => void;
}

const DockButton = ({ icon, tooltip, onClick }: DockButtonProps) => (
	<button className={styles.dockButton} onClick={onClick}>
		<img
			src={icon}
			className={styles.dockIcon}
			draggable={false}
			alt={tooltip}
		/>
		<span className={styles.tooltip}>{tooltip}</span>
	</button>
);

export default function Dock() {
	const dispatch = useAppDispatch();

	const handleIncompleteFeature = () => {
		dispatch(
			addToast({
				message: 'The feature is not yet complete. Please stay tuned.',
				type: 'info',
			})
		);
	};
	const dockButtons: DockButtonProps[] = [
		{
			icon: '/icons/desktop-folder.png',
			tooltip: 'Folder',
			onClick: () =>
				void dispatch(openWindowAsync({ id: SYSTEM_WINDOW_FOLDER })),
		},
		{
			icon: '/icons/desktop-musicPlayer.png',
			tooltip: 'Music Player',
			onClick: () =>
				void dispatch(openWindowAsync({ id: SYSTEM_WINDOW_MUSIC_PLAYER })),
		},
		{
			icon: '/icons/desktop-quote.png',
			tooltip: 'Quote',
			onClick: handleIncompleteFeature,
		},
		{
			icon: '/icons/desktop-pomodoro.png',
			tooltip: 'Pomodoro',
			onClick: () =>
				void dispatch(openWindowAsync({ id: SYSTEM_WINDOW_POMODORO })),
		},
		{
			icon: '/icons/desktop-todo.png',
			tooltip: 'Todo',
			onClick: handleIncompleteFeature,
		},
	];

	return (
		<nav className={styles.dock}>
			{dockButtons.map((button, index) => (
				<DockButton key={index} {...button} />
			))}
		</nav>
	);
}
