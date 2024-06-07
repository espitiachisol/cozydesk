import CurrentDateTime from './CurrentDateTime';
import styles from './Header.module.css';

function Header(): JSX.Element {
	return (
		<header className={styles.AppHeader}>
			<img className={styles.logo} src="/logo.svg" alt="The cozydesk logo" />
			<nav>
				<ul>
					<li>
						<button>Cozydesk</button>
					</li>
					<li>
						<button>temp1</button>
					</li>
					<li>
						<button>temp2</button>
					</li>
				</ul>
			</nav>
			<CurrentDateTime />
		</header>
	);
}

export default Header;
