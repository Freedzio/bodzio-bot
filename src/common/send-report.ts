import {
	ChatInputCommandInteraction,
	Client,
	ModalSubmitInteraction,
	TextChannel
} from 'discord.js';
import { EndpointeEnum } from '../enpoints.enum';
import { fetchApi } from './fetch-api';

const nonMainChannelResponse =
	'Oksik, poinformowałem pozostałe Hobośki o Twoich poczynaniach :)';

export const sendReport = async (
	username: string,
	hours: string,
	job: string,
	interaction: ChatInputCommandInteraction | ModalSubmitInteraction,
	client: Client
) => {
	const reportMesage = `**${username} - ${hours}h** \n${job
		.toString()
		.replace(/ \*/g, '\n*')
		.replace(/ \-/g, '\n-')}`;

	console.log();
	console.log(reportMesage);
	console.log();

	const response = await fetchApi(EndpointeEnum.REPORT, {
		method: 'POST',
		body: JSON.stringify({ job, hours, username })
	});

	const result = (await response).json();

	console.log(await result);

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

	return await mainChannel.send(reportMesage);
};
