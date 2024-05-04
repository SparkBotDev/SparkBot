import { join } from 'node:path';
import type { Client, ClientEvents } from 'discord.js';
import { importObjects } from '../lib/import-objects.js';

declare global {
	type GatewayEventHandler = {
		type: keyof ClientEvents;
		once?: boolean | false;
		execute: (client: Client, ...arguments_: any) => void;
	};
}

export const gatewayEventRouter: Router = {
	async execute(client: Client) {
		const eventHandlers = await importObjects<GatewayEventHandler>(
			join(import.meta.dir, '../bot-components/gateway-events'),
		);

		for (const eventHandler of eventHandlers) {
			if (eventHandler.once) {
				client.once(eventHandler.type, (...arguments_) => {
					eventHandler.execute(client, ...arguments_);
				});
				client.logger.info(
					`🟡 Gateway event ${eventHandler.type} registered for one-time execution.`,
				);
			} else {
				client.on(eventHandler.type, (...arguments_) => {
					eventHandler.execute(client, ...arguments_);
				});
				client.logger.info(`🟡 Gateway event ${eventHandler.type} registered.`);
			}
		}
	},
};
