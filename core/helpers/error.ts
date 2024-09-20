import type { Logger } from '../logger';

export function logException(exception: unknown, logger: Logger) {
	if (exception instanceof Error) {
		logger.error(exception);
		return exception;
	}

	logger.error(String(exception));
	return new Error(String(exception));
}
