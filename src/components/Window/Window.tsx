import { createContext, useContext, useRef, PropsWithChildren } from 'react';
import { useWindowDrag, DragStartHandler } from './hooks/useWindowDrag';
import { useWindowResize } from './hooks/useWindowResize';
import styles from './Window.module.css';

interface WindowContextType {
	handleDragStart: DragStartHandler;
}

const WindowContext = createContext<WindowContextType | null>(null);

function useWindow(): WindowContextType {
	const context = useContext(WindowContext);
	if (context === null)
		throw new Error('WindowContext was used outside the WindowProvider');
	return context;
}

type WindowProps = PropsWithChildren<{
	containerRef?: React.MutableRefObject<HTMLElement | null>;
	className?: string;
	isResizable?: boolean;
	position: { x: number; y: number };
	size: { width: number; height: number };
	zIndex: number;
	onResize: (size: { width: number; height: number }) => void;
	onMove: (position: { x: number; y: number }) => void;
	onBringToFront: () => void;
	onClose: () => void;
	onDragOver?: (e: React.DragEvent<HTMLElement>) => void;
	onDrop?: (e: React.DragEvent<HTMLElement>) => void;
}>;

function Window({
	children,
	className,
	containerRef,
	isResizable = true,
	position,
	size,
	zIndex,
	onResize,
	onMove,
	onBringToFront,
	onClose,
	onDragOver,
	onDrop,
}: WindowProps) {
	const windowRef = useRef<HTMLElement>(null);

	const { handleDragStart } = useWindowDrag({
		windowRef,
		containerRef,
		onMove,
	});

	const { handleResizeStart } = useWindowResize({
		windowRef,
		isResizable,
		containerRef,
		onResize,
	});

	const windowStyle: React.CSSProperties = {
		position: 'absolute',
		left: `${position.x}px`,
		top: `${position.y}px`,
		width: `${size.width}px`,
		height: `${size.height}px`,
		zIndex: zIndex,
	};

	function handleMouseDown(e: React.MouseEvent<Element, MouseEvent>) {
		e.stopPropagation();
		if (!windowRef.current) return;
		const target = e.currentTarget as HTMLElement;
		const rect = target.getBoundingClientRect();
		const isBottomRightCorner =
			e.clientX >= rect.right - 12 && e.clientY >= rect.bottom - 12;

		if (isBottomRightCorner && isResizable) {
			handleResizeStart(e as React.MouseEvent<HTMLElement>);
		}
		onBringToFront();
	}

	return (
		<WindowContext.Provider value={{ handleDragStart }}>
			<article
				className={`${styles.window} ${isResizable ? styles.resize : ''} ${className}`}
				ref={windowRef}
				onMouseDown={handleMouseDown}
				style={windowStyle}
				onDragOver={onDragOver}
				onDrop={onDrop}
			>
				<ul className={styles.actions}>
					<li>
						<button className={styles.cross} onClick={onClose}>
							x
						</button>
					</li>
				</ul>
				{children}
			</article>
		</WindowContext.Provider>
	);
}

type DragAreaProps = PropsWithChildren<{
	className?: string;
}>;

function DragArea({ children, className }: DragAreaProps) {
	const { handleDragStart } = useWindow();
	return (
		<section
			className={`${styles.dragArea} ${className}`}
			onMouseDown={handleDragStart}
		>
			{children}
		</section>
	);
}

Window.DragArea = DragArea;

export default Window;
