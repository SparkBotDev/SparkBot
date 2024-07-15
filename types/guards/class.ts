/**
 * Verify if an object is a class constructor.
 * @param input The function to verify
 */
export function isClass<T>(input: unknown): input is new (...args: any[]) => T {
	return typeof input === 'function' && typeof input.prototype === 'object';
}

/**
 * A readonly array of any values.
 */
export type Args = readonly unknown[];

/**
 * A generic constructor with parameters
 */
export type Constructor<A extends Args = readonly any[], R = any> = new (
	...args: A
) => R;

/**
 * A generic constructor with parameters
 */
export type AbstractConstructor<
	A extends Args = readonly any[],
	R = any,
> = abstract new (...args: A) => R;

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
