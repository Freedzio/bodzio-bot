import {
	ActionRowBuilder,
	ApplicationCommandType,
	ContextMenuCommandBuilder,
	ModalBuilder,
	ModalSubmitInteraction,
	TextInputBuilder,
	TextInputStyle,
	UserContextMenuCommandInteraction,
} from "discord.js";
import { fetchApi } from "../common/fetch-api";
import { EndpointeEnum } from "../enpoints.enum";
import { dayjs } from "../common/dayjs";

const modal = new ModalBuilder()
	.setCustomId("dayDurationModal")
	.setTitle("Set workday duration");

const hoursInput = new TextInputBuilder()
	.setCustomId("hoursInput")
	.setLabel("How long should the workday be?")
	.setStyle(TextInputStyle.Short);

const dateInput = new TextInputBuilder()
	.setCustomId("dateInput")
	.setLabel("Since what day?")
	.setStyle(TextInputStyle.Short);

const firstActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(
	hoursInput
);
const secondActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(
	dateInput
);

modal.addComponents(firstActionRow, secondActionRow);

const dayDurationModalAction = async (
	interaction: UserContextMenuCommandInteraction
) => {
	// if (interaction.user.id !== '496438141561864192') {
	// 	return interaction.reply({
	// 		ephemeral: true,
	// 		content: 'A co Ty majstrujesz?'
	// 	});
	// }

	const { username } = interaction.targetUser;
	await interaction.showModal(modal);

	interaction.awaitModalSubmit({ time: 1000 * 60 * 60 }).then((data) => {
		const hours = parseFloat(
			data.fields.getTextInputValue("hoursInput").replace(",", ".")
		);

		let fromDate = data.fields.getTextInputValue("dateInput");
		// sprawdź czy dzień miesiąca nie jest jednocyfrowy
		const dateElements = fromDate.split(".");
		if (dateElements[0].length === 1) {
			fromDate = `0${fromDate}`;
		}

		const fromDateObject = dayjs(fromDate, "DD.MM.YYYY");

		if (isNaN(hours)) {
			return data.reply({
				content:
					"I'm sorry, I didn't understand how long this user's workday is supposed to be.",
				ephemeral: true,
			});
		}
		if (hours <= 0 || hours >= 24) {
			return data.reply({
				content: "Wrong value. Please enter number between 0 and 24",
				ephemeral: true,
			});
		}

		// if (dayjs().startOf("day").isAfter(fromDateObject)) {
		// 	return data.reply({
		// 		content: "Niepoprawna wartość. Data nie może być wsteczna",
		// 		ephemeral: true,
		// 	});
		// }

		if (fromDateObject.format() === "Invalid Date") {
			return data.reply({
				content: "Wrong date",
				ephemeral: true,
			});
		}

		sendDayDuration(username, hours, fromDate, data);
	});
};

const sendDayDuration = async (
	username: string,
	hours: number,
	fromDate: string,
	interaction: ModalSubmitInteraction
) => {
	await interaction.deferReply({ ephemeral: true });

	const response = await fetchApi(EndpointeEnum.DAY_DURATION, {
		method: "POST",
		body: JSON.stringify({
			username,
			duration: hours,
			fromDate,
		}),
	});

	if (!response.ok) {
		interaction.followUp("Something went wrong");
	} else {
		interaction.followUp(`I've set ${hours}-hours workday for ${username}`);
	}
};

export const modalSetDayDuration = {
	data: new ContextMenuCommandBuilder()
		.setName("Set workday duration")
		.setType(ApplicationCommandType.User),
	execute: dayDurationModalAction,
};
