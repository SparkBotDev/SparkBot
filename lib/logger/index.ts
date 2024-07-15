import process from 'node:process';
import { Logger } from '@sparkbot/plugin-logger';
import { loadPlugin } from '../plugin-manager';
import type { PluginConfig } from '../config';

export async function initLogger(config: PluginConfig) {
	const loggingLibraryPlugin = await loadPlugin<Logger>(
		Logger,
		config.module,
		config.options,
	);

	// Register logger to log unhandled exceptions
	process.on('uncaughtException', (error) => {
		loggingLibraryPlugin.error(
			new Error('Uncaught Exception:', { cause: error }),
		);
		process.exit(1);
	});
	process.on('unhandledRejection', (error) => {
		loggingLibraryPlugin.error(
			new Error('Unhandled promise rejection:', { cause: error }),
		);
		process.exit(1);
	});

	return loggingLibraryPlugin;
}
