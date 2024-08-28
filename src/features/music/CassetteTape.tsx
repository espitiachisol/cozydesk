import styles from './CassetteTape.module.css';

type CassetteTapeProps = {
	isPlaying: boolean;
	progress: number;
	image?: string;
};

export default function CassetteTape({
	isPlaying,
	progress,
	image,
}: CassetteTapeProps) {
	return (
		<figure
			className={`${styles.cassetteTape} ${isPlaying ? styles.playing : ''}`}
		>
			<svg viewBox="0 0 860 550" className={styles.tapeShell}>
				<path d="M799.87,32c-.43,0-.85,0-1.28,0H61.09c-.38,0-.75,0-1.12,0l-1.23.09A25.06,25.06,0,0,0,36.43,57.16V406.74H823.58V57.16A25,25,0,0,0,799.87,32ZM247.3,279c-26,0-47-21.34-47-47.68s21.05-47.67,47-47.67,47,21.35,47,47.67S273.27,279,247.3,279Zm363.19,0c-26,0-47-21.34-47-47.68s21-47.67,47-47.67,47,21.35,47,47.67S636.46,279,610.49,279Z" />
				<path
					className={styles.tapeCover}
					d="M839.27,0H20.72A20.87,20.87,0,0,0,0,21V529a20.87,20.87,0,0,0,20.72,21H839.27A20.88,20.88,0,0,0,860,529V21A20.88,20.88,0,0,0,839.27,0ZM823.58,406.74H36.26V57.16A25,25,0,0,1,58.74,32.1L60,32c.37,0,.74,0,1.12,0h737.5c.43,0,.85,0,1.28,0a25,25,0,0,1,23.71,25.15Z"
				/>
			</svg>
			<figure
				className={`${styles.reel} ${styles.left}`}
				style={{
					clipPath: `circle(${130 - progress * 0.8}px at center)`,
				}}
			/>
			<figure
				className={`${styles.reel} ${styles.right}`}
				style={{
					clipPath: `circle(${30 + progress * 0.8}px at center)`,
				}}
			/>

			<svg viewBox="0 0 860 550" className={styles.tapeCenterShell}>
				<path d="M610.49,169.71H247.3c-33.56,0-60.76,27.59-60.76,61.61s27.2,61.62,60.76,61.62H610.49c33.56,0,60.76-27.58,60.76-61.62S644.05,169.71,610.49,169.71ZM247.3,279c-26,0-47-21.34-47-47.68s21.05-47.67,47-47.67,47,21.35,47,47.67S273.27,279,247.3,279Zm281-16.93H331.66V199.4H528.34ZM610.49,279c-26,0-47-21.34-47-47.68s21-47.67,47-47.67,47,21.35,47,47.67S636.46,279,610.49,279Z" />
			</svg>
			<img
				draggable="false"
				className={styles.tapeCoverImage}
				src={image}
				alt="cover"
			/>

			<figcaption className={styles.cassetteTapeLabel}>
				<p>Music Player</p>
				<button> - CozyDesk -</button>
			</figcaption>
		</figure>
	);
}
