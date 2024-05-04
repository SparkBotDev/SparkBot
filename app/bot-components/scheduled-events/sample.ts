export const sampleEvent: ScheduledEvent = {
	name: 'sample',
	schedule: ['*/10 * * * *'],
	timezone: 'Asia/Hong_Kong',
	async execute(client) {
		client.logger.debug('------------Tick------------');
	},
};
