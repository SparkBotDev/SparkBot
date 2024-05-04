import { Events, type Interaction, type Client } from 'discord.js';

export const interactionCreateHandler: GatewayEventHandler = {
	type: Events.InteractionCreate,
	once: false,
	async execute(client: Client, interaction: Interaction) {
		let command: Command | MessageComponentSpark | undefined;

		if (interaction.isChatInputCommand()) {
			command = interaction.client.commands.get(interaction.commandName);
			if (!command) {
				client.logger.warn(
					`No command matching ${interaction.commandName} was found.`,
				);
				return;
			}
		} else if (interaction.isAutocomplete()) {
			const command = interaction.client.commands.get(interaction.commandName);
			if (!command) {
				client.logger.warn(
					`No command matching ${interaction.commandName} was found.`,
				);
				return;
			}

			try {
				if (!command.autocomplete) return;
				command.autocomplete(interaction);
			} catch (exception) {
				client.logger.warn(String(exception));
			}

			return;
		} else if (
			interaction.isModalSubmit() ||
			interaction.isButton() ||
			interaction.isStringSelectMenu()
		) {
			command = interaction.client.components.get(interaction.customId);
		}

		if (command) {
			const coolDown = interaction.client.coolDowns.get(
				`${command.name}-${interaction.user.username}`,
			);
			if (command.coolDownSeconds && coolDown) {
				if (Date.now() < coolDown) {
					await interaction.reply(
						`You have to wait ${Math.floor(
							Math.abs(Date.now() - coolDown) / 1000,
						)} second(s) to use this command again.`,
					);
					setTimeout(async () => interaction.deleteReply(), 5000);
					return;
				}

				interaction.client.coolDowns.set(
					`${command.name}-${interaction.user.username}`,
					Date.now() + command.coolDownSeconds * 1000,
				);
				setTimeout(() => {
					interaction.client.coolDowns.delete(
						`${command.name}-${interaction.user.username}`,
					);
				}, command.coolDownSeconds * 1000);
			} else if (command.coolDownSeconds && !coolDown) {
				interaction.client.coolDowns.set(
					`${command.name}-${interaction.user.username}`,
					Date.now() + command.coolDownSeconds * 1000,
				);
			}

			// @ts-expect-error I know I am typing something wrong, but I  also know this is ok
			command.execute(interaction);
		}
	},
};
