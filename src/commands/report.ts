import {
	ChatInputCommandInteraction,
	SlashCommandBuilder,
	TextChannel,
	Client
} from 'discord.js';
import { EndpointeEnum } from '../enpoints.enum';
import fetch from 'node-fetch';
import * as dotenv from 'dotenv';
import dayjs from 'dayjs';
import { fetchApi } from '../common/fetch-api';

dotenv.config();

const reportWork = async (
	interaction: ChatInputCommandInteraction,
	client: Client
) => {
	const job = interaction.options.get('zadanie')?.value;
	const hours = interaction.options.get('godziny')?.value;
	const { username } = interaction.user;

	const yada = `${username} ${dayjs().format(
		'DD-MM-YYYY HH:mm'
	)} ${hours} godzin \njob`;

	console.log();
	console.log(yada);
	console.log();

	const response = await fetchApi(EndpointeEnum.REPORT, {
		method: 'POST',
		body: JSON.stringify({ job, hours, username })
	});

	const data = (await response).json();

	const isFromDM = !interaction.channel;

	if (isFromDM) {
		await (
			client.guilds.cache
				.get(process.env.GUILD_ID as string)
				?.channels.cache.get(
					process.env.MAIN_CHANNEL_ID as string
				) as TextChannel
		).send(yada);

		await interaction.reply(
			'Oksik, poinformowałem pozostałe Hobośki o Twoich poczynaniach :)'
		);
	} else {
		await interaction.reply(yada);
	}
};

export const report = {
	data: new SlashCommandBuilder()
		.setName('report')
		.setDescription('Zaraportuj wykonaną pracę')
		.addStringOption((option) =>
			option
				.setName('zadanie')
				.setDescription('Na co został przeznaczony czas')
				.setRequired(true)
		)
		.addNumberOption((option) =>
			option
				.setName('godziny')
				.setDescription('Ile godzin zostało przeznaczone na zadanie')
				.setRequired(true)
				.setMinValue(1)
				.setMaxValue(24)
		),
	execute: reportWork
};
