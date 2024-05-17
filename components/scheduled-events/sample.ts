import type { Client } from 'discord.js';
import type { SparkBotScheduledEvent } from '../../types/components.ts';

export const event: SparkBotScheduledEvent = {
	id: 'sample-event',
	schedule: ['* * * * *'],
	timezone: 'US/Central',
	callOnSchedule(client: Client) {
		client.logger.debug('Sample event tick');
	},
};
