
import { useCallback, useEffect, useRef, useState } from 'react';
import Window from '../Window/Window';
import CassetteTape from './CassetteTape';
import { systemMusics } from '../../data/music';
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

type MusicPlayerProps = {
	containerRef?: React.MutableRefObject<HTMLElement | null>
}

export default function MusicPlayer({ containerRef }: MusicPlayerProps) {
	const control = useRef<HTMLAudioElement>(null);
	const [progress, setProgress] = useState(0);
	const [duration, setDuration] = useState(0);
	const [songs, setSongs] = useState(systemMusics);
	const [songIndex, setSongIndex] = useState(0);
	const [loopOneSong, setLoopOneSong] = useState(false);
	const [isPlaying, setIsPlaying] = useState(false);
	const [volume, setVolume] = useState(1);

	useEffect(() => {
		if (!(isPlaying && songs.length > 0 && control.current)) return;
		setIsPlaying(true);
		control.current.play();
	}, [songIndex, isPlaying, songs]);

	useEffect(() => {
		if(!control.current) return;
		control.current.volume = volume;
	}, [volume]);

	const handlePlaySong = useCallback(() => {
		if(!control.current) return;
		// control.current.load();
		setIsPlaying(true);
		control.current.play();
	}, []);
	const handleStopSong = useCallback(() => {
		if(!control.current) return;
		setIsPlaying(false);
		control.current.pause();
	}, []);

	const handlePrevSong = useCallback(() => {
		songIndex === 0 ? setSongIndex(songs.length - 1) : setSongIndex(songIndex - 1);
	}, [songIndex, songs]);

	const handleNextSong = () => {
		// FIXME:當在播放後面的音樂，刪除前面的index的話會出錯誤，目前先以?.去做處理但會有問題！
		// 當歌單只有一首歌的時候setSongIndex(0)會沒有改變所以上面的useEffect不會被觸法
		if (songs.length === 1) {
			handlePlaySong();
		} else {
			songIndex === songs.length - 1 ? setSongIndex(0) : setSongIndex(songIndex + 1);
		}
	};

	const handleLoopSong = useCallback(() => {
		setLoopOneSong(!loopOneSong);
	}, [loopOneSong]);

	const handleProgress = (e: React.MouseEvent<HTMLProgressElement>) => {
		if(!(control.current && duration && e.target)) return;
		const target = e.target as HTMLProgressElement;
		const currentTime = (e.nativeEvent.offsetX / target.getBoundingClientRect().width) * duration;
		setProgress(currentTime);
		control.current.currentTime = currentTime;
	};

	return (
		<Window containerRef={containerRef} id="musicPlayer">
			<Window.Header>
				<CassetteTape
					isPlaying={isPlaying}
					progress={(progress * 100) / duration}
					image={songs[songIndex].img}
				/>
			</Window.Header>
			<section className={styles.musicPlayer}>
				<audio
					ref={control}
					src={songs[songIndex]?.src}
					onCanPlay={(e) => {
						const { currentTime, duration } = e.target as HTMLAudioElement;
						setProgress(currentTime);
						setDuration(duration)
					}}
					onTimeUpdate={(e) => {
						const { currentTime, duration } = e.target as HTMLAudioElement;
						if (currentTime === duration) {
							// 若有單曲循環的話
							if (loopOneSong && control.current) {
								control.current.load();
								handlePlaySong();
							} else {
								// 沒有自動播放下一首
								handleNextSong();
							}
						} else {
							setProgress(currentTime);
							setDuration(duration);
						}
					}}
				/>
				<section className={styles.progress}>
					<progress onClick={handleProgress} value={progress} max={duration} />
					<time dateTime={formatTime(progress, 'Hh Mm Ss')}>
						{formatTime(progress, 'HH:MM:SS')}
					</time>
					<time dateTime={formatTime(duration, 'Hh Mm Ss')}>{formatTime(duration, 'HH:MM:SS')}</time>
				</section>
				<article className={styles.songDetail}>
					<h1>{songs[songIndex]?.title}</h1>
				</article>
				<fieldset className={styles.actionButtons}>
					<button onClick={handlePrevSong}>
						<IconPre />
					</button>
					{isPlaying && (
						<button onClick={handleStopSong}>
							<IconStop/>
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
					<button onClick={handleLoopSong} className={loopOneSong ? styles.active : ''}>
						<IconLoop />
					</button>
					<button onClick={()=>{}} >
						<IconFolder />
					</button>
				</fieldset>
				{volume === 0 && (
					<IconMute className={styles.volumeImage} />
				)}
				{volume !== 0 && (
					<IconSound className={styles.volumeImage} />
				)}
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
		</Window>
	);
}
