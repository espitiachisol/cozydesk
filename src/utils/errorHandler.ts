import { FirebaseError } from "firebase/app";
function getFirebaseErrorMessage(error:FirebaseError):string {
  switch (error.code) {
    // sign in / up common error
    case 'auth/invalid-email':
      return 'The email address is not valid.';
    // sign in error
    case 'auth/user-disabled':
      return 'The user account has been disabled.';
    case 'auth/user-not-found':
      return 'No user found with this email address.';
    case 'auth/wrong-password':
      return 'Incorrect password.';
    case 'auth/invalid-credential':
      return 'The credential is malformed or has expired.';
    case 'auth/too-many-requests':
      return 'Too many failed login attempts. Please reset your password or try again later.';
    // sign up error
    case 'auth/email-already-in-use':
      return 'This email address is already in use.';
    case 'auth/operation-not-allowed':
      return 'Operation not allowed. Please contact support.';
    case 'auth/weak-password':
      return 'The password is too weak.';
    default:
      return error.message
  }
  
}
export function handleError(error: unknown): string {
  if (error instanceof Error) {
      return error.message;
  } else if(error instanceof FirebaseError) {
    return getFirebaseErrorMessage(error)
  } else {
      return 'An unknown error occurred';
  }
}