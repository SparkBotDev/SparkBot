import { join } from 'node:path';
import type { Client } from 'discord.js';
import type { SparkBotLoader } from '../types/components.ts';
import { sparkLoad } from '../lib/spark-load.ts';
import { isSparkBotGatewayEvent } from '../types/guards.ts';

/*
 * Imports files in components/gateway-events and registers event handlers with Client
 */
export const loader: SparkBotLoader = {
	async load(client: Client) {
		const events = await sparkLoad(
			join(import.meta.dir, '../components/gateway-events'),
		);

		for (const event of events) {
			if (isSparkBotGatewayEvent(event)) {
				if (event.once) {
					client.once(event.eventName, (...arguments_) => {
						event.listener(...arguments_); // eslint-disable-line @typescript-eslint/no-unsafe-argument
					});
					client.logger.info(
						`🟡 Gateway event listener ${event.eventName} registered for one-time execution.`,
					);
				} else {
					client.on(event.eventName, (...arguments_) => {
						event.listener(...arguments_); // eslint-disable-line @typescript-eslint/no-unsafe-argument
					});
					client.logger.info(
						`🟡 Gateway event listener ${event.eventName} registered.`,
					);
				}
			}
		}
	},
};
