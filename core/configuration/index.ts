import { ActivityType, GatewayIntentBits, Partials } from 'discord.js';
import * as v from 'valibot';
import * as s from './schema-pieces.ts';
import { byEnvAsync } from './by-env.ts';

/**
 * A schema that describes the configuration of a Spark⚡️Bot
 */
const SparkBotConfigSchema = v.objectAsync({
	discordAPIKey: byEnvAsync(s.SecretValueConfigSchema),
	discordAppID: byEnvAsync(s.SecretValueConfigSchema),
	discordIntents: v.array(v.enum(GatewayIntentBits)),
	enabledPartials: v.array(v.enum(Partials)),
	defaultPresence: v.object({
		status: v.picklist(['online', 'idle', 'dnd', 'invisible']),
		activities: v.array(
			v.object({
				name: v.string(),
				type: v.enum_(ActivityType),
			}),
		),
	}),
	loggingLibraryPlugin: byEnvAsync(s.PluginConfigSchema),
});

/**
 * Defines the configuration object specified in sparkbot.config.ts
 */
export type SparkBotConfig = v.InferInput<typeof SparkBotConfigSchema>;

/**
 * Export parsed configuration.
 */
export async function getConfig(config: SparkBotConfig) {
	return v.parseAsync(SparkBotConfigSchema, config);
}

export type Config = v.InferOutput<typeof SparkBotConfigSchema>;
export type { SecretsVaultPluginConfig } from './secrets.ts';
