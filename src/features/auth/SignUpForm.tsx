import { signUp } from './authSlice';
import { useAppDispatch } from '../../app/hook';
import AuthForm from './ AuthForm';

type SignUpFormProps = {
	onSwitch: () => void;
};
export default function SignUpForm({ onSwitch }: SignUpFormProps) {
	const dispatch = useAppDispatch();

	const handleSubmit = (email: string, password: string) => {
		void dispatch(signUp({ email, password }));
	};

	return (
		<AuthForm
			onSwitch={onSwitch}
			onSubmit={handleSubmit}
			subtitle="Sign Up"
			submitButtonText="Create account"
			switchText="Already have an account?"
			switchButtonText="Sign In"
		/>
	);
}
