import {
	deleteObject,
	FullMetadata,
	getDownloadURL,
	ref,
	uploadBytes,
} from 'firebase/storage';
import { auth, db, storage } from './core';
import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	getDocs,
} from 'firebase/firestore';
import { Song } from '../features/music/type';
import { handleError } from '../utils/errorHandler';
import { ApiResponse } from '../common/type/type';

export async function uploadSongToStorage(
	file: File
): Promise<ApiResponse<{ downloadURL: string; metadata: FullMetadata }>> {
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

export async function saveSongToFirestore(
	song: Song
): Promise<ApiResponse<Song>> {
	try {
		const user = auth.currentUser;
		if (!user) throw new Error('User not signed in');
		const songsCollectionRef = collection(db, 'users', user.uid, 'songs');
		const songDocRef = await addDoc(songsCollectionRef, song);
		return {
			response: {
				...song,
				id: songDocRef.id,
			},
		};
	} catch (error) {
		return { error: handleError(error) };
	}
}

export async function getUserPlaylist(): Promise<ApiResponse<Song[]>> {
	try {
		const user = auth.currentUser;
		if (!user) throw new Error('User not signed in');

		const songsCollectionRef = collection(db, 'users', user.uid, 'songs');
		const querySnapshot = await getDocs(songsCollectionRef);

		const songs: Song[] = [];
		querySnapshot.forEach((doc) => {
			songs.push({
				id: doc.id,
				...doc.data(),
			} as Song);
		});

		return { response: songs };
	} catch (error) {
		return { error: handleError(error) };
	}
}

export async function deleteSongFromStorage(
	songPath: string
): Promise<ApiResponse<void>> {
	try {
		const songRef = ref(storage, songPath);
		await deleteObject(songRef);
		return { response: undefined };
	} catch (error) {
		return { error: handleError(error) };
	}
}

export async function deleteSongFromFirestore(
	songId: string
): Promise<ApiResponse<void>> {
	try {
		const user = auth.currentUser;
		if (!user) throw new Error('User not signed in');
		const songDocRef = doc(db, 'users', user.uid, 'songs', songId);
		await deleteDoc(songDocRef);
		return { response: undefined };
	} catch (error) {
		return { error: handleError(error) };
	}
}
