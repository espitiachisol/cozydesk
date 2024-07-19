import { FullMetadata, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { auth, db, storage } from './core';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { Song } from '../features/music/type';
import { handleError } from '../utils/errorHandler';
import { ApiResponse } from '../common/type/type';

export async function uploadSongToStorage(file: File): Promise<ApiResponse<{ downloadURL: string; metadata: FullMetadata }>> {
	try {
		const user = auth.currentUser;
		if (!user) throw new Error('User not signed in');
		const storageRef = ref(storage, `${user.uid}/musics/${file.name}`);
		const snapshot = await uploadBytes(storageRef, file);
		const downloadURL = await getDownloadURL(storageRef);
		return { response: { downloadURL, metadata: snapshot.metadata } };
	} catch (error) {
		return { error: handleError(error) };
	}
}

export async function saveSongToFirestore(song: Song): Promise<ApiResponse<Song>>  {
	try {
		const user = auth.currentUser;
		if (!user) throw new Error('User not signed in');
		const songsCollectionRef = collection(db, 'users', user.uid, 'songs');
		const songDocRef = await addDoc(songsCollectionRef, song);
		return {
			response: {
				id: songDocRef.id,
				...song
			}
		};
	} catch (error) {
		return { error: handleError(error) };
	}
}

export async function getUserPlaylist(): Promise<ApiResponse<Song[]>>{
	try {
		const user = auth.currentUser;
		if (!user) throw new Error('User not signed in');

		const songsCollectionRef = collection(db, 'users', user.uid, 'songs');
		const querySnapshot = await getDocs(songsCollectionRef);

		const songs: Song[] = [];
		querySnapshot.forEach((doc) => {
			songs.push({
				id: doc.id,
				...doc.data()
			} as Song);
		});

		return { response: songs };
	} catch (error) {
		return { error: handleError(error) };
	}
}
