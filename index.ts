import { join } from 'node:path';
import { Database } from 'bun:sqlite';
import { Client, Collection } from 'discord.js';
import { drizzle } from 'drizzle-orm/bun-sqlite';
import { migrate } from 'drizzle-orm/bun-sqlite/migrator';
import { config } from './lib/configurator.ts';
import { isLoggerPlugin, isSparkBotLoader } from './types/guards.ts';
import { sparkLoad } from './lib/spark-load.ts';
import * as dbSchema from './db/schema.ts';

/*
 * Initialize client
 */
const client = new Client({
	intents: config.intents,
	partials: config.partials,
});
client.config = config;

client.interactions = new Collection();
client.cooldowns = new Collection();
client.scheduledEvents = new Collection();

/*
 * Get logger plugin and initialize
 */
await import(config.loggingLib.name)
	.then((contents: Record<string, unknown>) => {
		const Logger = contents['Logger']; // eslint-disable-line @typescript-eslint/naming-convention
		if (isLoggerPlugin(Logger)) {
			client.logger = new Logger(client, config.loggingLib.options);
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
 * Initialize database
 */
if (config.dbEnabled) {
	const database = new Database('./db/database.db');
	client.db = {
		orm: drizzle(database, { schema: dbSchema }),
		schemas: dbSchema,
	};
	migrate(client.db.orm, { migrationsFolder: './db/drizzle' });
}

/*
 * Process loaders
 */
const loaders = await sparkLoad(join(import.meta.dir, './loaders'));
for (const loader of loaders) {
	if (isSparkBotLoader(loader)) {
		loader.load(client);
	}
}

/*
 * Login to Discord servers
 */
await client.login(config.discordApiKey);
