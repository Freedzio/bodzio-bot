import {
	ChatInputCommandInteraction,
	SlashCommandBuilder,
	Client,
} from "discord.js";
import * as dotenv from "dotenv";
import { sendReport } from "../common/send-report";

dotenv.config();

const reportWork = async (
	interaction: ChatInputCommandInteraction,
	client: Client
) => {
	const job = interaction.options.get("job")?.value as string;
	const hours = interaction.options.get("hours")?.value as string;
	const { username } = interaction.user;

	await sendReport(username, hours, job, interaction, client);
};

export const report = {
	data: new SlashCommandBuilder()
		.setName("report")
		.setDescription("Report your work")
		.addNumberOption((option) =>
			option
				.setName("hours")
				.setDescription("How long did you spend on this job?")
				.setRequired(true)
				.setMinValue(0)
				.setMaxValue(24)
		)
		.addStringOption((option) =>
			option.setName("job").setDescription("What did you do?").setRequired(true)
		),
	execute: reportWork,
};
