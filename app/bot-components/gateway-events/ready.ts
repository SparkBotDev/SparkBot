import { Events, type Client } from 'discord.js';

export const readyEvent: GatewayEventHandler = {
	type: Events.ClientReady,
	once: true,
	execute(client: Client) {
		client.logger.info(`🟢 ${client.user?.tag} logged in.`);
	},
};
