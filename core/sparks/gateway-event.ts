import type { ClientEvents } from 'discord.js';
import { Spark } from './spark.ts';

export abstract class GatewayEventSpark<
	Event extends keyof ClientEvents,
> extends Spark {
	abstract once: boolean;
	abstract eventType: Event;

	register() {
		if (this.once) {
			this.client.once(this.eventType, this.gateCheck);
			this.client.logger.info(
				`🚪 Gateway Event ⚡️: "${this.eventType}" registered for onetime execution`,
			);
		} else {
			this.client.on(this.eventType, this.gateCheck);
			this.client.logger.info(
				`🚪 Gateway Event ⚡️: "${this.eventType}" registered`,
			);
		}
	}

	abstract override execute(...args: ClientEvents[Event]): void;
}
