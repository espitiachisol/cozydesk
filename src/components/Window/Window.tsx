import { createContext, useContext, useRef, useState, useEffect, PropsWithChildren } from 'react';
import styles from './Window.module.css';
interface WindowContextType {
	handleMouseDown: (e: React.MouseEvent) => void;
}
interface Position {
	x: number;
	y: number;
}
const WindowContext = createContext<WindowContextType | null>(null);

function useWindow(): WindowContextType {
	const context = useContext(WindowContext);
	if (context === null) throw new Error('WindowContext was used outside the WindowProvider');
	return context;
}
type WindowProps = PropsWithChildren<{
	containerRef?: React.MutableRefObject<HTMLElement | null>
}>;

function Window({ children, containerRef }: WindowProps) {
	const dragRef = useRef<HTMLElement>(null);
	const [isDragging, setIsDragging] = useState(false);
	const [position, setPosition] = useState<Position>({ x: 200, y: 200 });
	const [mouseOffsetWithinDragElement, setMouseOffsetWithinDragElement] = useState<Position>({ x: 0, y: 0 });
	useEffect(() => {
		function handleMouseMove(e: MouseEvent) {
			if (!isDragging || !dragRef.current) return;
			const { clientX, clientY } = e;
			let newX = clientX - mouseOffsetWithinDragElement.x;
			let newY = clientY - mouseOffsetWithinDragElement.y;
			if (containerRef?.current) {
				const dragClientRect = dragRef?.current.getBoundingClientRect();
				const containerClientRect = containerRef.current.getBoundingClientRect();
				if (newX < containerClientRect.left) {
					newX = containerClientRect.left;
				}
				if (newY < containerClientRect.top) {
					newY = containerClientRect.top;
				}
				if (newX + dragClientRect.width > containerClientRect.right) {
					newX = containerClientRect.right - dragClientRect.width;
				}
				if (newY + dragClientRect.height > containerClientRect.bottom) {
					newY = containerClientRect.bottom - dragClientRect.height;
				}
			}
			setPosition({ x: newX, y: newY });
		}

		function handleMouseUp() {
			setIsDragging(false);
		}
		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mouseup', handleMouseUp);

		return () => {
			document.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('mouseup', handleMouseUp);
		};
	}, [isDragging, mouseOffsetWithinDragElement, containerRef]);

	function handleMouseDown(e: React.MouseEvent<Element, MouseEvent>) {
		if (!dragRef.current) return;
		setIsDragging(true);
		const { clientX, clientY } = e;
		const dragClientRect = dragRef.current.getBoundingClientRect();
		setMouseOffsetWithinDragElement({
			x: clientX - dragClientRect.x,
			y: clientY - dragClientRect.y
		});
	}

	return (
		<WindowContext.Provider value={{ handleMouseDown }}>
			<article ref={dragRef} style={{ position: 'absolute', left: `${position.x}px`, top: `${position.y}px` }}>
				{children}
			</article>
		</WindowContext.Provider>
	);
}

function Header({ children }: PropsWithChildren) {
	const { handleMouseDown } = useWindow();
	const handleButtonMouseDown = (e: React.MouseEvent<Element, MouseEvent>) => {
		e.stopPropagation();
	};
	return (
		<header className={styles.header} onMouseDown={handleMouseDown}>
			<ul className={styles.actions}>

        <li>
					<button className={styles.cross} onMouseDown={handleButtonMouseDown}>x</button>
				</li>
				<li>
					<button className={styles.minus}>&minus;</button>
				</li>
			</ul>
			{children}
		</header>
	);
}

function Body({ children }: PropsWithChildren) {
	return <section>{children}</section>;
}

Window.Header = Header;
Window.Body = Body;

export default Window;
