import type {
	ContextMenuCommandBuilder,
	Interaction,
	SlashCommandBuilder,
} from 'discord.js';
import { sparkContainer } from './container.ts';
import { Spark } from './spark.ts';

export abstract class InteractionSpark extends Spark {
	abstract id: string;
	protected cooldownSecs?: number;

	isOnCooldown(interaction: Interaction) {
		const cooldown = interaction.client.cooldowns.get(
			`${this.id}-${interaction.user.id}`,
		);
		if (this.cooldownSecs && cooldown) {
			if (Date.now() < cooldown) {
				return true;
			}

			interaction.client.cooldowns.set(
				`${this.id}-${interaction.user.id}`,
				Date.now() + this.cooldownSecs * 1000,
			);
			setTimeout(() => {
				interaction.client.cooldowns.delete(
					`${this.id}-${interaction.user.id}`,
				);
			}, this.cooldownSecs * 1000);
		} else if (this.cooldownSecs) {
			interaction.client.cooldowns.set(
				`${this.id}-${interaction.user.id}`,
				Date.now() + this.cooldownSecs * 1000,
			);
		}

		return false;
	}

	override onLoad(): void {
		sparkContainer.client?.sparks.set(this.id, this);
		sparkContainer.client?.logger.info(
			`💬 Interaction ⚡️: ${this.id} registered.`,
		);
	}

	abstract override execute(interaction: Interaction): void;
}

export abstract class CommandSpark extends InteractionSpark {
	abstract command: SlashCommandBuilder | ContextMenuCommandBuilder;
	override onLoad(): void {
		super.onLoad();
		sparkContainer.client?.commands.push(this.command);
	}
}

export abstract class CommandSparkWithAutocomplete extends CommandSpark {
	abstract autocomplete(interaction: Interaction): void;
}
