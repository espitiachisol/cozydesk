import Menu from '../../components/Menu/Menu';
import CurrentDateTime from './CurrentDateTime';
import styles from './Header.module.css';

function Header(): JSX.Element {
	return (
		<header className={styles.AppHeader}>
			<Menu>
				<Menu.Toggle id='cozydesk'>
					<img
						className={styles.logo}
						src="/logo.svg"
						alt="The cozydesk logo"
					/>
					Cozydesk
				</Menu.Toggle>
				<Menu.List id='cozydesk'>
					<Menu.Button onClick={()=>{}}>Sign up</Menu.Button>
					<Menu.Button onClick={()=>{}}>Setting</Menu.Button>
					<Menu.Button onClick={()=>{}}>About Developer</Menu.Button>
				</Menu.List>
				<Menu.Toggle id='app'>
					App
				</Menu.Toggle>
				<Menu.List id='app'>
					<Menu.Button onClick={()=>{}}>Music Player</Menu.Button>
					<Menu.Button onClick={()=>{}}>Pomodoro</Menu.Button>
					<Menu.Button onClick={()=>{}}>Todo</Menu.Button>
				</Menu.List>
			</Menu>
			<CurrentDateTime />
		</header>
	);
}

export default Header;
