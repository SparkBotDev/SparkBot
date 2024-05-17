import { join } from 'node:path';
import { REST, Routes, type Client } from 'discord.js';
import type { SparkBotLoader } from '../types/components.ts';
import { sparkLoad } from '../lib/spark-load.ts';
import { isSparkBotCommand, isSparkBotInteraction } from '../types/guards.ts';

export const commandRouter: SparkBotLoader = {
	async load(client: Client) {
		const interactions = await sparkLoad(
			join(import.meta.dir, '../components/interactions'),
		);

		const commandsToRegister = [];

		for (const interaction of interactions) {
			if (isSparkBotCommand(interaction)) {
				commandsToRegister.push(interaction.command);
				client.logger.info(
					`🔵 Command ${interaction.id} queued for registration`,
				);
			}

			if (isSparkBotInteraction(interaction)) {
				client.interactions.set(interaction.id, interaction);
				client.logger.info(`🟣 Interaction ${interaction.id} loaded`);
			}
		}

		// Register commands with Discord
		const rest = new REST({ version: '10' }).setToken(
			client.config.discordApiKey,
		);
		rest
			.put(Routes.applicationCommands(client.config.discordAppId), {
				body: commandsToRegister.map((command) => command.toJSON()),
			})
			.then((data: any) => {
				client.logger.info(`🔵 Registered ${data.length} command(s)`);
			})
			.catch((exception) => {
				if (exception instanceof Error) {
					client.logger.error(exception);
				} else {
					client.logger.error(String(exception));
				}
			});
	},
};
