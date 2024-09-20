import type {
	ContextMenuCommandBuilder,
	Interaction,
	SlashCommandBuilder,
} from 'discord.js';
import { Spark } from './spark.ts';

export abstract class InteractionSpark extends Spark {
	abstract id: string;
	register(): void {
		this.client.interactions.set(this.id, this);
		this.client?.logger.info(`💬 Interaction ⚡️: ${this.id} registered.`);
	}

	abstract override execute(interaction: Interaction): void;
}

export abstract class CommandSpark extends InteractionSpark {
	abstract command: SlashCommandBuilder | ContextMenuCommandBuilder;
}

export abstract class CommandSparkWithAutocomplete extends CommandSpark {
	abstract autocomplete(interaction: Interaction): void;
}
