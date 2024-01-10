import {
	MessageContextMenuCommandInteraction,
	Client,
	ActionRowBuilder,
	ModalBuilder,
	TextInputBuilder,
	TextInputStyle,
} from "discord.js";
import { sendReport } from "./send-report";

const modal = (isPto: boolean) =>
	new ModalBuilder()
		.setCustomId("reportModal")
		.setTitle(`Report ${isPto ? "PTO" : "work"}`);

const hoursInput = (isPto: boolean) =>
	new TextInputBuilder()
		.setCustomId("hoursInput")
		.setLabel(`How much time did you spend on ${isPto ? "PTO" : "this work"}?`)
		.setStyle(TextInputStyle.Short);

const firstActionRow = (isPto: boolean) =>
	new ActionRowBuilder<TextInputBuilder>().addComponents(hoursInput(isPto));

const createModal = (isPto: boolean) =>
	modal(isPto).addComponents(firstActionRow(isPto));

export const modalAction = async (
	interaction: MessageContextMenuCommandInteraction,
	client: Client,
	isSecret = false,
	isPto = false
) => {
	const yada = createModal(isPto);

	if (interaction.targetMessage.author.bot) {
		return interaction.reply({
			content: "This is a bot message - it cannot be reported",
			ephemeral: true,
		});
	}

	const { username } = interaction.targetMessage.author;
	const job = interaction.targetMessage.content;

	await interaction.showModal(yada);

	interaction.awaitModalSubmit({ time: 1000 * 60 * 60 }).then((data) => {
		const hours = parseFloat(
			data.fields.getTextInputValue("hoursInput").replace(",", ".")
		);
		if (isNaN(hours)) {
			data.reply({
				content:
					"I'm sorry, I didn't understand how much time you have spent on this job",
				ephemeral: true,
			});
		} else {
			sendReport(
				username,
				hours.toString(),
				job,
				data,
				client,
				interaction.targetMessage,
				isSecret,
				isPto
			);
		}
	});
};
