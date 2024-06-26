import Contextmenu from '../../components/Contextmenu/ContextMenu';
import styles from './File.module.css'
type FileProps = {
  id: string;
  icon: string;
  title: string;
  selected: boolean;
  onClickToggle(event: React.MouseEvent<HTMLButtonElement>): void;
  onClickContextMenu(event: React.MouseEvent<HTMLButtonElement>): void;
};
export default function File({id, icon, title, selected, onClickToggle, onClickContextMenu}: FileProps) {
  return (<>
    <Contextmenu.Toggle onClickContextMenu={onClickContextMenu} id={id} onClickToggle={onClickToggle} className={`${styles.file} ${selected? styles.selected:''}`}>
        <img src={icon} draggable={false} alt={title}/>
        <p>{title}</p>
      </Contextmenu.Toggle>
      <Contextmenu.List id={id}>
        <Contextmenu.Button onClick={()=>{}}>Play</Contextmenu.Button>
        <Contextmenu.Button onClick={()=>{}}>Stop</Contextmenu.Button>
      </Contextmenu.List>
    </>
    
  )
}
