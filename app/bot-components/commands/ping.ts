import {
	EmbedBuilder,
	SlashCommandBuilder,
	type ChatInputCommandInteraction,
} from 'discord.js';

export const ping: Command = {
	name: 'ping',
	command: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Simple ping command'),
	async execute(interaction: ChatInputCommandInteraction) {
		await interaction.reply({
			embeds: [
				new EmbedBuilder().setDescription(
					`🏓 Pong! \n 📡 Ping: ${interaction.client.ws.ping}`,
				),
			],
		});
	},
	coolDownSeconds: 10,
};
