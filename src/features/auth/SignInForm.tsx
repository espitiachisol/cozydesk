import { signIn } from './authSlice';
import { useAppDispatch } from '../../app/hook';
import AuthForm from './ AuthForm';

type SignInFormProps = {
	onSwitch: () => void;
};
export default function SignInForm({ onSwitch }: SignInFormProps) {
	const dispatch = useAppDispatch();

	const handleSubmit = (email: string, password: string) => {
		void dispatch(signIn({ email, password }));
	};

	return (
		<AuthForm
			onSwitch={onSwitch}
			onSubmit={handleSubmit}
			subtitle="Sign In"
			submitButtonText="Sign In"
			switchText="Don't have an account?"
			switchButtonText="Sign up"
		/>
	);
}
