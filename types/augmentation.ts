import type { Logger } from '@sparkbot/plugin-logger';
import type {
	Collection,
	ContextMenuCommandBuilder,
	SlashCommandBuilder,
} from 'discord.js';
import type { CronJob } from 'cron';
import type { SparkBotConfig } from '../lib/config';
import type { InteractionSpark } from '../lib/sparks';

declare module 'discord.js' {
	interface Client {
		config: SparkBotConfig;
		logger: Logger;
		sparks: Collection<string, InteractionSpark>;
		cooldowns: Collection<string, number>;
		commands: Array<SlashCommandBuilder | ContextMenuCommandBuilder>;
		scheduledEvents: Collection<string, CronJob>;
	}
}
