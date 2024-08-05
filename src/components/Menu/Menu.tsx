import {
	createContext,
	PropsWithChildren,
	useContext,
	useEffect,
	useRef,
	useState,
} from 'react';
import styles from './Menu.module.css';

interface Position {
	x: number;
	y: number;
}

type MenuContextType = {
	openId: string;
	close: () => void;
	open: (id: string) => void;
	position: Position | null;
	setPosition: (position: Position) => void;
};

const MenuContext = createContext<MenuContextType | null>(null);

function useMenu() {
	const context = useContext(MenuContext);
	if (context === undefined)
		throw new Error('MenuContext was used outside the MenuProvider');
	return context;
}

function Menu({ children }: PropsWithChildren) {
	const [openId, setOpenId] = useState('');
	const [position, setPosition] = useState<Position | null>(null);
	const close = () => setOpenId('');
	const open = setOpenId;

	return (
		<MenuContext.Provider
			value={{ openId, close, open, position, setPosition }}
		>
			{children}
		</MenuContext.Provider>
	);
}
type ToggleProps = PropsWithChildren<{
	id: string;
}>;
function Toggle({ id, children }: ToggleProps) {
	const context = useMenu();
	if (!context) {
		throw new Error('Toggle must be used within a Menu');
	}
	const { openId, close, open, setPosition } = context;

	function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
		e.stopPropagation();
		const closetButton = e.currentTarget.closest('button');
		if (!closetButton) return;
		const rect = closetButton.getBoundingClientRect();
		setPosition({
			x: rect.x,
			y: rect.y + rect.height + 8,
		});
		openId === '' || openId !== id ? open(id) : close();
	}

	function handleMouseEnter(e: React.MouseEvent<HTMLButtonElement>) {
		if (!openId || e.currentTarget.id === openId) return;
		const closetButton = e.currentTarget.closest('button');
		if (!closetButton) return;
		const rect = closetButton.getBoundingClientRect();
		setPosition({
			x: rect.x,
			y: rect.y + rect.height + 8,
		});
		open(e.currentTarget.id);
	}
	return (
		<button
			id={id}
			className={styles.toggleButton}
			onMouseEnter={handleMouseEnter}
			onClick={handleClick}
		>
			{children}
		</button>
	);
}
type ListProps = PropsWithChildren<{
	id: string;
}>;

function List({ id, children }: ListProps) {
	const context = useMenu();
	if (!context) {
		throw new Error('List must be used within a Menu');
	}
	const { openId, position, close } = context;
	const ref = useRef<HTMLMenuElement | null>(null);

	useEffect(() => {
		function handleClick(e: MouseEvent) {
			if (ref.current && !ref.current.contains(e.target as Node)) {
				close();
			}
		}
		document.addEventListener('click', handleClick);
		return () => document.removeEventListener('click', handleClick);
	}, [close]);

	if (id !== openId) return null;
	return (
		<menu
			ref={ref}
			className={styles.menu}
			style={{ left: position?.x, top: position?.y }}
		>
			{children}
		</menu>
	);
}

type ButtonProps = PropsWithChildren<{
	onClick: () => void;
}>;
function Button({ children, onClick }: ButtonProps) {
	const context = useMenu();
	if (!context) {
		throw new Error('Toggle must be used within a Menu');
	}
	const { close } = context;
	function handleClick() {
		onClick();
		close();
	}
	return (
		<li>
			<button onClick={handleClick}>{children}</button>
		</li>
	);
}
Menu.Toggle = Toggle;
Menu.List = List;
Menu.Button = Button;

export default Menu;
