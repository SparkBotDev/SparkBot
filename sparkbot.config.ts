import { GatewayIntentBits } from 'discord.js';
import { LoggerLevel } from '@sparkbot/logger-plugin-interface';
import { type Configuration, SECRET } from './types/config.ts';

export const config: Configuration = {
	discordApiKey: SECRET,
	discordAppId: SECRET,
	discordIntents: [GatewayIntentBits.Guilds],
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
};
