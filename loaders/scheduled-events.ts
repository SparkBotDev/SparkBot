import { join } from 'node:path';
import { CronJob } from 'cron';
import type { Client } from 'discord.js';
import { DateTime } from 'luxon';
import type { SparkBotLoader } from '../types/components.ts';
import { sparkLoad } from '../lib/spark-load.ts';
import { isSparkBotScheduledEvent } from '../types/guards.ts';

export const loader: SparkBotLoader = {
	async load(client: Client) {
		const events = await sparkLoad(
			join(import.meta.dir, '../components/scheduled-events'),
		);

		for (const event of events) {
			if (isSparkBotScheduledEvent(event)) {
				for (const schedule of event.schedule) {
					const job = CronJob.from({
						cronTime: schedule,
						onTick() {
							event.callOnSchedule(client);
						},
						start: true,
						timeZone: event.timezone ?? '',
					});

					client.scheduledEvents.set(event.id, job);
					client.logger.info(
						`🕑 Scheduled event ${event.id} scheduled: ${job.nextDate().toLocaleString(DateTime.DATETIME_FULL)}`,
					);
				}
			}
		}
	},
};
