import {
	MessageContextMenuCommandInteraction,
	Client,
	ActionRowBuilder,
	ModalBuilder,
	TextInputBuilder,
	TextInputStyle
} from 'discord.js';
import { sendReport } from './send-report';

const modal = (isPto: boolean) =>
	new ModalBuilder()
		.setCustomId('reportModal')
		.setTitle(`Zaraportuj ${isPto ? 'urlop' : 'czas pracy'}`);

const hoursInput = (isPto: boolean) =>
	new TextInputBuilder()
		.setCustomId('hoursInput')
		.setLabel(`Ile godzin spędziłeś/aś na ${isPto ? 'urlopie' : 'te prace'}?`)
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
			content: 'To bocia wiadomość, nie możesz jej zaraportować',
			ephemeral: true
		});
	}

	const { username } = interaction.targetMessage.author;
	const job = interaction.targetMessage.content;

	await interaction.showModal(yada);

	interaction.awaitModalSubmit({ time: 1000 * 60 * 60 }).then((data) => {
		const hours = parseFloat(
			data.fields.getTextInputValue('hoursInput').replace(',', '.')
		);
		if (isNaN(hours)) {
			data.reply({
				content:
					'Niestety, nie zrozumiałem ile czasu poświęciłeś/aś na te prace. Proszę, zaraportuj ponownie i upewnij się, że wszystko jest w porządalku :)',
				ephemeral: true
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
