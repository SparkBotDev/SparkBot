import { GatewayIntentBits } from 'discord.js';
import { LoggerLevel } from '@sparkbot/logger-plugin-interface';

export const config: SparkBotConfig = {
	discordAPIKey: '*secret*',
	discordAppID: '*secret*',
	discordIntents: GatewayIntentBits.Guilds,
	plugins: {
		secretsVault: {
			name: '@sparkbot/secrets-environment',
		},
		loggingLib: {
			prod: {
				name: '@sparkbot/logger-console',
				options: { loggingLevel: LoggerLevel.info },
			},
			dev: {
				name: '@sparkbot/logger-console',
				options: { loggingLevel: LoggerLevel.debug },
			},
		},
	},
};
