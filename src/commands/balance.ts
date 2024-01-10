import dayjs from "dayjs";
import {
	ApplicationCommandType,
	ContextMenuCommandBuilder,
	EmbedBuilder,
	UserContextMenuCommandInteraction,
} from "discord.js";
import { fetchApi } from "../common/fetch-api";
import { EndpointeEnum } from "../enpoints.enum";

const getBalance = async (interaction: UserContextMenuCommandInteraction) => {
	await interaction.deferReply({ ephemeral: true });

	const requestedUser = interaction.targetUser.username;

	const response = await fetchApi(EndpointeEnum.BALANCE, {
		method: "POST",
		body: JSON.stringify({
			requestedUser,
		}),
	});

	if (!response.ok) {
		const result = (await response).json();

		console.log(await result);

		return await interaction.followUp({
			content: `I was not able to get ${requestedUser}'s hourly balance - something went wrong`,
			ephemeral: true,
		});
	}

	const data = (await response).json();
	const balance = (await data).balance;

	await interaction.followUp({
		ephemeral: true,
		content: `${requestedUser}'s hourly balance is **${
			balance > 0 ? "+" : ""
		}${balance}h**`,
	});
};

export const balance = {
	data: new ContextMenuCommandBuilder()
		.setName("Show balance")
		.setType(ApplicationCommandType.User),
	execute: getBalance,
};
