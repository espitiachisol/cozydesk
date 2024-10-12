import { useState, useEffect, useCallback, useRef } from 'react';

interface UseWindowResizeProps {
	windowRef: React.RefObject<HTMLElement>;
	isResizable: boolean;
	containerRef?: React.RefObject<HTMLElement>;
	onResize: (size: { width: number; height: number }) => void;
}

const minWidth = 320;
const minHeight = 200;

interface MouseOffset {
	x: number;
	y: number;
}

interface UseWindowResizeReturn {
	isResizing: boolean;
	handleResizeStart: (e: React.MouseEvent<HTMLElement>) => void;
}

export function useWindowResize({
	windowRef,
	isResizable,
	containerRef,
	onResize,
}: UseWindowResizeProps): UseWindowResizeReturn {
	const [isResizing, setIsResizing] = useState(false);
	const [mouseOffset, setMouseOffset] = useState<MouseOffset>({ x: 0, y: 0 });
	const lastSizeRef = useRef<{ width: number; height: number }>({
		width: -1,
		height: -1,
	});

	const handleMouseMove = useCallback(
		(e: MouseEvent) => {
			if (!isResizing || !windowRef.current || !isResizable) return;
			const { clientX, clientY } = e;
			let newWidth = Math.max(
				clientX - windowRef.current.offsetLeft + mouseOffset.x,
				minWidth
			);
			let newHeight = Math.max(
				clientY - windowRef.current.offsetTop + mouseOffset.y,
				minHeight
			);

			if (containerRef?.current) {
				const containerClientRect =
					containerRef.current.getBoundingClientRect();
				newWidth = Math.min(
					newWidth,
					containerClientRect.right - windowRef.current.offsetLeft
				);
				newHeight = Math.min(
					newHeight,
					containerClientRect.bottom - windowRef.current.offsetTop
				);
			}

			windowRef.current.style.width = `${newWidth}px`;
			windowRef.current.style.height = `${newHeight}px`;
		},
		[isResizing, windowRef, isResizable, mouseOffset, containerRef]
	);

	const handleMouseUp = useCallback(() => {
		if (!isResizing || !windowRef.current) return;
		setIsResizing(false);

		const newWidth = parseFloat(windowRef.current.style.width);
		const newHeight = parseFloat(windowRef.current.style.height);

		if (
			newWidth !== lastSizeRef.current.width ||
			newHeight !== lastSizeRef.current.height
		) {
			onResize({ width: newWidth, height: newHeight });
			lastSizeRef.current = { width: newWidth, height: newHeight };
		}
	}, [isResizing, windowRef, onResize]);

	useEffect(() => {
		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mouseup', handleMouseUp);
		return () => {
			document.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('mouseup', handleMouseUp);
		};
	}, [handleMouseMove, handleMouseUp]);

	const handleResizeStart = (e: React.MouseEvent<HTMLElement>) => {
		if (!isResizable || !windowRef.current) return;
		setIsResizing(true);
		const { clientX, clientY } = e;
		const rect = windowRef.current.getBoundingClientRect();
		setMouseOffset({
			x: rect.right - clientX,
			y: rect.bottom - clientY,
		});
		// Initialize lastSize when resizing starts
		lastSizeRef.current = { width: rect.width, height: rect.height };
	};

	return { isResizing, handleResizeStart };
}
