import {
	createUserWithEmailAndPassword,
	onAuthStateChanged,
	signInWithEmailAndPassword,
	signOut,
	User as FirebaseUser,
} from 'firebase/auth';
import { User } from '../features/auth/type';
import { auth, db } from './core';
import { doc, setDoc } from 'firebase/firestore';
import { handleError } from '../utils/errorHandler';
import { ApiResponse } from '../common/type/type';

// Function to transform FirebaseUser to your User type
function transformUser(user: FirebaseUser): User {
	return {
		uid: user.uid,
		email: user.email,
		displayName: user.displayName,
		photoURL: user.photoURL,
		emailVerified: user.emailVerified,
		phoneNumber: user.phoneNumber,
		providerData: user.providerData,
		createdAt: user.metadata.creationTime || '',
		lastLoginAt: user.metadata.lastSignInTime || '',
	};
}

export async function signUpService(
	email: string,
	password: string
): Promise<ApiResponse<User>> {
	try {
		const userCredential = await createUserWithEmailAndPassword(
			auth,
			email,
			password
		);
		const user = transformUser(userCredential.user);
		await setDoc(doc(db, 'users', user.uid), user);
		return { response: user };
	} catch (error) {
		return { error: handleError(error) };
	}
}

export async function signInService(
	email: string,
	password: string
): Promise<ApiResponse<User>> {
	try {
		const userCredential = await signInWithEmailAndPassword(
			auth,
			email,
			password
		);
		const user = transformUser(userCredential.user);
		return { response: user };
	} catch (error) {
		return { error: handleError(error) };
	}
}

export function subscribeAuthStateChanged(
	callback: (user: User | null) => void
) {
	return onAuthStateChanged(auth, (user: FirebaseUser | null) => {
		if (!user) {
			callback(null);
			return;
		}
		const userData = transformUser(user);
		callback(userData);
	});
}

export async function signOutService(): Promise<ApiResponse<string>> {
	try {
		await signOut(auth);
		return { response: 'Sign out successful' };
	} catch (error) {
		return { error: handleError(error) };
	}
}
