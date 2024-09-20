import * as v from 'valibot';
import { createSecretSchema } from './secrets.ts';

/**
 * A schema that describes a Discord snowflake.
 * @see {@link https://discord.com/developers/docs/reference#snowflakes}
 */
export const SnowflakeConfigSchema = v.config(
	v.pipe(
		v.string(),
		v.minLength(17),
		v.maxLength(19),
		v.check((data) => {
			try {
				BigInt(data);
				return true;
			} catch {
				return false;
			}
		}),
	),
	{
		message:
			'Invalid snowflake: A snowflake must be a bigint represented as a string 17-19 digits.',
	},
);

const SecretSchema = await createSecretSchema();
/**
 * A schema that describes a string value that may be specified directly
 * or retrieved from a secrets vault.
 */
export const SecretValueConfigSchema = v.unionAsync([v.string(), SecretSchema]);

type PluginOptions =
	| string
	| number
	| boolean
	| v.InferInput<typeof SecretSchema>
	| PluginOptions[]
	| { [key: string]: PluginOptions };

/**
 * A schema that describes plugin options.
 */
const PluginOptionsSchema: v.GenericSchemaAsync<PluginOptions> = v.unionAsync([
	v.string(),
	v.number(),
	v.boolean(),
	SecretSchema,
	v.arrayAsync(v.lazyAsync(async () => PluginOptionsSchema)),
	v.recordAsync(
		v.string(),
		v.lazyAsync(async () => PluginOptionsSchema),
	),
]);

/**
 * A schema that describes the configuration of a plugin.
 */
export const PluginConfigSchema = v.objectAsync({
	module: v.string(),
	options: v.optionalAsync(v.recordAsync(v.string(), PluginOptionsSchema)),
});
