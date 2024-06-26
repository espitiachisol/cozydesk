import { useState } from 'react';
import Window from '../Window/Window';
import { systemMusics } from '../../data/music';
import styles from './Folder.module.css';
type FolderProps = {
	containerRef?: React.MutableRefObject<HTMLElement | null>;
};
export default function Folder({ containerRef }: FolderProps) {
	const [tab, setTab] = useState('systemMusic');
	return (
		<Window containerRef={containerRef} id="folder" className={styles.folderLayout}>
			
			<nav className={styles.sidebar}>
        <h2 className={styles.title}>Music</h2>
				<ul>
					<li >
						<button className={`${styles.sidebarItem} ${tab==='systemMusic'?styles.active:''}`}>System Music</button>
					</li>
					<li >
						<button className={`${styles.sidebarItem} ${tab==='myMusic'?styles.active:''}`}>My Music</button>
					</li>
				</ul>
			</nav>
      <nav className={styles.toolbar}>

      </nav>
			<section className={styles.folder}>
				{tab === 'systemMusic' &&
					systemMusics.map((music) => (
						<button className={styles.folderItem} onClick={() => {}}>
							<img src={music.icon} draggable={false} alt={music.title}/>
							<p>{music.title}</p>
						</button>
					))}
			</section>
      <Window.Header className={styles.folderDraggable} />
		</Window>
	);
}
