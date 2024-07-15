import type { Client } from 'discord.js';

type Container = {
	client: Client | null;
};

export const sparkContainer: Container = {
	client: null,
};
