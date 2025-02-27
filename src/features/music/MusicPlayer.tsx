import { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hook';
import {
	playNextSong,
	playPreviousSong,
	playSong,
	selectCurrentSong,
} from './musicSlice';
import Window from '../../components/Window/Window';
import CassetteTape from './CassetteTape';
import { formatTime } from '../../utils/time';
import IconPre from '../../assets/icons/icon-pre.svg?react';
import IconStop from '../../assets/icons/icon-stop.svg?react';
import IconPlay from '../../assets/icons/icon-play.svg?react';
import IconNext from '../../assets/icons/icon-next.svg?react';
import IconLoop from '../../assets/icons/icon-loop.svg?react';
import IconFolder from '../../assets/icons/icon-folder.svg?react';
import IconMute from '../../assets/icons/icon-mute.svg?react';
import IconSound from '../../assets/icons/icon-sound.svg?react';
import styles from './MusicPlayer.module.css';
import {
	bringToFront,
	closeWindowAsync,
	getWindowById,
	moveWindow,
	openWindowAsync,
	resizeWindow,
} from '../window/windowSlice';
import {
	SYSTEM_WINDOW_FOLDER,
	SYSTEM_WINDOW_MUSIC_PLAYER,
} from '../window/constants';
import { isValidDragData } from './type';

type MusicPlayerProps = {
	containerRef?: React.MutableRefObject<HTMLElement | null>;
};

export default function MusicPlayer({ containerRef }: MusicPlayerProps) {
	const id = SYSTEM_WINDOW_MUSIC_PLAYER;
	const dispatch = useAppDispatch();
	const currentSong = useAppSelector(selectCurrentSong);
	const window = useAppSelector(getWindowById(id));
	const control = useRef<HTMLAudioElement>(null);

	const [progress, setProgress] = useState(0);
	const [duration, setDuration] = useState(0);
	const [loopOneSong, setLoopOneSong] = useState(false);
	const [isPlaying, setIsPlaying] = useState(false);
	const [volume, setVolume] = useState(1);

	// Automatically play the new song when switching tracks, if the player is currently playing.
	useEffect(() => {
		if (!isPlaying || !control.current) return;
		void control.current.play();
	}, [currentSong, isPlaying]);

	useEffect(() => {
		if (!control.current) return;
		control.current.volume = volume;
	}, [volume]);

	if (!window) return null;

	function handlePlaySong() {
		if (!control.current) return;
		setIsPlaying(true);
		void control.current.play();
	}

	function handleStopSong() {
		if (!control.current) return;
		setIsPlaying(false);
		control.current.pause();
	}

	function handlePreviousSong() {
		dispatch(playPreviousSong());
	}

	function handleNextSong() {
		dispatch(playNextSong());
	}

	function handleLoopSong() {
		setLoopOneSong((pre) => !pre);
	}

	const handleProgress = (e: React.MouseEvent<HTMLProgressElement>) => {
		if (!(control.current && duration && e.target)) return;
		const target = e.target as HTMLProgressElement;
		const currentTime =
			(e.nativeEvent.offsetX / target.getBoundingClientRect().width) * duration;
		setProgress(currentTime);
		control.current.currentTime = currentTime;
	};

	// Window control
	const handleResize = (size: { width: number; height: number }) => {
		void dispatch(resizeWindow({ id, size }));
	};

	const handleMove = (position: { x: number; y: number }) => {
		void dispatch(moveWindow({ id, position }));
	};

	const handleBringToFront = () => {
		dispatch(bringToFront({ id }));
	};

	const handleClose = () => {
		void dispatch(closeWindowAsync({ id }));
	};

	// Drop actions
	const handleDragOver = (e: React.DragEvent<HTMLElement>) => {
		e.preventDefault();
		e.dataTransfer.dropEffect = 'copy';
	};

	const handleDrop = (e: React.DragEvent<HTMLElement>) => {
		e.preventDefault();
		const data = e.dataTransfer.getData('text/plain');
		try {
			const parsedData = JSON.parse(data) as unknown;
			if (isValidDragData(parsedData)) {
				dispatch(
					playSong({
						playlistType: parsedData.playlistType,
						songId: parsedData.songId,
					})
				);
			} else {
				console.error('Invalid drag data format');
			}
		} catch (error) {
			console.error('Invalid drag data', error);
		}
	};

	return (
		<Window
			containerRef={containerRef}
			className={styles.musicPlayer}
			position={window.position}
			size={window.size}
			zIndex={window.zIndex}
			onResize={handleResize}
			onMove={handleMove}
			onBringToFront={handleBringToFront}
			onClose={handleClose}
			isResizable={false}
			onDragOver={handleDragOver}
			onDrop={handleDrop}
		>
			<section className={styles.musicControlSection}>
				<audio
					ref={control}
					src={currentSong?.downloadURL}
					onCanPlay={(e) => {
						const { currentTime, duration } = e.target as HTMLAudioElement;
						setProgress(currentTime);
						setDuration(duration);
					}}
					onEnded={() => {
						if (loopOneSong && control.current) {
							control.current.load();
							void control.current.play();
						} else {
							handleNextSong();
						}
					}}
					onTimeUpdate={(e) => {
						const { currentTime, duration } = e.target as HTMLAudioElement;
						if (!duration) return;
						setProgress(currentTime);
						setDuration(duration);
					}}
				/>
				<section className={styles.progress}>
					<progress onClick={handleProgress} value={progress} max={duration} />
					<time dateTime={formatTime(progress, 'Hh Mm Ss')}>
						{formatTime(progress, 'HH:MM:SS')}
					</time>
					<time dateTime={formatTime(duration, 'Hh Mm Ss')}>
						{formatTime(duration, 'HH:MM:SS')}
					</time>
				</section>
				<article className={styles.songDetail}>
					<h1>{currentSong?.name}</h1>
				</article>
				<fieldset className={styles.actionButtons}>
					<button onClick={handlePreviousSong}>
						<IconPre />
					</button>
					{isPlaying && (
						<button onClick={handleStopSong}>
							<IconStop />
						</button>
					)}
					{!isPlaying && (
						<button onClick={handlePlaySong}>
							<IconPlay />
						</button>
					)}
					<button onClick={handleNextSong}>
						<IconNext />
					</button>
					<button
						onClick={handleLoopSong}
						className={loopOneSong ? styles.active : ''}
					>
						<IconLoop />
					</button>
					<button
						onClick={() => {
							void dispatch(openWindowAsync({ id: SYSTEM_WINDOW_FOLDER }));
						}}
					>
						<IconFolder />
					</button>
				</fieldset>
				{volume === 0 && <IconMute className={styles.volumeImage} />}
				{volume !== 0 && <IconSound className={styles.volumeImage} />}
				<input
					className={styles.volumeSlider}
					type="range"
					min="0"
					max="100"
					step="5"
					value={volume * 100}
					onChange={(e) => {
						setVolume(parseInt(e.target.value, 10) * 0.01);
					}}
				/>
			</section>
			<Window.DragArea>
				<CassetteTape
					isPlaying={isPlaying}
					progress={(progress * 100) / duration}
					image={currentSong?.imageURL}
				/>
			</Window.DragArea>
		</Window>
	);
}
