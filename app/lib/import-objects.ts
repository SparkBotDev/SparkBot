import { readdirSync, statSync } from 'node:fs';
import { extname, join, sep } from 'node:path';

export async function importObjects<ObjectType>(
	path: string,
): Promise<ObjectType[]> {
	const results: ObjectType[] = [];
	const importedFiles: Array<Promise<unknown>> = [];
	if (statSync(path, { throwIfNoEntry: false })?.isDirectory()) {
		for (const file of readdirSync(path, { recursive: true }) as string[]) {
			if (!file.split(sep).includes('lib') && extname(file) === '.ts') {
				importedFiles.push(import(join(path, file)));
			}
		}
	} else {
		try {
			importedFiles.push(import(path));
		} catch {}
	}

	await Promise.all(importedFiles)
		.then((result) => {
			for (const file of result) {
				if (file && typeof file === 'object') {
					const contents = Object.values(file);
					for (const element of contents) {
						results.push(element as ObjectType);
					}
				}
			}
		})
		.catch(() => {}); // eslint-disable-line @typescript-eslint/no-empty-function
	return results;
}
