import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store.ts';
import App from './App.tsx';
import './index.css';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary.tsx';
import ErrorFallback from './components/ErrorBoundary/ErrorFallback.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<ErrorBoundary fallback={<ErrorFallback />}>
			<Provider store={store}>
				<App />
			</Provider>
		</ErrorBoundary>
	</React.StrictMode>
);
