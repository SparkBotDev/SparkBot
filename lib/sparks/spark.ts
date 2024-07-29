export abstract class Spark {
	abstract onLoad(): void;
	abstract execute(...arguments_: unknown[]): void;
}
