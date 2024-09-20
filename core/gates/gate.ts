export interface Gate {
	id: string;
	check: (...args: unknown[]) => boolean;
}
