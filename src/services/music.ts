import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { auth, db, storage } from './core';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { Song } from '../type/music';

export async function uploadSongToStorage(file) {
	try {
		const user = auth.currentUser;
		if (!user) throw Error('User not signed in');
		const storageRef = ref(storage, `${user.uid}/musics/${file.name}`);
		const snapshot = await uploadBytes(storageRef, file);
		const downloadURL = await getDownloadURL(storageRef);
		return { downloadURL, metadata: snapshot.metadata };
	} catch (error) {
		throw Error(error.message);
	}
}

export async function saveSongToFirestore(song: Song) {
	try {
		const user = auth.currentUser;
		if (!user) throw new Error('User not signed in');
		const songsCollectionRef = collection(db, 'users', user.uid, 'songs');
		// Add the song document with an auto-generated ID
		const songDocRef = await addDoc(songsCollectionRef, song);
		return {
			id: songDocRef.id,
			...song
		};
	} catch (error) {
		throw Error(error.message);
	}
	return song;
}

export async function getUserPlaylist(): Promise<Song[]> {
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

		return songs;
	} catch (error) {
		throw new Error(error.message);
	}
}
