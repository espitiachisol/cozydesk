export interface Song {
	id: string;
	bucket: string;
	fullPath: string;
	name: string;
	contentType: string;
	size: number;
	md5Hash: string;
	timeCreated: string;
	downloadURL: string;
	imageURL: string;
	iconURL: string;
}

export interface SystemSong {
	id: string;
	name: string;
	downloadURL: string;
	imageURL: string;
	iconURL: string;
}

export type PlaylistType = 'system' | 'user';
export type PlaylistItem = SystemSong | Song;

export interface DragData {
	playlistType: PlaylistType;
	songId: string;
}

export function isValidDragData(data: unknown): data is DragData {
	return (
		typeof data === 'object' &&
		data !== null &&
		'playlistType' in data &&
		'songId' in data
	);
}
