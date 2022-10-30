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
	const job = interaction.options.get('zadania')?.value;
	const hours = interaction.options.get('godziny')?.value;
	const { username } = interaction.user;

	const yada = `**${username} - ${hours}h** \n${job
		.toString()
		.replace(/ \*/g, '\n* ')
		.replace(/ \-/g, '\n- ')}`;

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
