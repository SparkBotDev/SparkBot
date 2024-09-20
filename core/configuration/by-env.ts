import * as v from 'valibot';

/**
 * Expands a schema into one that describes data in a prod/dev object
 * pair and transforms the data original input schema according to the
 * execution environment.
 * @param schema The schema to expand
 */
export function byEnv<const TSchema extends v.GenericSchema>(
	schema: TSchema,
): v.UnionSchema<
	[
		TSchema,
		v.SchemaWithPipe<
			[
				v.ObjectSchema<
					{ readonly prod: TSchema; readonly dev: TSchema },
					undefined
				>,
				v.TransformAction<
					{ prod: v.InferOutput<TSchema>; dev: v.InferOutput<TSchema> },
					v.InferOutput<TSchema>
				>,
			]
		>,
	],
	undefined
>;

export function byEnv(schema: v.GenericSchema) {
	return v.union([
		schema,
		v.pipe(
			v.object({ prod: schema, dev: schema }),
			v.transform(async (input) =>
				Bun.env.NODE_ENV?.toLowerCase() === 'production'
					? input.prod
					: input.dev,
			),
		),
	]);
}

/**
 * Expands an async schema into one that describes data in a prod/dev
 * object pair and transforms the data original input schema according
 * to the execution environment.
 */
export function byEnvAsync<const TSchema extends v.GenericSchemaAsync>(
	schema: TSchema,
): v.UnionSchemaAsync<
	[
		TSchema,
		v.SchemaWithPipeAsync<
			[
				v.ObjectSchemaAsync<
					{ readonly prod: TSchema; readonly dev: TSchema },
					undefined
				>,
				v.TransformActionAsync<
					{ prod: v.InferOutput<TSchema>; dev: v.InferOutput<TSchema> },
					v.InferOutput<TSchema>
				>,
			]
		>,
	],
	undefined
>;

export function byEnvAsync(schema: v.GenericSchemaAsync) {
	return v.unionAsync([
		schema,
		v.pipeAsync(
			v.objectAsync({ prod: schema, dev: schema }),
			v.transformAsync(async (input) =>
				Bun.env.NODE_ENV?.toLowerCase() === 'production'
					? input.prod
					: input.dev,
			),
		),
	]);
}
