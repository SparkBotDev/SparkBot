import { CronJob } from 'cron';
import { DateTime } from 'luxon';
import type { Client } from 'discord.js';
import { sparkContainer } from './container.ts';
import { Spark } from './spark.ts';

export abstract class ScheduledEventSpark extends Spark {
	protected timezone?: string;
	protected abstract id: string;
	protected abstract schedule: string[];

	override onLoad(): void {
		for (const schedule of this.schedule) {
			const job = CronJob.from({
				cronTime: schedule,
				onTick: () => {
					this.execute(sparkContainer.client!);
				},
				start: true,
				timeZone: this.timezone ?? '',
			});

			sparkContainer.client?.scheduledEvents.set(this.id + '-' + schedule, job);
			sparkContainer.client?.logger.info(
				`🕑 Scheduled event ${this.id} scheduled: ${job.nextDate().toLocaleString(DateTime.DATETIME_FULL)}`,
			);
		}
	}

	abstract override execute(client: Client): void;
}
