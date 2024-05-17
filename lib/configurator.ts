import { join } from 'node:path';
import { parse } from 'valibot';
import type { SecretsPlugin } from '@sparkbot/secrets-plugin-interface';
import { configSchema, type SparkBotConfig } from '../types/config.ts';
import { isSecretsPlugin } from '../types/guards.ts';

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

async function parseConfig(configPath: string) {
	const config = (await import(configPath)) as Record<string, unknown>;
	const parsedConfig = parse(configSchema, config['config']);

	return import(parsedConfig.secretsVault.name)
		.then(async (contents: Record<string, unknown>) => {
			const SecretsPlugin = contents['SecretsVault']; // eslint-disable-line @typescript-eslint/naming-convention
			if (isSecretsPlugin(SecretsPlugin)) {
				const secrets = new SecretsPlugin(parsedConfig.secretsVault.options);
				await swapSecrets(parsedConfig, secrets);

				return parsedConfig;
			}

			throw new Error('Invalid SecretsPlugin');
		})
		.catch((exception: unknown) => {
			if (exception instanceof Error) {
				throw exception;
			}

			throw new Error(String(exception));
		});
}

export const config: SparkBotConfig = await parseConfig(
	join(import.meta.dir, '../sparkbot.config.ts'),
);
