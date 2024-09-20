import { type Client, Events } from 'discord.js';
import { GatewayEventSpark } from '../../core/sparks';

/**
 * The Ready event is emitted when the client has completed the initial logon
 * and indicates that the application is ready to send and receive data.
 * @see https://discord.com/developers/docs/topics/gateway-events#ready
 */
export class GatewayEvent extends GatewayEventSpark<Events.ClientReady> {
	once = true;
	eventType = Events.ClientReady as const;
	gates = {};

	override execute(client: Client<true>): void {
		client.logger.info(`✅ ${client.user?.tag} logged in.`);
	}
}
