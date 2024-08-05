export default function debounce(
	callback: Function,
	wait: number = 0
): Function {
	let timeoutID: ReturnType<typeof setTimeout> | null = null;
	return function (...args: any[]) {
		clearTimeout(timeoutID ?? undefined);
		timeoutID = setTimeout(() => callback.apply(this, args), wait);
	};
}
