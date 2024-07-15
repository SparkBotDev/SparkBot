import * as v from 'valibot';
import {
	isClass,
	doesClassExtend,
	type AbstractConstructor,
} from '../../types/guards';

const moduleSchema = v.object({
	default: v.unknown(),
});

export async function loadPlugin<T>(
	type: AbstractConstructor,
	module: string,
	options?: Record<string, unknown>,
) {
	return import(module)
		.then((value: unknown) => {
			const plugin = v.parse(moduleSchema, value);
			if (isClass<T>(plugin.default) && doesClassExtend(plugin.default, type)) {
				return new plugin.default(options); // eslint-disable-line new-cap
			}

			throw new Error(`Plugin ${module} is not a valid class constructor.`);
		})
		.catch((exception: unknown) => {
			if (exception instanceof Error) {
				throw exception;
			}

			throw new Error(String(exception));
		});
}
