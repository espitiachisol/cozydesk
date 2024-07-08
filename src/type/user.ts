export interface User {
	uid: string;
	email: string | null;
	displayName?: string | null;
	photoURL?: string | null;
	emailVerified: boolean;
	phoneNumber?: string | null;
	providerData: Array<object>;
	createdAt: string;
	lastLoginAt: string;
}
