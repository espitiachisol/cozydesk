export interface WindowInfo {
	id: string;
	zIndex: number;
	position: { x: number; y: number };
	size: { width: number; height: number };
	isOpen: boolean;
}

export interface WindowConfig {
	width: number;
	height: number;
}
