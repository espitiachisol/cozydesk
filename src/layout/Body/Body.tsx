import { useEffect, useRef, useState } from 'react';
import styles from './Body.module.css';
import { MusicPlayer } from '../../features/MusicPlayer/MusicPlayer';

const Draggable = ({ children, containerRef }) => {
	const drag = useRef(null);
	const [isDragging, setIsDragging] = useState(false);
	const [position, setPosition] = useState({ x: 200, y: 200 });
	const [mouseOffsetWithinDragElement, setMouseOffsetWithinDragElement] = useState({ x: 0, y: 0 });
	useEffect(() => {
		function handleMouseUp() {
			setIsDragging(false);
			setMouseOffsetWithinDragElement({ x: 0, y: 0 });
		}
		document.addEventListener('mouseup', handleMouseUp);
		return () => {
			document.removeEventListener('mouseup', handleMouseUp);
		};
	}, []);

	function handleMouseDown(e) {
		setIsDragging(true);
		const { clientX, clientY } = e;
		const dragClientRect = drag.current.getBoundingClientRect();
		setMouseOffsetWithinDragElement({
			x: clientX - dragClientRect.x,
			y: clientY - dragClientRect.y
		});
	}
	function handleMouseMove(e) {
		if (!isDragging) return;
		const { clientX, clientY } = e;
		const containerNode = containerRef.current;
		let newX = clientX - mouseOffsetWithinDragElement.x;
		let newY = clientY - mouseOffsetWithinDragElement.y;
		if (containerNode) {
			const dragClientRect = drag.current.getBoundingClientRect();
			const containerClientRect = containerNode.getBoundingClientRect();
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

	return (
		<div
			ref={drag}
			onMouseDown={handleMouseDown}
			onMouseMove={handleMouseMove}
			style={{ position: 'absolute', left: `${position.x}px`, top: `${position.y}px` }}>
			{children}
		</div>
	);
};
function Body() {
	const containerRef = useRef<HTMLElement | null>(null);
	return (
		<main className={styles.AppBody} ref={containerRef}>
			{/* <Draggable containerRef={containerRef}>
				<div style={{ width: '100px', height: '100px', backgroundColor: 'red' }}> item 1</div>
			</Draggable> */}
			<MusicPlayer containerRef={containerRef}/>
		</main>
	);
}
export default Body;
