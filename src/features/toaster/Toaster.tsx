import { useAppSelector } from '../../app/hook';
import { selectToasterIds } from './toasterSlice';
import styles from './Toaster.module.css';
import Toast from './Toast';
export default function Toaster() {
	const toastIds = useAppSelector(selectToasterIds);

	return (
		<aside className={styles.toaster}>
			{toastIds.map((id) => (
				<Toast key={id} id={id} />
			))}
		</aside>
	);
}
