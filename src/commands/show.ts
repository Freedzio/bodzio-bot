import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import * as dotenv from "dotenv";
import dayjs from "dayjs";

dotenv.config();

export const monthOptions = [
	{ value: "0", name: "january" },
	{ value: "1", name: "february" },
	{ value: "2", name: "march" },
	{ value: "3", name: "april" },
	{ value: "4", name: "may" },
	{ value: "5", name: "june" },
	{ value: "6", name: "july" },
	{ value: "7", name: "august" },
	{ value: "8", name: "september" },
	{ value: "9", name: "october" },
	{ value: "10", name: "november" },
	{ value: "11", name: "december" },
];

const showReport = async (interaction: ChatInputCommandInteraction) => {
	const requestedUser = interaction.options.get("user")?.value;
	const month = interaction.options.get("month")?.value;
	const year = interaction.options.get("year")?.value;

	const { user } = interaction;

	const monthToShow = month ?? monthOptions[dayjs().get("month")].value;
	const yearToShow = year ?? dayjs().get("year");

	const reportUrl = `${(process.env.API_URL as string).replace(
		"/api",
		""
	)}/${requestedUser}/${monthToShow}/${yearToShow}`;

	const content = `Raport ${requestedUser} za ${
		monthOptions.find((o) => o.value.toString() === monthToShow.toString()).name
	} ${yearToShow} - ${reportUrl}`;

	if (!!interaction.channel) {
		await interaction.reply({
			ephemeral: true,
			content: "Sprawdź DMki ziomek",
		});
		user.createDM().then((c) => c.send(content));
	} else {
		await interaction.reply({ ephemeral: true, content });
	}
};

export const show = {
	data: new SlashCommandBuilder()
		.setName("show")
		.setDescription("Get URL to this user's work report")
		.addStringOption((option) =>
			option
				.setName("user")
				.setDescription("User, whose work you want to see")
				.setRequired(true)
		)
		.addStringOption((option) =>
			option
				.setName("month")
				.setDescription("Month, for which you want the report")
				.addChoices(...monthOptions)
		)
		.addNumberOption((option) =>
			option
				.setName("year")
				.setDescription("Year, from which you want to get the report")
				.setMinValue(2022)
				.setMaxValue(dayjs().get("year"))
		),
	execute: showReport,
};
