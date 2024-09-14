import styles from './ErrorFallback.module.css';

export default function ErrorFallback() {
	return (
		<section className={styles.errorFallback}>
			<img src="/error-logo.svg" className={styles.errorIcon}></img>
			<h2 className={styles.errorFallbackTitle}>Oops! Something went wrong!</h2>
			<p className={styles.errorFallbackContent}>Please try again later.</p>
		</section>
	);
}
