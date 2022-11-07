import {
	ChatInputCommandInteraction,
	SlashCommandBuilder,
	Client
} from 'discord.js';
import * as dotenv from 'dotenv';
import { sendReport } from '../common/send-report';

dotenv.config();

const reportWork = async (
	interaction: ChatInputCommandInteraction,
	client: Client
) => {
	const job = interaction.options.get('zadania')?.value as string;
	const hours = interaction.options.get('godziny')?.value as string;
	const { username } = interaction.user;

	await sendReport(username, hours, job, interaction, client);
};

export const report = {
	data: new SlashCommandBuilder()
		.setName('report')
		.setDescription('Zaraportuj wykonaną pracę')
		.addNumberOption((option) =>
			option
				.setName('godziny')
				.setDescription('Ile godzin zostało przeznaczone na zadania')
				.setRequired(true)
				.setMinValue(0)
				.setMaxValue(24)
		)
		.addStringOption((option) =>
			option
				.setName('zadania')
				.setDescription('Na co został przeznaczony czas')
				.setRequired(true)
		),
	execute: reportWork
};
