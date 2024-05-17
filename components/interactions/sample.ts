import {
	PermissionFlagsBits,
	SlashCommandBuilder,
	type ChatInputCommandInteraction,
} from 'discord.js';
import type { SparkBotCommand } from '../../types/components.ts';

/*
 * It is best to build your command and then reference it to ensure correct types,
 * as discord.js chaining does not mutate the command, but returns new objects of
 * different types.
 */
const commandBuilder = new SlashCommandBuilder();
commandBuilder
	.setName('ping')
	.setDescription('A sample ping command')
	.setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export const command: SparkBotCommand = {
	id: commandBuilder.name,
	command: commandBuilder,

	async callOnInteraction(interaction: ChatInputCommandInteraction) {
		await interaction.reply({
			content: `🏓 Pong! \n 📡 Ping: ${interaction.client.ws.ping}`,
		});
	},
	cooldownSeconds: 10,
};
