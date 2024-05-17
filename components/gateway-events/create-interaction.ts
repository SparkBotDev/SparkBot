import { Events, type Interaction } from 'discord.js';
import type { SparkBotGatewayEvent } from '../../types/components.ts';
import { isSparkBotCommand } from '../../types/guards.ts';

export const event: SparkBotGatewayEvent<Events.InteractionCreate> = {
	eventName: Events.InteractionCreate,
	async listener(interaction: Interaction) {
		let interactionHandler;

		if (
			interaction.isChatInputCommand() ||
			interaction.isContextMenuCommand()
		) {
			interactionHandler = interaction.client.interactions.get(
				interaction.commandName,
			);
			if (!interactionHandler) {
				interaction.client.logger.warn(
					`No command matching ${interaction.commandName} was found.`,
				);
				return;
			}
		} else if (
			interaction.isModalSubmit() ||
			interaction.isButton() ||
			interaction.isStringSelectMenu()
		) {
			interactionHandler = interaction.client.interactions.get(
				interaction.customId,
			);
			if (!interactionHandler) {
				interaction.client.logger.warn(
					`No interaction matching ${interaction.customId} was found.`,
				);
				return;
			}
		} else if (interaction.isAutocomplete()) {
			const interactionHandler = interaction.client.interactions.get(
				interaction.commandName,
			);
			if (!interactionHandler || !isSparkBotCommand(interactionHandler)) {
				interaction.client.logger.warn(
					`Autocomplete: No command matching ${interaction.commandName} was found.`,
				);
				return;
			}

			try {
				if (!interactionHandler.autocomplete) return;
				interactionHandler.autocomplete(interaction);
			} catch (exception) {
				interaction.client.logger.warn(`Autocomplete: ${String(exception)}`);
			}

			return;
		}

		if (interactionHandler) {
			const cooldown = interaction.client.cooldowns.get(
				`${interactionHandler.id}-${interaction.user.username}`,
			);
			if (interactionHandler.cooldownSeconds && cooldown) {
				if (Date.now() < cooldown) {
					await interaction.reply({
						content: `You must wait ${Math.floor(
							Math.abs(Date.now() - cooldown) / 1000,
						)} second(s) to use this command again.`,
						ephemeral: true,
					});
					setTimeout(async () => interaction.deleteReply(), 5000);
					return;
				}

				interaction.client.cooldowns.set(
					`${interactionHandler.id}-${interaction.user.username}`,
					Date.now() + interactionHandler.cooldownSeconds * 1000,
				);
				setTimeout(() => {
					interaction.client.cooldowns.delete(
						`${interactionHandler.name}-${interaction.user.username}`,
					);
				}, interactionHandler.cooldownSeconds * 1000);
			} else if (interactionHandler.cooldownSeconds && !cooldown) {
				interaction.client.cooldowns.set(
					`${interactionHandler.id}-${interaction.user.username}`,
					Date.now() + interactionHandler.cooldownSeconds * 1000,
				);
			}

			interactionHandler.callOnInteraction(interaction);
		}
	},
};
