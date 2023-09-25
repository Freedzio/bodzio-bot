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

const secretResponse = 'Zapisałem i nic nikomu nie powiedziałem';

const { GUILD_ID, MAIN_CHANNEL_ID } = process.env;

export const sendReport = async (
	username: string,
	hours: string,
	job: string,
	interaction: ChatInputCommandInteraction | ModalSubmitInteraction,
	client: Client,
	message?: Message,
	isSecret = false,
	isPto = false
) => {
	await interaction.deferReply({ ephemeral: true });

	const replyWithJob = `**${username} - ${hours}h** \n${job} ${
		isPto ? 'URLOP' : ''
	}`;
	const replyWithoutJob = `**${username} - ${hours}h** ${isPto ? 'URLOP' : ''}`;
	const secretReply = `**${username} - ${hours}h** ${
		isPto ? 'URLOP' : ''
	} \nPrezesowane`;

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
			messageId: message?.id,
			attachments: message?.attachments.map((a) => ({
				url: a.url,
				name: a.name
			})),
			link: message?.url.replace('https', 'discord'),
			isSecret,
			isPto
		})
	});

	if (!response.ok) {
		const result = (await response).json();

		console.log(await result);

		return await interaction.followUp({
			content: `Niestety nie udało mi się zaraportować ${
				isPto ? 'Twojego urlopu' : 'Twojej pracy'
			} - coś poszło nie tak`,
			ephemeral: true
		});
	}

	const mainChannel = client.guilds.cache
		.get(GUILD_ID as string)
		?.channels.cache.get(MAIN_CHANNEL_ID as string) as TextChannel;

	if (message?.channelId === mainChannel.id) {
		if (!isSecret) {
			await message.reply(isSecret ? secretReply : replyWithoutJob);
		} else {
			await mainChannel.send(secretReply);
		}

		return await interaction.followUp({
			content: `Pomyślnie zapisano ${isPto ? 'urlop' : 'raport'}`,
			ephemeral: true
		});
	}

	await mainChannel.send(isSecret ? secretReply : replyWithJob);

	await interaction.followUp({
		content: isSecret ? secretResponse : nonMainChannelResponse,
		ephemeral: true
	});
};
