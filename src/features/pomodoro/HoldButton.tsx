import { memo, useEffect, useRef, useState } from 'react';

interface HoldButtonProps {
	children: React.ReactNode;
	onHoldComplete: () => void;
	className?: string;
	holdDuration?: number;
}

const HoldButton = memo(
	({
		children,
		onHoldComplete,
		className,
		holdDuration = 2000,
	}: HoldButtonProps) => {
		const [progress, setProgress] = useState<number>(0);
		const intervalRef = useRef<NodeJS.Timeout | null>(null);
		const timeoutRef = useRef<NodeJS.Timeout | null>(null);

		const handleHoldStart = (e: React.MouseEvent<HTMLButtonElement>) => {
			e.stopPropagation();

			let progressValue = 0;
			const updateInterval = 20;
			intervalRef.current = setInterval(() => {
				progressValue += 1;
				setProgress(progressValue / 100);
			}, updateInterval);

			timeoutRef.current = setTimeout(() => {
				if (intervalRef.current) {
					clearInterval(intervalRef.current);
				}
				setProgress(0);
				onHoldComplete();
			}, holdDuration);
		};

		const handleHoldCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
			e.stopPropagation();
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
			setProgress(0);
		};

		useEffect(() => {
			return () => {
				if (intervalRef.current) clearInterval(intervalRef.current);
				if (timeoutRef.current) clearTimeout(timeoutRef.current);
			};
		}, []);

		return (
			<button
				style={{
					background: `linear-gradient(to right, var(--color-dark--1) ${progress * 100}%, var(--color-grey--100) ${progress * 100}%)`,
				}}
				className={className}
				onMouseDown={handleHoldStart}
				onMouseUp={handleHoldCancel}
				onMouseLeave={handleHoldCancel}
			>
				{children}
			</button>
		);
	}
);

HoldButton.displayName = 'HoldButton';

export default HoldButton;
