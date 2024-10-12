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

interface UpdateWindowFields {
	zIndex?: number;
	position?: { x: number; y: number };
	isOpen?: boolean;
}

function getWindowDocRef(windowId: string) {
	const user = auth.currentUser;
	if (!user) throw new Error('User not signed in');
	return doc(db, 'users', user.uid, 'windows', windowId);
}

async function closeWindow(windowId: string): Promise<ApiResponse<void>> {
	try {
		const windowDocRef = getWindowDocRef(windowId);
		await updateDoc(windowDocRef, { isOpen: false, zIndex: 0 });
		return {
			response: undefined,
		};
	} catch (error) {
		return { error: handleError(error) };
	}
}

async function updateWindow(
	windowId: string,
	updateField: UpdateWindowFields
): Promise<ApiResponse<void>> {
	try {
		const windowDocRef = getWindowDocRef(windowId);
		await updateDoc(windowDocRef, { ...updateField });
		return {
			response: undefined,
		};
	} catch (error) {
		return { error: handleError(error) };
	}
}

export async function createWindow(
	windowInfo: WindowInfo
): Promise<ApiResponse<void>> {
	try {
		const windowDocRef = getWindowDocRef(windowInfo.id);
		await setDoc(windowDocRef, windowInfo);
		return {
			response: undefined,
		};
	} catch (error) {
		return { error: handleError(error) };
	}
}

export async function getWindows(): Promise<ApiResponse<WindowInfo[]>> {
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

export default {
	closeWindow,
	updateWindow,
	createWindow,
	getWindows,
};
