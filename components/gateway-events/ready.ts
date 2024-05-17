import { Events, type Client } from 'discord.js';
import type { SparkBotGatewayEvent } from '../../types/components.ts';

/*
 * The ready event is emitted when the bot has completed the initial handshake
 * with the gateway. This indicates Discord is prepared for your bot to receive
 * interactions and send other requests.
 * https://discord.com/developers/docs/topics/gateway-events#ready
 */
export const gatewayEvent: SparkBotGatewayEvent<Events.ClientReady> = {
	eventName: Events.ClientReady,
	once: true,
	listener(client: Client) {
		if (client.user) {
			client.user.setPresence({
				status: 'online',
			});
		}

		client.logger.info(`🟢 ${client.user?.tag} logged in.`);
	},
};
