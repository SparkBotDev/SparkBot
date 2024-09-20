import * as v from 'valibot';
import { SecretsVault } from '@sparkbot/plugin-secrets';
import { loadPlugin } from '../plugin-manager';
import { secretsVaultPluginConfig } from '../../.sparkbot.config.js';

/**
 * A schema that describes the configuration of a secrets vault plugin.
 */
const SecretsVaultPluginConfigSchema = v.object({
	module: v.string(),
	options: v.optional(v.record(v.string(), v.unknown())),
});

export type SecretsVaultPluginConfig = v.InferInput<
	typeof SecretsVaultPluginConfigSchema
>;

/**
 * Creates a schema that describes a secret value transformation, which
 * takes a key as input and transforms it into the value retrieved from
 * the configured secrets vault.
 */
export async function createSecretSchema() {
	// Initialize the vault plugin
	const vaultConfig = v.parse(
		SecretsVaultPluginConfigSchema,
		secretsVaultPluginConfig,
	);

	// eslint-disable-next-line @typescript-eslint/naming-convention
	const SecretsVaultPlugin = await loadPlugin<SecretsVault>(
		SecretsVault,
		vaultConfig.module,
	);
	const secretsVault = new SecretsVaultPlugin(vaultConfig.options);

	return v.pipeAsync(
		v.object({ secretVaultKey: v.string() }),
		v.transformAsync(async (input) => secretsVault.get(input.secretVaultKey)),
	);
}
