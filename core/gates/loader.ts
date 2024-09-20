import { readdirSync } from 'node:fs';
import { extname, join } from 'node:path';
import { Collection } from 'discord.js';
import * as v from 'valibot';
import type { Gate } from './gate.ts';

const GateSchema = v.object({
	id: v.string(),
	check: v.function(),
});
export async function gateLoader() {
	const importPath = join(import.meta.dir, '../../gates/');
	const fileList = readdirSync(importPath, { recursive: true });

	const importedFiles: unknown[] = [];
	for (const file of fileList) {
		if (
			typeof file === 'string' &&
			extname(file) === '.ts' &&
			!file.includes('lib/')
		)
			importedFiles.push(import(join(importPath, file)) as unknown);
	}

	const gates = new Collection<string, Gate>();
	await Promise.all(importedFiles)
		.then((value) => {
			for (const module of value) {
				if (module && typeof module === 'object') {
					for (const item of Object.values(module)) {
						const validated = v.parse(GateSchema, item);
						gates.set(validated.id, validated as Gate);
					}
				}
			}
		})
		.catch((exception: unknown) => {
			if (exception instanceof Error) throw exception;
			throw new Error(String(exception));
		});

	return gates;
}