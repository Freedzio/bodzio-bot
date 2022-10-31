import {
	ChatInputCommandInteraction,
	SlashCommandBuilder,
	TextChannel,
	Client
} from 'discord.js';
import { EndpointeEnum } from '../enpoints.enum';
import * as dotenv from 'dotenv';
import { fetchApi } from '../common/fetch-api';
import { sendReport } from '../common/send-report';

dotenv.config();

const nonMainChannelResponse =
	'Oksik, poinformowałem pozostałe Hobośki o Twoich poczynaniach :)';

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
				.setMinValue(1)
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
