import { GatewayIntentBits } from 'discord.js';
import type {
	SecretsVaultPluginConfig,
	SparkBotConfig,
} from './core/configuration';

export const secretsVaultPluginConfig: SecretsVaultPluginConfig = {
	module: '@sparkbot/plugin-secrets',
};

export const appConfig: SparkBotConfig = {
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
			options: {
				loggingLevel: 'warn',
				transports: [
					{
						target: 'pino-pretty',
						options: {
							colorize: true,
						},
					},
				],
			},
		},
		dev: {
			module: '@sparkbot/plugin-logger',
			options: {
				loggingLevel: 'debug',
				transports: [
					{
						target: 'pino-pretty',
						options: {
							colorize: true,
						},
					},
				],
			},
		},
	},
};
