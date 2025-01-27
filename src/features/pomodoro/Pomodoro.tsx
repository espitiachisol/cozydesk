import { useCallback, useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hook';
import Window from '../../components/Window/Window';
import { SYSTEM_WINDOW_POMODORO } from '../window/constants';
import {
	bringToFront,
	closeWindowAsync,
	getWindowById,
	moveWindow,
	resizeWindow,
} from '../window/windowSlice';
import IconClockHand from '../../assets/icons/icon-clock-hand.svg?react';
import IconClockFace from '../../assets/icons/icon-clock-face.svg?react';

import styles from './Pomodoro.module.css';
import { addToast, ToastMessageKey } from '../toaster/toasterSlice';
import HoldButton from './HoldButton';

const formatSecondsToMMSS = (seconds: number): string => {
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = seconds % 60;

	// Pad minutes and seconds with leading zeros if necessary
	const paddedMinutes = String(minutes).padStart(2, '0');
	const paddedSeconds = String(remainingSeconds).padStart(2, '0');

	return `${paddedMinutes}:${paddedSeconds}`;
};

type PomodoroProps = {
	containerRef?: React.MutableRefObject<HTMLElement | null>;
};

type WheelRef = SVGSVGElement | null;
type AudioRef = HTMLAudioElement | null;

enum Session {
	Focus = 'Focus',
	Break = 'Break',
}

interface ClockFaceStyle extends React.CSSProperties {
	'--progress': string;
	'--fill': string;
	'--bg': string;
}

// Convert radians to degrees
const calculateAngle = (
	x: number,
	y: number,
	centerX: number,
	centerY: number
) => {
	const dx = x - centerX;
	const dy = y - centerY;
	return Math.atan2(dy, dx) * (180 / Math.PI);
};

export default function Pomodoro({ containerRef }: PomodoroProps) {
	const dispatch = useAppDispatch();
	const window = useAppSelector(getWindowById(SYSTEM_WINDOW_POMODORO));

	const [focusDuration, setFocusDuration] = useState(25);
	const [breakDuration, setBreakDuration] = useState(5);
	const [currentSession, setCurrentSession] = useState<Session>(Session.Focus);

	const sessionEndSoundRef = useRef<AudioRef>(null);
	const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

	const [timeLeft, setTimeLeft] = useState(focusDuration * 60);

	const [angle, setAngle] = useState(0);
	const [isDragging, setIsDragging] = useState(false);

	const [canSetTimer, setCanSetTimer] = useState(false);

	const wheelRef = useRef<WheelRef>(null);
	const dragStartAngle = useRef(0);
	const dragStartRotation = useRef(0);

	const handleMouseDown = (e: React.MouseEvent) => {
		e.stopPropagation();

		if (intervalId !== null) return;

		if (!e.metaKey && !e.ctrlKey) {
			dispatch(
				addToast({
					id: ToastMessageKey.POMODORO_SET_TIMER_TIP,
					messageKey: ToastMessageKey.POMODORO_SET_TIMER_TIP,
					type: 'info',
				})
			);
			return;
		}
		if (!canSetTimer) return;
		if (!wheelRef.current) return;
		const rect = wheelRef.current.getBoundingClientRect();
		const centerX = rect.left + rect.width / 2;
		const centerY = rect.top + rect.height / 2;

		const startAngle = calculateAngle(e.clientX, e.clientY, centerX, centerY);
		dragStartAngle.current = startAngle;
		dragStartRotation.current = angle;
		setIsDragging(true);
	};

	const handleMouseMove = useCallback(
		(e: MouseEvent) => {
			e.stopPropagation();
			if (!isDragging) return;
			if (!wheelRef.current) return;
			if (!canSetTimer) return;

			const rect = wheelRef.current.getBoundingClientRect();
			const centerX = rect.left + rect.width / 2;
			const centerY = rect.top + rect.height / 2;

			const currentAngle = calculateAngle(
				e.clientX,
				e.clientY,
				centerX,
				centerY
			);
			const angleDiff = currentAngle - dragStartAngle.current;

			const newAngle = (dragStartRotation.current + angleDiff + 360) % 360;
			setAngle(newAngle);
		},
		[isDragging, canSetTimer]
	);

	const handleMouseUp = useCallback(
		(e: MouseEvent) => {
			e.stopPropagation();

			// 5, 10, 15,..., 60
			const allowedMinutes = Array.from(
				{ length: 12 },
				(_, index) => (index + 1) * 5
			);
			const allowedAngles = allowedMinutes.map((minute) => minute * 6);

			const snappedAngle = allowedAngles.reduce((prev, curr) =>
				Math.abs(curr - angle) < Math.abs(prev - angle) ? curr : prev
			);

			setAngle(snappedAngle);
			const minutes = snappedAngle / 6;
			currentSession === Session.Focus
				? setFocusDuration(minutes)
				: setBreakDuration(minutes);
			setTimeLeft(minutes * 60);
			setIsDragging(false);
		},
		[angle, currentSession]
	);

	const clearIntervalId = useCallback(() => {
		if (!intervalId) return;
		clearInterval(intervalId);
		setIntervalId(null);
	}, [intervalId]);

	const handleStopFocus = useCallback(() => {
		clearIntervalId();
		setTimeLeft(focusDuration * 60);
	}, [clearIntervalId, focusDuration]);

	const handleStopBreak = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation();
		clearIntervalId();
		setCurrentSession(Session.Focus);
		setTimeLeft(focusDuration * 60);
	};

	useEffect(() => {
		if (intervalId !== null) return;
		const handleKeyDown = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.altKey) {
				setCanSetTimer(true);
			}
		};

		const handleKeyUp = (e: KeyboardEvent) => {
			if (e.metaKey || e.ctrlKey || e.altKey) {
				setCanSetTimer(false);
			}
		};

		document.addEventListener('keydown', handleKeyDown);
		document.addEventListener('keyup', handleKeyUp);

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
			document.removeEventListener('keyup', handleKeyUp);
		};
	}, [intervalId]);

	useEffect(() => {
		if (isDragging) {
			document.addEventListener('mousemove', handleMouseMove);
			document.addEventListener('mouseup', handleMouseUp);
		}

		return () => {
			document.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('mouseup', handleMouseUp);
		};
	}, [isDragging, handleMouseUp, handleMouseMove]);

	useEffect(() => {
		if (timeLeft !== 0) return;
		if (currentSession === Session.Focus) {
			setCurrentSession(Session.Break);
			setTimeLeft(breakDuration * 60);
		} else {
			setCurrentSession(Session.Focus);
			setTimeLeft(focusDuration * 60);
		}
		void sessionEndSoundRef.current?.play();
		clearIntervalId();
	}, [
		clearIntervalId,
		timeLeft,
		currentSession,
		breakDuration,
		focusDuration,
		intervalId,
	]);

	const handleStartTimer = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation();
		const newIntervalId = setInterval(() => {
			setTimeLeft((seconds) => seconds - 1);
		}, 1000);
		setIntervalId(newIntervalId);
	};

	const handleResize = (size: { width: number; height: number }) => {
		void dispatch(resizeWindow({ id: SYSTEM_WINDOW_POMODORO, size }));
	};

	const handleMove = (position: { x: number; y: number }) => {
		void dispatch(moveWindow({ id: SYSTEM_WINDOW_POMODORO, position }));
	};

	const handleBringToFront = () => {
		dispatch(bringToFront({ id: SYSTEM_WINDOW_POMODORO }));
	};

	const handleClose = () => {
		void dispatch(closeWindowAsync({ id: SYSTEM_WINDOW_POMODORO }));
	};

	if (!window) return null;
	const isTimerRunning = intervalId !== null;
	const minutes = angle / 6;
	const totalTime = 60 * 60;
	const progress = isDragging
		? ((minutes * 60) / totalTime) * 100
		: (timeLeft / totalTime) * 100;
	const rotate = isDragging ? angle : (timeLeft / totalTime) * 360;

	return (
		<Window
			containerRef={containerRef}
			className={styles.pomodoro}
			position={window.position}
			size={window.size}
			zIndex={window.zIndex}
			onResize={handleResize}
			onMove={handleMove}
			onBringToFront={handleBringToFront}
			onClose={handleClose}
			isResizable={false}
		>
			<Window.DragArea className={styles.clock}>
				<p className={styles.digitTime}>{formatSecondsToMMSS(timeLeft)}</p>
				<IconClockFace
					className={`${styles.clockFace}`}
					style={
						{
							'--progress': `${progress}%`,
							'--fill': `${currentSession === Session.Focus ? 'var(--color-focus)' : 'var(--color-break)'}`,
							'--bg': `${currentSession === Session.Focus ? 'var(--color-light-focus)' : 'var(--color-light-break)'}`,
						} as ClockFaceStyle
					}
				/>
				<IconClockHand
					onMouseDown={handleMouseDown}
					ref={wheelRef}
					className={`${styles.clockHand} ${canSetTimer ? styles.clockHandFocus : ''}`}
					style={{
						transform: `rotate(${rotate}deg)`,
					}}
				/>

				{isTimerRunning &&
					(currentSession === Session.Focus ? (
						<HoldButton
							className={styles.pomodoroButton}
							onHoldComplete={handleStopFocus}
						>
							Hold to Stop Focus
						</HoldButton>
					) : (
						<button className={styles.pomodoroButton} onClick={handleStopBreak}>
							Stop Break
						</button>
					))}

				{!isTimerRunning && (
					<button className={styles.pomodoroButton} onClick={handleStartTimer}>
						{currentSession === Session.Focus ? 'Start Focus' : 'Start break'}
					</button>
				)}
			</Window.DragArea>
			<audio
				ref={sessionEndSoundRef}
				src="/audioEffects/pomodoro_session_end.mp3"
			/>
		</Window>
	);
}
