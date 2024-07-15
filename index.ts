import { Client, Collection, Events, REST, Routes } from 'discord.js';
import { loadConfig } from './lib/config';
import { initLogger } from './lib/logger';
import { sparkContainer, sparkLoader } from './lib/sparks';

// Get the config
const config = await loadConfig();

// Initialize a new Discord.js client
const client = new Client({
	intents: config.discordIntents,
	partials: config.enabledPartials,
	presence: config.defaultPresence,
});
sparkContainer.client = client;
client.config = config;
client.sparks = new Collection();
client.cooldowns = new Collection();
client.commands = [];
client.scheduledEvents = new Collection();

// Initialize logger
client.logger = await initLogger(client.config.loggingLibraryPlugin);
client.on(Events.Debug, (message) => {
	client.logger.debug(message);
});
client.on(Events.Warn, (message) => {
	client.logger.warn(message);
});
client.on(Events.Error, (message) => {
	client.logger.error(message);
});

// Load Sparks
await sparkLoader();

// Register commands
const rest = new REST({ version: '10' }).setToken(config.discordAPIKey);
await rest
	.put(Routes.applicationCommands(config.discordAppID), {
		body: client.commands.map((command) => command.toJSON()),
	})
	.then((data) => {
		if (data && typeof data === 'object' && 'length' in data)
			client.logger.info(`🔵 Registered ${String(data.length)} command(s)`);
	})
	.catch((exception: unknown) => {
		if (exception instanceof Error) {
			client.logger.error(exception);
		} else {
			client.logger.error(String(exception));
		}
	});

// Login
await client.login(config.discordAPIKey);
