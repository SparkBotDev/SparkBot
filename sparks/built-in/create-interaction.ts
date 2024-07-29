import { Events, type Interaction } from 'discord.js';
import {
	CommandSparkWithAutocomplete,
	GatewayEventSpark,
} from '../../lib/sparks';

/**
 * The Interaction Create event is emitted any time a user interacts with
 * the application via command or component.
 *
 * This handler routes interactions to the correct Spark for processing.
 * @see https://discord.com/developers/docs/topics/gateway-events#interaction-create
 */
export class Event extends GatewayEventSpark<Events.InteractionCreate> {
	override eventType = Events.InteractionCreate as const;
	override execute(interaction: Interaction) {
		let id = '';
		if (interaction.isCommand() || interaction.isAutocomplete())
			id = interaction.commandName;
		if (interaction.isMessageComponent()) id = interaction.customId;
		const spark = interaction.client.sparks.get(id);

		if (!spark) {
			interaction.client.logger.warn(
				`Interaction: ${id} was not found in collection.`,
			);

			if (interaction.isCommand() || interaction.isMessageComponent())
				void interaction.reply({
					content: 'Command not found',
					ephemeral: true,
				});

			return;
		}

		if (interaction.isCommand() || interaction.isMessageComponent()) {
			if (spark?.isOnCooldown(interaction)) {
				void interaction.reply({
					content: 'Command is on cooldown, please try again later.',
					ephemeral: true,
				});
			} else {
				spark.execute(interaction);
			}
		} else if (
			interaction.isAutocomplete() &&
			spark instanceof CommandSparkWithAutocomplete
		) {
			try {
				spark.autocomplete(interaction);
			} catch (exception) {
				interaction.client.logger.warn(`Autocomplete: ${String(exception)}`);
			}
		}
	}
}
