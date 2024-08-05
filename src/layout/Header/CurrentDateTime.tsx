// CurrentDateTime.tsx
import { useState, useEffect } from 'react';

const CurrentDateTime = (): JSX.Element => {
	const [now, setNow] = useState(new Date());

	useEffect(() => {
		const intervalId = setInterval(() => {
			setNow(new Date());
		}, 1000);

		return () => clearInterval(intervalId);
	}, []);

	return (
		<time dateTime={now.toISOString()}>
			{now.toLocaleString(undefined, {
				month: 'long',
				day: 'numeric',
				weekday: 'long',
				hour: 'numeric',
				minute: 'numeric',
				hour12: true,
			})}
		</time>
	);
};

export default CurrentDateTime;
