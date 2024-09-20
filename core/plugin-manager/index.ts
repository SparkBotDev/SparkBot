import * as v from 'valibot';

type Arguments = readonly unknown[];
type Constructor<A extends Arguments = readonly any[], R = any> = new (
	...args: A
) => R;
type AbstractConstructor<
	A extends Arguments = readonly any[],
	R = any,
> = abstract new (...args: A) => R;

const PluginModuleSchema = v.object({
	default: v.custom<Constructor>(
		(input) =>
			typeof input === 'function' && typeof input.prototype === 'object',
	),
});

export async function loadPlugin<T>(type: AbstractConstructor, module: string) {
	return import(module)
		.then((value: unknown) => {
			const plugin = v.parse(PluginModuleSchema, value);
			if (isClass<T>(plugin.default) && doesClassExtend(plugin.default, type))
				return plugin.default;

			throw new Error(`Plugin ${module} is not a valid class constructor.`);
		})
		.catch((exception: unknown) => {
			if (exception instanceof Error) {
				throw exception;
			}

			throw new Error(String(exception));
		});
}

/**
 * Verify if an object is a class constructor.
 * @param input The function to verify
 */
export function isClass<T>(input: unknown): input is new (...args: any[]) => T {
	return typeof input === 'function' && typeof input.prototype === 'object';
}

/**
 * Verifies that a class extends another class
 * @param value Class to check
 * @param base Class to compare to
 * @returns boolean
 */
export function doesClassExtend<T>(value: Constructor, base: T) {
	let constructor: Constructor | null = value;
	while (constructor !== null) {
		if (constructor === base) return true;
		constructor = Object.getPrototypeOf(constructor); // eslint-disable-line @typescript-eslint/no-unsafe-assignment
	}

	return false;
}
