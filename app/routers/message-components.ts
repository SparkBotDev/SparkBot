import { join } from 'node:path';
import type { MessageComponentInteraction, Client } from 'discord.js';
import { importObjects } from '../lib/import-objects.js';

declare global {
	type MessageComponentSpark = {
		name: string;
		execute: (interaction: MessageComponentInteraction) => void;
		coolDownSeconds?: number;
	};
}

export const messageComponentRouter: Router = {
	async execute(client: Client) {
		const components = await importObjects<MessageComponentSpark>(
			join(import.meta.dir, '../bot-components/message-components'),
		);

		for (const component of components) {
			client.components.set(component.name, component);
		}

		client.logger.info(`🔵 Registered ${client.components.size} component(s)`);
	},
};
