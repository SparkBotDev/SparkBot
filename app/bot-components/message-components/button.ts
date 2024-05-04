import { type MessageComponentInteraction } from 'discord.js';

export const button: MessageComponentSpark = {
	name: 'button',
	async execute(interaction: MessageComponentInteraction) {
		await interaction.reply({
			content: 'You pushed a button',
		});
	},
	coolDownSeconds: 10,
};
