import { useEffect, useState, MouseEvent, DragEvent } from 'react';
import Window from '../window/Window';
import styles from './Folder.module.css';
import Contextmenu from '../../components/Contextmenu/ContextMenu';
import { useAppDispatch } from '../../app/hook';
import { fetchUserPlaylist, uploadSong } from '../music/musicSlice';
import Playlist from './Playlist';
import { PlaylistType } from '../music/type';
import { SYSTEM_WINDOW_FOLDER } from '../window/constants';

type FolderProps = {
	containerRef?: React.MutableRefObject<HTMLElement | null>;
};
export default function Folder({ containerRef }: FolderProps) {
	const dispatch = useAppDispatch();
	const [tab, setTab] = useState<PlaylistType>('system');
	const [selectedItems, setSelectedItems] = useState<string[]>([]);
	const [canDrop, setCanDrop] = useState<'idle' | 'cannot' | 'can'>('idle');

	useEffect(() => {
		dispatch(fetchUserPlaylist());
	}, [dispatch]);

	function handleClickFile(e: MouseEvent<HTMLButtonElement>) {
		e.preventDefault();
		const selectId = e.currentTarget.id;
		if (e.metaKey) {
			setSelectedItems((selectedItems) =>
				selectedItems.includes(selectId) ? selectedItems.filter((id) => id !== selectId) : [...selectedItems, selectId]
			);
		} else if (e.shiftKey) {
			// setSelectedItems((selectedItems) => {
			// 	selectedItems.includes(selectId)?selectedItems.filter(id=>id!==selectId):[...selectedItems,selectId]
			// })
		} else {
			setSelectedItems((selectedItems) => (selectedItems.includes(selectId) ? [] : [selectId]));
		}
	}
	function handleClickContextMenu(e: MouseEvent<HTMLButtonElement>) {
		const selectId = e.currentTarget.id;
		setSelectedItems([selectId]);
	}

	function handleClick(e: MouseEvent<HTMLButtonElement>) {
		const tabId = e.currentTarget.id as PlaylistType;
		if (tab === tabId) return;
		setTab(tabId);
		setCanDrop('idle');
	}

	function handleDragOver(event: DragEvent<HTMLElement>) {
		console.log('handleDragOver');
		event.preventDefault();
		if (tab === 'system') setCanDrop('cannot');
		else if (canDrop !== 'can') setCanDrop('can');
	}

	function handleDragLeave(event: DragEvent<HTMLElement>) {
		console.log('handleDragLeave');
		event.preventDefault();
		if (canDrop !== 'idle') setCanDrop('idle');
	}

	async function handleDrop(event: DragEvent<HTMLElement>) {
		console.log('droppedFile');
		event.preventDefault();
		setCanDrop('idle');
		if (canDrop === 'cannot') {
			return;
		}
		console.log('handleDrop');
		const droppedFile = event.dataTransfer.files;
		dispatch(uploadSong({ file: droppedFile[0] }));
	}

	return (
		<Window containerRef={containerRef} id={SYSTEM_WINDOW_FOLDER} className={styles.folderLayout}>
			<nav className={styles.sidebar}>
				<h2 className={styles.title}>Music</h2>
				<ul onMouseDown={(e) => e.stopPropagation()}>
					<li>
						<button
							id="system"
							onClick={handleClick}
							className={`${styles.sidebarItem} ${tab === 'system' ? styles.active : ''}`}>
							System Playlist
						</button>
					</li>
					<li>
						<button
							id="user"
							onClick={handleClick}
							className={`${styles.sidebarItem} ${tab === 'user' ? styles.active : ''}`}>
							My Playlist
						</button>
					</li>
				</ul>
			</nav>
			<nav className={styles.toolbar}></nav>
			<section
				className={`${styles.folder} ${canDrop === 'cannot' ? styles.cannot : ''} ${
					canDrop === 'can' ? styles.can : ''
				}`}
				onDragOver={handleDragOver}
				onDrop={handleDrop}
				onDragLeave={handleDragLeave}>
				<Contextmenu>
					{tab === 'system' && (
						<Playlist
							playlistType="system"
							selectedItems={selectedItems}
							handleClickContextMenu={handleClickContextMenu}
							handleClickFile={handleClickFile}
						/>
					)}
					{tab === 'user' && (
						<Playlist
							playlistType="user"
							selectedItems={selectedItems}
							handleClickContextMenu={handleClickContextMenu}
							handleClickFile={handleClickFile}
						/>
					)}
				</Contextmenu>
			</section>

			<Window.Header className={styles.folderDraggable} />
		</Window>
	);
}
