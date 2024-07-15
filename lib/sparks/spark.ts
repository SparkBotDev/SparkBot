/* eslint-disable @typescript-eslint/no-extraneous-class */

export abstract class Spark {
	abstract onLoad(): void;
	abstract execute(...arguments_: unknown[]): void;
}
