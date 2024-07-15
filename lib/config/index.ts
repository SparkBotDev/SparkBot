import { ActivityType, GatewayIntentBits, Partials } from 'discord.js';
import * as v from 'valibot';
import { sparkBotConfig } from '../../sparkbot.config.ts';
import { pluginConfig, valueConfig } from './schema-parts.ts';

/**
 * Main SparkBot configuration schema. Transforms secrets into correct
 * values from SecretsVault.get()
 */
const sparkBotConfigSchema = v.objectAsync({
	discordAPIKey: valueConfig,
	discordAppID: valueConfig,
	discordIntents: v.array(v.enum_(GatewayIntentBits)),
	enabledPartials: v.array(v.enum_(Partials)),
	defaultPresence: v.object({
		status: v.picklist(['online', 'idle', 'dnd', 'invisible']),
		activities: v.array(
			v.object({
				name: v.string(),
				type: v.enum_(ActivityType),
			}),
		),
	}),
	loggingLibraryPlugin: pluginConfig,
	channelMap: v.optionalAsync(v.recordAsync(v.string(), valueConfig)),
});

export async function loadConfig() {
	return v.parseAsync(sparkBotConfigSchema, sparkBotConfig);
}

/**
 * Defines the configuration object specified in sparkbot.config.ts
 */
export type SparkBotSchema = v.InferInput<typeof sparkBotConfigSchema>;

/**
 * Defines the parsed configuration of Spark⚡️Bot.
 */
export type SparkBotConfig = v.InferOutput<typeof sparkBotConfigSchema>;

export type PluginConfig = v.InferOutput<typeof pluginConfig>;
export type { SecretsVaultSchema } from './schema-parts.ts';
