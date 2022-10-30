import {
	ChatInputCommandInteraction,
	SlashCommandBuilder,
	TextChannel,
	Client
} from 'discord.js';
import { EndpointeEnum } from '../enpoints.enum';
import * as dotenv from 'dotenv';
import dayjs from 'dayjs';
import { fetchApi } from '../common/fetch-api';

dotenv.config();

const nonMainChannelResponse =
	'Oksik, poinformowałem pozostałe Hobośki o Twoich poczynaniach :)';

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

	if (!response.ok) {
		return await interaction.reply({
			content:
				'Niestety nie udało mi się zaraportować Twojej pracy - coś poszło nie tak',
			ephemeral: true
		});
	}

	const mainChannel = client.guilds.cache
		.get(process.env.GUILD_ID as string)
		?.channels.cache.get(process.env.MAIN_CHANNEL_ID as string) as TextChannel;

	await interaction.reply({ content: nonMainChannelResponse, ephemeral: true });

	return await mainChannel.send(yada);
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
