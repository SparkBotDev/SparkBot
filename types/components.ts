import type {
	AutocompleteInteraction,
	Client,
	ClientEvents,
	ContextMenuCommandBuilder,
	Interaction,
	SlashCommandBuilder,
} from 'discord.js';

/**
 * Defines a handler called by an emitted [Interaction](https://discord.com/developers/docs/interactions/receiving-and-responding#interactions)
 */
export interface SparkBotInteraction {
	id: string;
	cooldownSeconds?: number;
	callOnInteraction(interaction: Interaction): void;
}

/**
 * Extends {@link SparkBotInteraction} adding the interaction's command definition
 */
export interface SparkBotCommand extends SparkBotInteraction {
	command: SlashCommandBuilder | ContextMenuCommandBuilder;
	autocomplete?(interaction: AutocompleteInteraction): void;
}

/**
 * Defines a handler to be called when Discord emits a [gateway event](https://discord.com/developers/docs/topics/gateway-events#receive-events)
 */
export interface SparkBotGatewayEvent<Event extends keyof ClientEvents> {
	eventName: Event;
	once?: boolean | false;
	listener(...arguments_: ClientEvents[Event]): void;
}

/**
 * Defines a loader used on startup to retrieve and register SparkBot pieces.
 */
export interface SparkBotLoader {
	load(client: Client): void;
}

export interface SparkBotScheduledEvent {
	id: string;
	schedule: string[];
	timezone?: string;
	callOnSchedule: (client: Client) => void;
}
