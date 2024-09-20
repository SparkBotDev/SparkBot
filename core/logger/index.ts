import process from 'node:process';
import { addSignal, registerHandler } from '@hypercliq/shutdown-cleanup';
import PinoPlugin, { LoggerPlugin } from '@sparkbot/plugin-logger'; // eslint-disable-line @typescript-eslint/naming-convention
import { Events, type Client } from 'discord.js';
import { loadPlugin } from '../plugin-manager';

type LoggerConfig = {
	module: string;
	options?: Record<string, unknown> | undefined;
};

export class Logger {
	logger: LoggerPlugin;

	constructor() {
		this.logger = new PinoPlugin({
			loggingLevel: 'debug',
			transports: [
				{
					target: 'pino-pretty',
					options: {
						colorize: true,
					},
				},
			],
		});

		// Register exits to log reason
		addSignal('SIGBREAK');
		addSignal('SIGQUIT');
		registerHandler(async (signal) => {
			console.log(`❌ Spark⚡️Bot process exited with signal: ${signal}`);
		}, 'logExit');

		// Register logger to log unhandled exceptions
		process.on('uncaughtException', (error) => {
			this.logger.error(new Error('Uncaught Exception:', { cause: error }));
			process.exit(1);
		});

		process.on('unhandledRejection', (error) => {
			this.logger.error(
				new Error('Unhandled promise rejection:', { cause: error }),
			);
			process.exit(1);
		});
	}

	async loadPlugin(config: LoggerConfig) {
		const Plugin = await loadPlugin<LoggerPlugin>(LoggerPlugin, config.module); // eslint-disable-line @typescript-eslint/naming-convention
		this.logger = new Plugin(config.options);
	}

	registerClientHandlers(client: Client) {
		client.on(Events.Debug, (message) => {
			client.logger.debug(message);
		});
		client.on(Events.Warn, (message) => {
			client.logger.warn(message);
		});
		client.on(Events.Error, (message) => {
			client.logger.error(message);
		});
	}

	error(exception: Error | string) {
		this.logger.error(exception);
	}

	warn(exception: Error | string) {
		this.logger.warn(exception);
	}

	info(exception: Error | string) {
		this.logger.info(exception);
	}

	debug(exception: Error | string) {
		this.logger.debug(exception);
	}
}
