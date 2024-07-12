import { useAppDispatch, useAppSelector } from '../../app/hook';
import styles from  './Toaster.module.css';
import { removeToast, selectToastById } from './toasterSlice';

export default function Toast({ id }) {
  const dispatch = useAppDispatch()
  const toast = useAppSelector(selectToastById(id));
  
  if(!toast) return null;
  return (
    <section className={`${styles.toast} ${styles[toast.type]}`}>
    <p>{toast.message}</p>
    <button onClick={() => dispatch(removeToast(toast.id))}>x</button>
  </section>
  )
}
