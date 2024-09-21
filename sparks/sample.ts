import {
	type Client,
	PermissionFlagsBits,
	SlashCommandBuilder,
	type ChatInputCommandInteraction,
} from 'discord.js';
import { CommandSpark, ScheduledEventSpark } from '../core/sparks';

/*
 * Chaining the command as per the Discord.js documentation will create type
 * issues in some cases. Therefore it is best to create the builder and then
 * set the properties.
 */
const pingCommand = new SlashCommandBuilder();
pingCommand
	.setName('ping')
	.setDescription('A basic ping command for demonstration.')
	.setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export class Ping extends CommandSpark {
	id = pingCommand.name;
	command = pingCommand;
	gates = {};

	async execute(interaction: ChatInputCommandInteraction) {
		await interaction.reply({
			content: `🏓 Pong! \n 📡 Ping: ${interaction.client.ws.ping}`,
		});
	}
}

export class ScheduledEvent extends ScheduledEventSpark {
	id = 'sample-event';
	schedule = ['*/5 * * * *'];
	timezone = 'system'; // See https://github.com/moment/luxon/blob/master/docs/zones.md#specifying-a-zone
	gates = {};

	execute(client: Client): void {
		client.logger.debug('Scheduled event tick every 5 minutes');
	}
}
