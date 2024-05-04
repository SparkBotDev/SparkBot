import { join } from 'node:path';
import {
	REST,
	Routes,
	type Client,
	type SlashCommandBuilder,
	type AutocompleteInteraction,
	type ChatInputCommandInteraction,
} from 'discord.js';
import { importObjects } from '../lib/import-objects.js';

declare global {
	type Command = {
		name: string;
		command: SlashCommandBuilder;
		execute: (interaction: ChatInputCommandInteraction) => void;
		autocomplete?: (interaction: AutocompleteInteraction) => void;
		coolDownSeconds?: number;
		serverID?: number;
	};
}

export const commandRouter: Router = {
	async execute(client: Client) {
		const commands = await importObjects<Command>(
			join(import.meta.dir, '../bot-components/commands'),
		);

		const commandsToRegister = [];
		for (const command of commands) {
			commandsToRegister.push(command.command);
			client.commands.set(command.command.name, command);
		}

		// Register commands
		const rest = new REST({ version: '10' }).setToken(
			client.config.discordAPIKey,
		);
		rest
			.put(Routes.applicationCommands(client.config.discordAppID), {
				body: commandsToRegister.map((command) => command.toJSON()),
			})
			.then((data: any) => {
				client.logger.info(`🔵 Registered ${data.length} slash command(s)`);
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
