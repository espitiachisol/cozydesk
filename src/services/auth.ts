import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { User } from '../type/user';
import { auth } from './core';

export async function signUp(email: string, password: string): Promise<User> {
	try {
		const userCredential = await createUserWithEmailAndPassword(auth, email, password);
		const user = userCredential.user;

		return {
			uid: user.uid,
			email: user.email
		};
	} catch (error) {
		const errorCode = error.code;
		let errorMessage = error.message;
		switch (errorCode) {
			case 'auth/email-already-in-use':
				errorMessage = 'This email address is already in use.';
				break;
			case 'auth/invalid-email':
				errorMessage = 'The email address is not valid.';
				break;
			case 'auth/operation-not-allowed':
				errorMessage = 'Operation not allowed. Please contact support.';
				break;
			case 'auth/weak-password':
				errorMessage = 'The password is too weak.';
				break;
		}
		throw Error(errorMessage);
	}
}

export async function signIn(email: string, password: string): Promise<User> {
	try {
		const userCredential = await signInWithEmailAndPassword(auth, email, password);
		const user = userCredential.user;

		return {
			uid: user.uid,
			email: user.email
		};
	} catch (error) {
		const errorCode = error.code;
		let errorMessage = error.message;
		switch (errorCode) {
			case 'auth/invalid-email':
				errorMessage = 'The email address is not valid.';
				break;
			case 'auth/user-disabled':
				errorMessage = 'The user account has been disabled.';

				break;
			case 'auth/user-not-found':
				errorMessage = 'No user found with this email address.';
				break;
			case 'auth/wrong-password':
				errorMessage = 'Incorrect password.';
				break;
			case 'auth/invalid-credential':
				errorMessage = 'The credential is malformed or has expired.';
				break;
		}
		throw Error(errorMessage);
	}
}

export function subscribeAuthStateChanged(callback) {
	return onAuthStateChanged(auth, callback);
}

export async function signOutUser(){
	try {
		return await signOut(auth)
	}catch (error) {
		throw Error(error.message);
	}
}