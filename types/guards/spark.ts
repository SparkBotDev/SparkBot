import { CommandSparkWithAutocomplete } from '../../lib/sparks/interaction.ts';

/**
 * Typeguard to ensure command is an autocomplete.
 * @param input Class to check
 * @returns boolean
 */
export function isCommandSparkWithAutoComplete(
	input: unknown,
): input is CommandSparkWithAutocomplete {
	return Object.getPrototypeOf(input) === CommandSparkWithAutocomplete;
}
