import { GatewayIntentBits } from 'discord.js';
import { LoggingLevel } from '@sparkbot/plugin-logger';
import type { SecretsVaultSchema, SparkBotSchema } from './lib/config';

export const secretsVaultPluginConfig: SecretsVaultSchema = {
	module: '@sparkbot/plugin-secrets',
};

export const sparkBotConfig: SparkBotSchema = {
	discordAPIKey: { secretVaultKey: 'discordAPIKey' },
	discordAppID: { secretVaultKey: 'discordAppID' },
	discordIntents: [GatewayIntentBits.Guilds],
	enabledPartials: [],
	defaultPresence: {
		status: 'online',
		activities: [],
	},
	loggingLibraryPlugin: {
		prod: {
			module: '@sparkbot/plugin-logger',
			options: { loggingLevel: LoggingLevel.warn },
		},
		dev: {
			module: '@sparkbot/plugin-logger',
			options: { loggingLevel: LoggingLevel.debug },
		},
	},
};
