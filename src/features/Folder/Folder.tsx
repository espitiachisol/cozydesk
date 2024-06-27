import { useState } from 'react';
import Window from '../Window/Window';
import { systemMusics } from '../../data/music';
import File from './File';
import styles from './Folder.module.css';
import Contextmenu from '../../components/Contextmenu/ContextMenu';
type FolderProps = {
	containerRef?: React.MutableRefObject<HTMLElement | null>;
};
export default function Folder({ containerRef }: FolderProps) {
	const [tab, setTab] = useState('systemMusic');
	const [selectedItems, setSelectedItems] = useState<string[]>([]);
	function handleClickFile (e){
		console.log(e.metaKey)
		e.preventDefault()
		const selectId = e.currentTarget.id
		if(e.metaKey){
			setSelectedItems((selectedItems) => selectedItems.includes(selectId)?selectedItems.filter(id=>id!==selectId):[...selectedItems,selectId])
		} else if (e.shiftKey){
			// setSelectedItems((selectedItems) => {
			// 	selectedItems.includes(selectId)?selectedItems.filter(id=>id!==selectId):[...selectedItems,selectId]
			// })
		} else{
			setSelectedItems((selectedItems) => selectedItems.includes(selectId)?[]:[selectId])
		}
	}
	function handleClickContextMenu (e){
		const selectId = e.currentTarget.id
		setSelectedItems([selectId])
	}
	return (
		<Window containerRef={containerRef} id="folder" className={styles.folderLayout}>
			<nav className={styles.sidebar}>
				<h2 className={styles.title}>Music</h2>
				<ul onMouseDown={(e)=>e.stopPropagation()}>
					<li>
						<button className={`${styles.sidebarItem} ${tab === 'systemMusic' ? styles.active : ''}`}>
							System Music
						</button>
					</li>
					<li>
						<button className={`${styles.sidebarItem} ${tab === 'myMusic' ? styles.active : ''}`}>My Music</button>
					</li>
				</ul>
			</nav>
			<nav className={styles.toolbar}></nav>
			<section className={styles.folder}>
				<Contextmenu>
					{tab === 'systemMusic' &&
						systemMusics.map((music) => (
							<File id={music.id} onClickContextMenu={handleClickContextMenu} onClickToggle={handleClickFile} selected={selectedItems.includes(music.id)} key={music.id} icon={music.icon} title={music.title} />
						))}
						</Contextmenu>
				</section>
				
			<Window.Header className={styles.folderDraggable} />
		</Window>
	);
}
