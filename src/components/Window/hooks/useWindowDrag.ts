import { useState, useEffect, useCallback, useRef } from 'react';

interface UseWindowDragProps {
	windowRef: React.RefObject<HTMLElement>;
	containerRef?: React.RefObject<HTMLElement>;
	onMove: (position: { x: number; y: number }) => void;
}
export type DragStartHandler = (e: React.MouseEvent<HTMLElement>) => void;

interface UseWindowDragReturn {
	isDragging: boolean;
	handleDragStart: DragStartHandler;
}

interface MouseOffset {
	x: number;
	y: number;
}

export function useWindowDrag({
	windowRef,
	containerRef,
	onMove,
}: UseWindowDragProps): UseWindowDragReturn {
	const [isDragging, setIsDragging] = useState(false);
	const [mouseOffset, setMouseOffset] = useState<MouseOffset>({ x: 0, y: 0 });
	const lastPositionRef = useRef<{ x: number; y: number }>({ x: -1, y: -1 });

	const handleMouseMove = useCallback(
		(e: MouseEvent) => {
			if (!isDragging || !windowRef.current) return;

			const { clientX, clientY } = e;
			let newX = clientX - mouseOffset.x;
			let newY = clientY - mouseOffset.y;

			if (containerRef?.current) {
				const dragClientRect = windowRef.current.getBoundingClientRect();
				const containerClientRect =
					containerRef.current.getBoundingClientRect();
				newX = Math.max(
					containerClientRect.left,
					Math.min(newX, containerClientRect.right - dragClientRect.width)
				);
				newY = Math.max(
					containerClientRect.top,
					Math.min(newY, containerClientRect.bottom - dragClientRect.height)
				);
			}

			windowRef.current.style.left = `${newX}px`;
			windowRef.current.style.top = `${newY}px`;
		},
		[isDragging, mouseOffset, windowRef, containerRef]
	);

	const handleMouseUp = useCallback(() => {
		if (!isDragging || !windowRef.current) return;
		setIsDragging(false);

		const newX = parseFloat(windowRef.current.style.left);
		const newY = parseFloat(windowRef.current.style.top);

		if (
			newX !== lastPositionRef.current.x ||
			newY !== lastPositionRef.current.y
		) {
			onMove({ x: newX, y: newY });
			lastPositionRef.current = { x: newX, y: newY };
		}
	}, [isDragging, windowRef, onMove]);

	useEffect(() => {
		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mouseup', handleMouseUp);
		return () => {
			document.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('mouseup', handleMouseUp);
		};
	}, [handleMouseMove, handleMouseUp]);

	const handleDragStart = (e: React.MouseEvent<HTMLElement>) => {
		if (!windowRef.current) return;
		setIsDragging(true);
		const { clientX, clientY } = e;
		const rect = windowRef.current.getBoundingClientRect();
		setMouseOffset({
			x: clientX - rect.left,
			y: clientY - rect.top,
		});
		// Initialize lastPosition when dragging starts
		lastPositionRef.current = { x: rect.left, y: rect.top };
	};

	return { isDragging, handleDragStart };
}
