import type { ClientEvents } from 'discord.js';
import { sparkContainer } from './container.ts';
import { Spark } from './spark.ts';

export abstract class GatewayEventSpark<
	Event extends keyof ClientEvents,
> extends Spark {
	once?: boolean | false;
	abstract eventType: Event;

	onLoad(): void {
		if (this.once) {
			sparkContainer.client?.once(this.eventType, this.execute);
			sparkContainer.client?.logger.info(
				`📫 Gateway Event ⚡️: "${this.eventType}" registered for onetime execution`,
			);
		} else {
			sparkContainer.client?.on(this.eventType, this.execute);
			sparkContainer.client?.logger.info(
				`📫 Gateway Event ⚡️: "${this.eventType}" registered`,
			);
		}
	}

	abstract override execute(...arguments_: ClientEvents[Event]): void;
}
