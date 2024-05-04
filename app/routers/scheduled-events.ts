import { join } from 'node:path';
import { CronJob } from 'cron';
import type { Client } from 'discord.js';
import { DateTime } from 'luxon';
import { importObjects } from '../lib/import-objects.js';

declare global {
	type ScheduledEvent = {
		name: string;
		schedule: string[];
		timezone?: string;
		execute: (client: Client) => void;
	};
}

export const scheduledEventsRouter: Router = {
	async execute(client: Client) {
		const events = await importObjects<ScheduledEvent>(
			join(import.meta.dir, '../bot-components/scheduled-events'),
		);

		for (const event of events) {
			for (const schedule of event.schedule) {
				const job = CronJob.from({
					cronTime: schedule,
					onTick() {
						event.execute(client);
					},
					start: true,
					timeZone: event.timezone ?? '',
				});

				client.logger.info(
					`🟤 Crontab ${event.name} is scheduled: ${job.nextDate().toLocaleString(DateTime.DATETIME_FULL)}`,
				);
			}
		}
	},
};
