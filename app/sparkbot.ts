import process from 'node:process';
import { join } from 'node:path';
import { Client, Collection } from 'discord.js';
import type { LoggerPlugin } from '@sparkbot/logger-plugin-interface';
import { config } from './lib/configurator.js';
import { importObjects } from './lib/import-objects.js';

declare module 'discord.js' {
	// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
	interface Client {
		config: Config;
		logger: LoggerPlugin;
		commands: Collection<string, Command>;
		coolDowns: Collection<string, number>;
		components: Collection<string, MessageComponentSpark>;
	}
}

declare global {
	type Router = {
		execute(client: Client): void;
	};
}

/*
 * Initialize client
 */
const discordClient = new Client({ intents: config.discordIntents });
discordClient.config = config;

discordClient.commands = new Collection();
discordClient.coolDowns = new Collection();
discordClient.components = new Collection();

/*
 * Initialize and configure logger
 */
const importedLoggerObjects = await importObjects<
	new (options: unknown) => LoggerPlugin
>(discordClient.config.plugins.loggingLib.name);

const loggerPlugin = importedLoggerObjects[0];

if (loggerPlugin) {
	// eslint-disable-next-line new-cap
	discordClient.logger = new loggerPlugin(
		discordClient.config.plugins.loggingLib.options,
	);
}

process.on('uncaughtException', (error) => {
	discordClient.logger.error(
		new Error('Uncaught Exception:', { cause: error }),
	);
	process.exit(1);
});
process.on('unhandledRejection', (error) => {
	discordClient.logger.error(
		new Error('Unhandled promise rejection:', { cause: error }),
	);
	process.exit(1);
});

/*
 * Process routers
 */
const routers = await importObjects<Router>(join(import.meta.dir, '/routers'));

for (const router of routers) {
	router.execute(discordClient);
}

/*
 * Loggin to Discord
 */
await discordClient.login(config.discordAPIKey);
