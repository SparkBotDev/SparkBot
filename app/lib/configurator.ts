import { GatewayIntentBits } from 'discord.js';
import * as v from 'valibot';
import type { SecretsPlugin } from '@sparkbot/secrets-plugin-interface';
import { config } from '../sparkbot.config.js';
import { importObjects } from './import-objects.js';

/*
 * Define the shape of the SparkBotConfig
 */

const string_ = v.transform(
	v.union([
		v.string(),
		v.object({
			prod: v.object({
				key: v.string(),
			}),
			dev: v.object({
				key: v.string(),
			}),
		}),
	]),
	(input) => {
		if (typeof input === 'string') {
			return input;
		}

		if (Bun.env.NODE_ENV === 'production') {
			return input.prod.key;
		}

		return input.dev.key;
	},
);

const plugin_ = v.transform(
	v.union([
		v.object({
			name: v.string(),
			options: v.optional(v.object({}, v.unknown()), {}),
		}),
		v.object({
			prod: v.object({
				name: v.string(),
				options: v.optional(v.object({}, v.unknown()), {}),
			}),
			dev: v.object({
				name: v.string(),
				options: v.optional(v.object({}, v.unknown()), {}),
			}),
		}),
	]),
	(input) => {
		if ('name' in input) {
			return { name: input.name, options: input.options };
		}

		if (Bun.env.NODE_ENV === 'production') {
			return { name: input.prod.name, options: input.prod.options };
		}

		return { name: input.dev.name, options: input.dev.options };
	},
);

const configSchema = v.object(
	{
		discordAPIKey: string_,
		discordAppID: string_,
		discordIntents: v.enum_(GatewayIntentBits),
		plugins: v.object({
			secretsVault: plugin_,
			loggingLib: plugin_,
		}),
	},
	v.unknown(),
);

declare global {
	type SparkBotConfig = v.Input<typeof configSchema>;
	type Config = v.Output<typeof configSchema>;
}

async function swapSecrets(
	config: Record<string, unknown>,
	secretsVault: SecretsPlugin,
) {
	for (const key of Object.keys(config)) {
		if (config[key] === '*secret*') {
			config[key] = await secretsVault.get(key); // eslint-disable-line no-await-in-loop
		}

		if (typeof config[key] === 'object' && config[key] !== null) {
			await swapSecrets(config[key] as Record<string, unknown>, secretsVault); // eslint-disable-line no-await-in-loop
		}
	}
}

const validatedConfig = v.parse(configSchema, config);

const importedObjects = await importObjects<
	new (options: unknown) => SecretsPlugin
>(validatedConfig.plugins.secretsVault.name);

const secretsPlugin = importedObjects[0];

if (secretsPlugin) {
	// eslint-disable-next-line new-cap
	const secrets = new secretsPlugin(
		validatedConfig.plugins.secretsVault.options,
	);
	await swapSecrets(validatedConfig, secrets);
}

export { validatedConfig as config };
