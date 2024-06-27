import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
	apiKey: 'AIzaSyAihmUKVp-CgdAYM_Ubjnr6UTQnPQkz17U',
	authDomain: 'cozy-desk-ac8de.firebaseapp.com',
	projectId: 'cozy-desk-ac8de',
	storageBucket: 'cozy-desk-ac8de.appspot.com',
	messagingSenderId: '294010601145',
	appId: '1:294010601145:web:c0d1f58fb5b0ef0c452568'
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
