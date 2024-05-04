import { Events, type Client } from 'discord.js';

export const debugEvent: GatewayEventHandler = {
	type: Events.Debug,
	once: false,
	execute(client: Client, message: string) {
		client.logger.debug(message);
	},
};

export const warnEvent: GatewayEventHandler = {
	type: Events.Warn,
	once: false,
	execute(client: Client, message: string) {
		client.logger.warn(message);
	},
};

export const errorEvent: GatewayEventHandler = {
	type: Events.Error,
	once: false,
	execute(client: Client, message: string) {
		client.logger.error(message);
	},
};
