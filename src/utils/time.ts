export const formatTime = (timeInSeconds: number, format: 'HH:MM:SS' | 'Hh Mm Ss'): string => {

	const hours = Math.floor(timeInSeconds / 60 / 60);
	const minutes = Math.floor(timeInSeconds / 60) - hours * 60;
	const seconds = Math.floor(timeInSeconds % 60);
	if(format === 'HH:MM:SS'){
		return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
	}
  else if (format === 'Hh Mm Ss') {
		return `${hours}h ${minutes}m ${seconds}s`;
	}
  return ''
};