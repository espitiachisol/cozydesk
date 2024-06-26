import styles from './ContextMenu.module.css'
import { createContext, PropsWithChildren, useContext, useEffect, useRef, useState } from 'react';

interface Position {
  x: number;
  y: number;
}

type ContextMenuContextType = {
  openId: string;
  close: () => void;
  open: (id: string) => void;
  position: Position | null;
  setPosition: (position: Position) => void;
};

const ContextMenuContext = createContext<ContextMenuContextType | null>(null);

function useContextMenu() {
  const context = useContext(ContextMenuContext);
  if (context === undefined)
    throw new Error("ContextMenuContext was used outside the ContextMenuProvider");
  return context;
}


function Contextmenu({ children }: PropsWithChildren)  {
	const [openId, setOpenId] = useState('');
	const [position, setPosition] = useState<Position | null>(null);
	const close =  () => setOpenId('')
	const open = setOpenId

	return (
		<ContextMenuContext.Provider value={{ openId, open, close, position, setPosition }}>
			{children}
		</ContextMenuContext.Provider>
	);
}

type ToggleProps = PropsWithChildren<{
  id: string;
	className: string;
	onClickToggle(event: React.MouseEvent<HTMLButtonElement>): void;
	onClickContextMenu?(event: React.MouseEvent<HTMLButtonElement>): void;
}>;
function Toggle({ id, children, onClickToggle, className, onClickContextMenu}: ToggleProps) {
	const context = useContextMenu();
  if (!context) {
    throw new Error('Toggle must be used within a ContextMenu');
  }
	const { openId, close, open, setPosition } = context;

	function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
		e.stopPropagation();
		e.preventDefault();
		
		console.log('handleClick')
		onClickToggle(e)
		close();
	}

	function handleContextMenu(e: React.MouseEvent<HTMLButtonElement>) {
		e.preventDefault();
		console.log('handleContextMenu')
		setPosition({ x: e.clientX, y: e.clientY });
		openId === "" || openId !== id ? open(id) : close();
		if(onClickContextMenu) onClickContextMenu(e)
	}

	return (
		<button onContextMenu={handleContextMenu} id={id} className={className} onClick={handleClick}>
			{children}
		</button>
	);
}
type ListProps = PropsWithChildren<{
  id: string;
}>

function List({ id, children }: ListProps) {
	const context = useContextMenu();
  if (!context) {
    throw new Error('List must be used within a Menu');
  }
  const { openId, position, close } = context;
  const ref = useRef<HTMLMenuElement | null>(null);

	useEffect(() => {
		function handleClick(e:MouseEvent) {
			if (ref.current && !ref.current.contains(e.target as Node)) {
				console.log('close')
				close();
			}
		}
		document.addEventListener('click', handleClick);
		return () => document.removeEventListener('click', handleClick);
	}, [close]);

	if (id !== openId) return null;
	return (
		<menu ref={ref} className={styles.contextMenu} style={{ left: position?.x, top: position?.y }}>
			{children}
		</menu>
	)
}

type ButtonProps = PropsWithChildren<{
  onClick: () => void;
}>
function Button({ children, onClick }: ButtonProps) {
  return <li><button onClick={onClick}>{children}</button></li>;
}
Contextmenu.Toggle = Toggle;
Contextmenu.List = List;
Contextmenu.Button = Button;

export default Contextmenu;
