import { createContext, useContext, useRef, useState, useEffect, PropsWithChildren } from 'react';
import styles from './Window.module.css';
import { closeWindow, getWindowById, moveWindow } from './windowSlice';
import { useAppDispatch, useAppSelector } from '../../app/hook';
interface WindowContextType {
	handleMouseDown: (e: React.MouseEvent) => void;
	id: string;
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
	containerRef?: React.MutableRefObject<HTMLElement | null>;
	id: string;
}>;

function Window({ id, children, containerRef }: WindowProps) {
	const dragRef = useRef<HTMLElement>(null);
	const [isDragging, setIsDragging] = useState(false);
	const dispatch = useAppDispatch()
	const window = useAppSelector(getWindowById(id))
	// const [position, setPosition] = useState<Position>(window.position);

	useEffect(()=>{
		if(!dragRef.current || !window) return;
		const { x, y } = window. position
		dragRef.current.style.left = `${x}px`;
		dragRef.current.style.top = `${y}px`;
	},[window])

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
			dragRef.current.style.left = `${newX}px`;
      dragRef.current.style.top = `${newY}px`;
			// setPosition({ x: newX, y: newY });
		}
		document.addEventListener('mousemove', handleMouseMove);

		return () => {
			document.removeEventListener('mousemove', handleMouseMove);
		};
	}, [isDragging, mouseOffsetWithinDragElement, containerRef]);

	useEffect(() => {
		function handleMouseUp() {
			if(!dragRef.current) return;
			setIsDragging(false);

			dispatch(moveWindow({ id, position:{
				x: parseFloat(dragRef.current.style.left),
				y: parseFloat(dragRef.current.style.top),
			}}))
		}
		document.addEventListener('mouseup', handleMouseUp);
		return () => {
			document.removeEventListener('mouseup', handleMouseUp);
		};
	},[id, dispatch])
	

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
		<WindowContext.Provider value={{ handleMouseDown, id }}>
			<article ref={dragRef} style={{ position: 'absolute' }}>
				{children}
			</article>
		</WindowContext.Provider>
	);
}

function Header({ children }: PropsWithChildren) {
	const { handleMouseDown, id } = useWindow();
	const dispatch = useAppDispatch()
	const handleButtonMouseDown = (e: React.MouseEvent<Element, MouseEvent>) => {
		e.stopPropagation();
		dispatch(closeWindow({id}))
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
