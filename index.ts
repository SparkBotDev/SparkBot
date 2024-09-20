import type { CronJob } from 'cron';
import {
	Client,
	Collection,
	type ContextMenuCommandBuilder,
	REST,
	Routes,
	type SlashCommandBuilder,
} from 'discord.js';
import { getConfig, type Config } from './core/configuration';
import { gateLoader, type Gate } from './core/gates';
import { logException } from './core/helpers';
import { Logger } from './core/logger';
import { appConfig } from './.sparkbot.config';
import {
	type CommandSpark,
	type InteractionSpark,
	sparkLoader,
} from './core/sparks';

/* Spark⚡️Bot is designed to run with Bun and will have errors if run in a
   different environment. */
if (!Bun) {
	throw new Error('Must be run with Bun');
}

// Initialize Logger
const logger = new Logger();

// Get parsed config
let config: Config;
try {
	config = await getConfig(appConfig);
} catch (exception) {
	throw logException(exception, logger);
}

// Initialize user-configured logger
try {
	await logger.loadPlugin(config.loggingLibraryPlugin);
} catch (exception) {
	throw logException(exception, logger);
}

// Initialize Discord.js client
declare module 'discord.js' {
	interface Client {
		config: Config;
		interactions: Collection<string, InteractionSpark | CommandSpark>;
		gates: Collection<string, Gate>;
		logger: Logger;
		scheduledEvents: Collection<string, CronJob>;
	}
}

const discordClient = new Client({
	intents: config.discordIntents,
	partials: config.enabledPartials,
	presence: config.defaultPresence,
});
discordClient.config = config;
discordClient.logger = logger;
logger.registerClientHandlers(discordClient);
discordClient.scheduledEvents = new Collection();

// Load gates
try {
	discordClient.gates = await gateLoader();
} catch (exception) {
	throw logException(exception, logger);
}

// Load sparks
discordClient.interactions = new Collection<
	string,
	InteractionSpark | CommandSpark
>();
try {
	await sparkLoader(discordClient);
} catch (exception) {
	throw logException(exception, logger);
}

const commands: Array<SlashCommandBuilder | ContextMenuCommandBuilder> = [];
discordClient.interactions.each((interaction) => {
	if ('command' in interaction) {
		commands.push(interaction.command);
	}
});
if (commands.length > 0) {
	const rest = new REST({ version: '10' }).setToken(config.discordAPIKey);
	const route = Routes.applicationCommands(config.discordAppID);

	try {
		await rest
			.put(route, {
				body: commands.map((command) => command.toJSON()),
			})
			.then((data) => {
				if (data && typeof data === 'object' && 'length' in data)
					logger.info(`🔵 Registered ${String(data.length)} command(s)`);
			})
			.catch((exception: unknown) => {
				logException(exception, logger);
			});
	} catch (exception) {
		logException(exception, logger);
	}
}

// Login to Discord
try {
	await discordClient.login(config.discordAPIKey);
} catch (exception) {
	throw logException(exception, logger);
}
