import { join } from 'node:path';
import { Client, Collection, Partials } from 'discord.js';
import { config } from './lib/configurator.ts';
import { isLoggerPlugin, isSparkBotLoader } from './types/guards.ts';
import { sparkLoad } from './lib/spark-load.ts';

/*
 * Initialize client
 */
const sparkBotClient = new Client({
	intents: config.discordIntents,
	partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});
sparkBotClient.config = config;

sparkBotClient.interactions = new Collection();
sparkBotClient.cooldowns = new Collection();
sparkBotClient.scheduledEvents = new Collection();

/*
 * Get logger plugin and initialize
 */
await import(config.loggingLib.name)
	.then((contents: Record<string, unknown>) => {
		const Logger = contents['Logger']; // eslint-disable-line @typescript-eslint/naming-convention
		if (isLoggerPlugin(Logger)) {
			sparkBotClient.logger = new Logger(
				sparkBotClient,
				config.loggingLib.options,
			);
		} else {
			throw new Error('Invalid SecretsPlugin');
		}
	})
	.catch((exception) => {
		if (exception instanceof Error) {
			throw exception;
		}

		throw new Error(String(exception));
	});

/*
 * Process loaders
 */
const loaders = await sparkLoad(join(import.meta.dir, './loaders'));
for (const loader of loaders) {
	if (isSparkBotLoader(loader)) {
		loader.load(sparkBotClient);
	}
}

/*
 * Login to Discord servers
 */
await sparkBotClient.login(config.discordApiKey);
