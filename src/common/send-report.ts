import {
	ChatInputCommandInteraction,
	Client,
	Message,
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
	client: Client,
	message?: Message
) => {
	const replyWithJob = `**${username} - ${hours}h** \n${job}`;
	const replyWithoutJob = `**${username} - ${hours}h**`;

	console.log();
	console.log(replyWithJob);
	console.log();

	const response = await fetchApi(EndpointeEnum.REPORT, {
		method: 'POST',
		body: JSON.stringify({
			username,
			reporter: interaction.user.username,
			job,
			hours,
			lastEditAt: message?.editedTimestamp,
			messageAt: message?.createdTimestamp,
			messageId: message?.id
		})
	});

	if (!response.ok) {
		const result = (await response).json();

		console.log(await result);

		return await interaction.reply({
			content:
				'Niestety nie udało mi się zaraportować Twojej pracy - coś poszło nie tak',
			ephemeral: true
		});
	}

	const mainChannel = client.guilds.cache
		.get(process.env.GUILD_ID as string)
		?.channels.cache.get(process.env.MAIN_CHANNEL_ID as string) as TextChannel;

	if (message?.channelId === mainChannel.id) {
		await message.reply(replyWithoutJob);
		return await interaction.reply({
			content: 'Pomyślnie zapisano raport',
			ephemeral: true
		});
	}

	await mainChannel.send(replyWithJob);
	await interaction.reply({ content: nonMainChannelResponse, ephemeral: true });
};
