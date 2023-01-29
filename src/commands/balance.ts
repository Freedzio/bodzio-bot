import dayjs from 'dayjs';
import {
	ApplicationCommandType,
	ContextMenuCommandBuilder,
	EmbedBuilder,
	UserContextMenuCommandInteraction
} from 'discord.js';
import { fetchApi } from '../common/fetch-api';
import { EndpointeEnum } from '../enpoints.enum';

const getBalance = async (interaction: UserContextMenuCommandInteraction) => {
	const requestedUser = interaction.targetUser.username;

	const response = await fetchApi(EndpointeEnum.BALANCE, {
		method: 'POST',
		body: JSON.stringify({
			requestedUser
		})
	});

	if (!response.ok) {
		const result = (await response).json();

		console.log(await result);

		return await interaction.reply({
			content: `Niestety nie udało mi się pobrać bilansu dla ${requestedUser} - coś poszło nie tak`,
			ephemeral: true
		});
	}

	const data = (await response).json();
	const balance = (await data).balance;

	await interaction.reply({
		ephemeral: true,
		content: `Balans użytkownika ${requestedUser} wynosi **${
			balance > 0 ? '+' : ''
		}${balance}h**`
	});
};

export const balance = {
	data: new ContextMenuCommandBuilder()
		.setName('Pokaż bilans')
		.setType(ApplicationCommandType.User),
	execute: getBalance
};
