import type { LoggerPlugin } from '@sparkbot/logger-plugin-interface';
import type { SecretsPlugin } from '@sparkbot/secrets-plugin-interface';
import type {
	SparkBotCommand,
	SparkBotGatewayEvent,
	SparkBotInteraction,
	SparkBotLoader,
	SparkBotScheduledEvent,
} from './components.ts';

export function isLoggerPlugin(
	object: unknown,
): object is new (client: unknown, options: unknown) => LoggerPlugin {
	return (object as typeof LoggerPlugin).prototype.error !== undefined;
}

export function isSecretsPlugin(
	object: unknown,
): object is new (options: unknown) => SecretsPlugin {
	return (object as typeof SecretsPlugin).prototype.get !== undefined;
}

export function isSparkBotGatewayEvent(
	object: unknown,
): object is SparkBotGatewayEvent<any> {
	return (object as SparkBotGatewayEvent<any>).listener !== undefined;
}

export function isSparkBotLoader(object: unknown): object is SparkBotLoader {
	return (object as SparkBotLoader).load !== undefined;
}

export function isSparkBotScheduledEvent(
	object: unknown,
): object is SparkBotScheduledEvent {
	return (object as SparkBotScheduledEvent).schedule !== undefined;
}

export function isSparkBotInteraction(
	object: unknown,
): object is SparkBotInteraction {
	return (object as SparkBotInteraction).callOnInteraction !== undefined;
}

export function isSparkBotCommand(object: unknown): object is SparkBotCommand {
	return (object as SparkBotCommand).command !== undefined;
}
