import { CronJob } from 'cron';
import { DateTime } from 'luxon';
import type { Client } from 'discord.js';
import { Spark } from './spark.ts';

export abstract class ScheduledEventSpark extends Spark {
	abstract id: string;
	abstract timezone: string;
	abstract schedule: string[];

	override register(): void {
		for (const schedule of this.schedule) {
			const job = CronJob.from({
				cronTime: schedule,
				timeZone: this.timezone,
				onTick: () => {
					this.gateCheck(this.client);
				},
				start: true,
			});

			this.client.scheduledEvents.set(this.id + '-' + schedule, job);
			this.client.logger.info(
				`🕑 Scheduled event ${this.id} scheduled: ${job.nextDate().toLocaleString(DateTime.DATETIME_FULL)}`,
			);
		}
	}

	abstract override execute(client: Client): void;
}
