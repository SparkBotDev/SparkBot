import { readdirSync } from 'node:fs';
import { extname, join } from 'node:path';
import { doesClassExtend, isClass } from '../../types/guards';
import { Spark } from './spark.ts';

export async function sparkLoader() {
	const importPath = join(import.meta.dir, '../../sparks/');
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

	await Promise.all(importedFiles)
		.then((value) => {
			for (const module of value) {
				if (module && typeof module === 'object') {
					for (const item of Object.values(module)) {
						if (isClass(item) && doesClassExtend(item, Spark)) {
							const instance = new item(); // eslint-disable-line new-cap
							// eslint-disable-next-line max-depth
							if (instance instanceof Spark) {
								instance.onLoad();
							}
						}
					}
				}
			}
		})
		.catch((exception: unknown) => {
			if (exception instanceof Error) throw exception;
			throw new Error(String(exception));
		});
}
