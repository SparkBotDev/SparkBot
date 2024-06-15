import type { LoggerPlugin } from '@sparkbot/logger-plugin-interface';
import type { Collection } from 'discord.js';
import type { CronJob } from 'cron';
import type { BunSQLiteDatabase } from 'drizzle-orm/bun-sqlite';
import type * as dbSchema from '../db/schema.ts';
import type { SparkBotConfig } from './config.ts';
import type { SparkBotInteraction } from './components.ts';

declare module 'discord.js' {
	interface Client {
		config: SparkBotConfig;
		logger: LoggerPlugin;
		interactions: Collection<string, SparkBotInteraction>;
		cooldowns: Collection<string, number>;
		scheduledEvents: Collection<string, CronJob>;
		db: {
			orm: BunSQLiteDatabase<typeof dbSchema>;
			schemas: typeof dbSchema;
		};
	}
}
