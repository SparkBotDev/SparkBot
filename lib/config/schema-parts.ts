import * as v from 'valibot';
import { SecretsVault } from '@sparkbot/plugin-secrets';
import { secretsVaultPluginConfig } from '../../sparkbot.config.ts';
import { loadPlugin } from '../plugin-manager';

/**
 * A schema that defines a SecretVault plugin configuration which cannot
 * itself contain secrets.
 */
const vaultPlugin = v.object({
	module: v.string(),
	options: v.optional(v.record(v.string(), v.unknown())),
});

/**
 * A schema that defines a set of SecretVault plugin configurations by
 * environment and transforms them to a single plugin_ based on the
 * NODE_ENV setting.
 */
const vaultPluginByEnv = v.pipe(
	v.object({
		prod: vaultPlugin,
		dev: vaultPlugin,
	}),
	v.transform((input) => {
		if (Bun.env.NODE_ENV === 'production') {
			return input.prod;
		}

		return input.dev;
	}),
);

/** A schema that defines the final config options for the SecretVault */
const vaultPluginConfig = v.union([vaultPlugin, vaultPluginByEnv]);
export type SecretsVaultSchema = v.InferInput<typeof vaultPluginConfig>;
export type SecretsVaultConfig = v.InferOutput<typeof vaultPluginConfig>;

// Initialize the vault
const vaultConfig = v.parse(vaultPluginConfig, secretsVaultPluginConfig);
const secretsVault = await loadPlugin<SecretsVault>(
	SecretsVault,
	vaultConfig.module,
	vaultConfig.options,
);

// Remaining schemas

/**
 * A schema that defines a SparkBot configuration value, which can be a
 * string, or an object { secret: string } containing the name of the secret.
 * (This allows the use of descriptive key names in the secret vault.)
 *
 * @example key: 'someValue'
 * @example key: { secret: 'keyName' }
 */
export const value = v.pipeAsync(
	v.union([v.string(), v.object({ secretVaultKey: v.string() })]),
	v.transformAsync(async (input) => {
		if (typeof input === 'string') return input;
		return secretsVault.get(input.secretVaultKey);
	}),
);

/**
 * A schema that defines a set of values by environment and transforms
 * them to a single value based on the NODE_ENV setting.
 */
export const valueByEnv = v.pipeAsync(
	v.objectAsync({
		prod: value,
		dev: value,
	}),
	v.transform((input) => {
		if (Bun.env.NODE_ENV === 'production') {
			return input.prod;
		}

		return input.dev;
	}),
);

/**
 * A schema that defines a SparkBot plugin configuration item.
 */
export const plugin = v.objectAsync({
	module: value,
	options: v.optionalAsync(
		v.recordAsync(
			v.string(),
			v.pipeAsync(
				v.unknown(),
				v.transformAsync(async (input) => {
					await recurseValidate(input as Record<string, unknown>);
					return input;
				}),
			),
		),
	),
});

async function recurseValidate(data: Record<string, unknown>) {
	const checked = await v.safeParseAsync(value, data);
	if (checked.success) {
		return checked.output;
	}

	if (data && typeof data === 'object') {
		const keys = Object.keys(data);
		for (const key of keys) {
			data[key] = await recurseValidate(data[key] as Record<string, unknown>); // eslint-disable-line no-await-in-loop
		}
	}

	return data;
}

/**
 * A schema that defines a set of plugin configurations by environment
 * and transforms them to a single plugin_ based on the NODE_ENV setting.
 */
export const pluginByEnv = v.pipeAsync(
	v.objectAsync({
		prod: plugin,
		dev: plugin,
	}),
	v.transform((input) => {
		if (Bun.env.NODE_ENV === 'production') {
			return input.prod;
		}

		return input.dev;
	}),
);

/** A schema that defines the final value config */
export const valueConfig = v.unionAsync([value, valueByEnv]);

/** A schema that defines the final plugin config */
export const pluginConfig = v.unionAsync([plugin, pluginByEnv]);
