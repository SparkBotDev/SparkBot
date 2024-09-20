import { type Gate } from '../../core/gates';

export const gate: Gate = {
	id: 'test',
	check(...args) {
		if (typeof args[0] === 'boolean') return args[0];
		return false;
	},
};
