import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hook';
import styles from './Toaster.module.css';
import { dismissToast, removeToast, selectToastById } from './toasterSlice';
import Spinner from '../../assets/icons/icon-spinner.svg?react';

const toastIcons = {
	success: '✅',
	error: '⛔️',
	info: '💡',
	loading: <Spinner />
};

export default function Toast({ id }) {
	const dispatch = useAppDispatch();
	const toast = useAppSelector(selectToastById(id));
	useEffect(() => {
		if (toast) {
			if (toast.type === 'loading') return;
			const timer = setTimeout(() => {
				dispatch(dismissToast(toast.id));
				setTimeout(() => dispatch(removeToast(toast.id)), 300);
			}, toast.duration || 10000);

			return () => clearTimeout(timer);
		}
	}, [toast, dispatch]);

	if (!toast) return null;
	return (
		<section
			className={`${styles.toast} ${styles[toast.type]} ${
				toast.visible ? styles['toast-enter'] : styles['toast-exit']
			}`}>
			<i>{toastIcons[toast.type]}</i>
			<p>{toast.message}</p>
			{toast.showClose && (
				<button
					className={styles.close}
					onClick={() => {
						dispatch(dismissToast(toast.id));
						setTimeout(() => dispatch(removeToast(toast.id)), 300);
					}}>
					Close
				</button>
			)}
		</section>
	);
}
