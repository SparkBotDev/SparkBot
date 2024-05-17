import { readdirSync, statSync } from 'node:fs';
import * as path from 'node:path';

export async function sparkLoad(importPath: string) {
	const stat = statSync(importPath, { throwIfNoEntry: false });
	const importedFiles = [];

	if (stat?.isDirectory()) {
		for (const file of readdirSync(importPath, {
			recursive: true,
		}) as string[]) {
			if (
				!file.split(path.sep).includes('lib') &&
				path.extname(file) === '.ts'
			) {
				importedFiles.push(import(path.join(importPath, file)));
			}
		}
	} else if (
		stat?.isFile() &&
		!importPath.split(path.sep).includes('lib') &&
		path.extname(importPath) === '.ts'
	) {
		importedFiles.push(import(importPath));
	} else {
		throw new Error('importPath does not resolve to file or directory');
	}

	return Promise.all(importedFiles)
		.then((files: Array<Record<string, unknown>>) => {
			const results: unknown[] = [];
			for (const contents of files) {
				if (contents && typeof contents === 'object') {
					const objects = Object.values(contents);
					for (const object of objects) {
						results.push(object);
					}
				}
			}

			return results;
		})
		.catch((exception: unknown) => {
			if (exception instanceof Error) {
				throw exception;
			}

			throw new Error(String(exception));
		});
}
