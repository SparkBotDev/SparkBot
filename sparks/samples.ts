import {
	type Client,
	PermissionFlagsBits,
	SlashCommandBuilder,
	type ChatInputCommandInteraction,
} from 'discord.js';
import { CommandSpark, ScheduledEventSpark } from '../lib/sparks';

/*
	It is best to create the command, and then set its options to provide
	correct typings
*/
const pingCommand = new SlashCommandBuilder();
pingCommand
	.setName('ping')
	.setDescription('A basic ping command for demonstration.')
	.setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export class Ping extends CommandSpark {
	id = pingCommand.name;
	override command = pingCommand;
	protected override cooldownSecs = 10;

	async execute(interaction: ChatInputCommandInteraction) {
		await interaction.reply({
			content: `🏓 Pong! \n 📡 Ping: ${interaction.client.ws.ping}`,
		});
	}
}

export class ScheduledEvent extends ScheduledEventSpark {
	id = 'sample-event';
	protected override schedule = ['*/5 * * * *'];
	override execute(client: Client): void {
		client.logger.debug('Scheduled event tick every 5 minutes');
	}
}
