import { useEffect, useState, MouseEvent, DragEvent } from 'react';
import Window from '../../components/Window/Window';
import styles from './Folder.module.css';
import Contextmenu from '../../components/Contextmenu/ContextMenu';
import { useAppDispatch, useAppSelector } from '../../app/hook';
import {
	fetchUserPlaylist,
	selectUploadStatus,
	uploadSong,
} from '../music/musicSlice';
import Playlist from './Playlist';
import { PlaylistType } from '../music/type';
import { SYSTEM_WINDOW_FOLDER } from '../window/constants';
import { Status } from '../../common/type/type';
import {
	bringToFront,
	closeWindowAsync,
	getWindowById,
	moveWindow,
	resizeWindow,
} from '../window/windowSlice';

type FolderProps = {
	containerRef?: React.MutableRefObject<HTMLElement | null>;
};
export default function Folder({ containerRef }: FolderProps) {
	const dispatch = useAppDispatch();
	const uploadStatus = useAppSelector(selectUploadStatus);
	const id = SYSTEM_WINDOW_FOLDER;
	const window = useAppSelector(getWindowById(id));
	const [tab, setTab] = useState<PlaylistType>('system');
	const [selectedItems, setSelectedItems] = useState<string[]>([]);
	const [canDrop, setCanDrop] = useState<'idle' | 'cannot' | 'can'>('idle');

	useEffect(() => {
		void dispatch(fetchUserPlaylist());
	}, [dispatch]);

	if (!window) return null;

	function handleClickFile(e: MouseEvent<HTMLButtonElement>) {
		e.preventDefault();
		const selectId = e.currentTarget.id;
		if (e.metaKey) {
			setSelectedItems((selectedItems) =>
				selectedItems.includes(selectId)
					? selectedItems.filter((id) => id !== selectId)
					: [...selectedItems, selectId]
			);
		} else if (e.shiftKey) {
			// setSelectedItems((selectedItems) => {
			// 	selectedItems.includes(selectId)?selectedItems.filter(id=>id!==selectId):[...selectedItems,selectId]
			// })
		} else {
			setSelectedItems((selectedItems) =>
				selectedItems.includes(selectId) ? [] : [selectId]
			);
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
		event.preventDefault();
		if (tab === 'system') setCanDrop('cannot');
		else if (uploadStatus === Status.Loading) setCanDrop('cannot');
		else if (canDrop !== 'can') setCanDrop('can');
	}

	function handleDragLeave(event: DragEvent<HTMLElement>) {
		event.preventDefault();
		if (canDrop !== 'idle') setCanDrop('idle');
	}

	function handleDrop(event: DragEvent<HTMLElement>) {
		event.preventDefault();
		setCanDrop('idle');
		if (canDrop === 'cannot') {
			return;
		}
		const droppedFiles = event.dataTransfer.files;
		void dispatch(uploadSong({ files: droppedFiles }));
	}

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

	return (
		<Window
			containerRef={containerRef}
			className={styles.folderLayout}
			position={window.position}
			size={window.size}
			zIndex={window.zIndex}
			onResize={handleResize}
			onMove={handleMove}
			onBringToFront={handleBringToFront}
			onClose={handleClose}
		>
			<nav className={styles.sidebar}>
				<h2 className={styles.title}>Music</h2>
				<ul>
					<li>
						<button
							id="system"
							onClick={handleClick}
							className={`${styles.sidebarItem} ${tab === 'system' ? styles.active : ''}`}
						>
							System Playlist
						</button>
					</li>
					<li>
						<button
							id="user"
							onClick={handleClick}
							className={`${styles.sidebarItem} ${tab === 'user' ? styles.active : ''}`}
						>
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
				onDragLeave={handleDragLeave}
			>
				<Contextmenu>
					<Playlist
						key={tab}
						playlistType={tab}
						selectedItems={selectedItems}
						onClickContextMenu={handleClickContextMenu}
						onClickFile={handleClickFile}
					/>
				</Contextmenu>
			</section>

			<Window.DragArea />
		</Window>
	);
}
