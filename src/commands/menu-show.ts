import dayjs from "dayjs";
import {
	ContextMenuCommandBuilder,
	ApplicationCommandType,
	UserContextMenuCommandInteraction,
} from "discord.js";
import { monthOptions } from "./show";

const contextMenuReport = async (
	interaction: UserContextMenuCommandInteraction
) => {
	const month = dayjs().get("month");
	const year = dayjs().get("year");
	const { username } = interaction.targetUser;
	const { user } = interaction;

	const reportUrl = `${(process.env.API_URL as string).replace(
		"/api",
		""
	)}/${username}/${month}/${year}`;

	const content = `Raport ${username} za ${
		monthOptions.find((o) => o.value === month.toString()).name
	} ${year} - ${reportUrl}`;

	await interaction.reply({
		ephemeral: true,
		content: "Yo, check yo DMs",
	});
	user.createDM().then((c) => c.send(content));
};

export const menuShow = {
	data: new ContextMenuCommandBuilder()
		.setName("Show report")
		.setType(ApplicationCommandType.User),
	execute: contextMenuReport,
};
