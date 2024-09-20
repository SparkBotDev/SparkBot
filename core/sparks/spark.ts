import type { Client } from 'discord.js';

export abstract class Spark {
	abstract gates: Record<string, unknown>;
	constructor(readonly client: Client) {}

	gateCheck = (...args: unknown[]): void => {
		for (const gate of Object.keys(this.gates)) {
			if (!this.client.gates.get(gate)?.check(this.gates[gate])) return;
		}

		this.execute(...args);
	};

	abstract register(): void;
	abstract execute(...args: unknown[]): void;
}
