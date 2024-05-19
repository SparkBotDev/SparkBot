import { GatewayIntentBits } from 'discord.js';
import * as v from 'valibot';

/**
 * A string that can be different in prod/dev environments.
 */
const string_ = v.transform(
	v.union([
		v.string(),
		v.object({
			prod: v.string(),
			dev: v.string(),
		}),
	]),
	(input) => {
		if (typeof input === 'string') {
			return input;
		}

		if (Bun.env.NODE_ENV === 'production') {
			return input.prod;
		}

		return input.dev;
	},
);

/**
 * An object containing the name and options of a plugin, can be different
 * in prod/dev environments.
 */
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

export const configSchema = v.object(
	{
		discordApiKey: string_,
		discordAppId: string_,
		discordIntents: v.array(v.enum_(GatewayIntentBits)),
		secretsVault: plugin_,
		loggingLib: plugin_,
		channelMap: v.optional(v.record(string_)),
	},
	v.unknown(),
);

/**
 * Defines the layout of the user configuration for SparkBot
 */
export type Configuration = v.Input<typeof configSchema>;

/**
 * Defines the final transformed configuration used in the application
 */
export type SparkBotConfig = v.Output<typeof configSchema>;

export const SECRET = '*secret*'; // eslint-disable-line @typescript-eslint/naming-convention
