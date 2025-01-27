import {
	SYSTEM_WINDOW_ENTRY,
	SYSTEM_WINDOW_FOLDER,
	SYSTEM_WINDOW_MUSIC_PLAYER,
	SYSTEM_WINDOW_POMODORO,
} from './constants';
import { WindowConfig } from './type';

export const windowConfigs: { [key: string]: WindowConfig } = {
	[SYSTEM_WINDOW_ENTRY]: {
		width: 260,
		height: 400,
	},
	[SYSTEM_WINDOW_MUSIC_PLAYER]: {
		width: 400,
		height: 368,
	},
	[SYSTEM_WINDOW_FOLDER]: {
		width: 680,
		height: 440,
	},
	[SYSTEM_WINDOW_POMODORO]: {
		width: 300,
		height: 340,
	},
};
