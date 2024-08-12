import {
	collection,
	doc,
	getDocs,
	setDoc,
	updateDoc,
} from 'firebase/firestore';
import { ApiResponse } from '../common/type/type';
import { auth, db } from './core';
import { handleError } from '../utils/errorHandler';
import { WindowInfo } from '../features/window/type';

export async function updateWindowIsOpenStatus(
	windowId: string,
	isOpen: boolean
): Promise<ApiResponse<void>> {
	try {
		const user = auth.currentUser;
		if (!user) throw new Error('User not signed in');
		const windowDocRef = doc(db, 'users', user.uid, 'windows', windowId);
		await updateDoc(windowDocRef, { isOpen: isOpen });
		return {
			response: undefined,
		};
	} catch (error) {
		return { error: handleError(error) };
	}
}

export async function saveWindowInfoToFirestore(
	windowInfo: WindowInfo
): Promise<ApiResponse<void>> {
	try {
		const user = auth.currentUser;
		console.log('Save!');
		if (!user) throw new Error('User not signed in');
		const windowDocRef = doc(db, 'users', user.uid, 'windows', windowInfo.id);
		await setDoc(windowDocRef, windowInfo);
		return {
			response: undefined,
		};
	} catch (error) {
		return { error: handleError(error) };
	}
}

export async function getUserWindows(): Promise<ApiResponse<WindowInfo[]>> {
	try {
		const user = auth.currentUser;
		if (!user) throw new Error('User not signed in');
		const windowsCollectionRef = collection(db, 'users', user.uid, 'windows');
		const querySnapshot = await getDocs(windowsCollectionRef);
		const windows: WindowInfo[] = [];
		querySnapshot.forEach((doc) => {
			windows.push({
				id: doc.id,
				...doc.data(),
			} as WindowInfo);
		});
		return { response: windows };
	} catch (error) {
		return { error: handleError(error) };
	}
}
