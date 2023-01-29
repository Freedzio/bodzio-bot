import {
	MessageContextMenuCommandInteraction,
	Client,
	ActionRowBuilder,
	ModalBuilder,
	TextInputBuilder,
	TextInputStyle
} from 'discord.js';
import { sendReport } from './send-report';

const modal = new ModalBuilder()
	.setCustomId('reportModal')
	.setTitle('Zaraportuj czas pracy');

const hoursInput = new TextInputBuilder()
	.setCustomId('hoursInput')
	.setLabel('Ile godzin spędziłeś/aś na te prace?')
	.setStyle(TextInputStyle.Short);

const firstActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(
	hoursInput
);

modal.addComponents(firstActionRow);

export const modalAction = async (
	interaction: MessageContextMenuCommandInteraction,
	client: Client,
	isSecret = false
) => {
	if (interaction.targetMessage.author.bot) {
		return interaction.reply({
			content: 'To bocia wiadomość, nie możesz jej zaraportować',
			ephemeral: true
		});
	}

	const { username } = interaction.targetMessage.author;
	const job = interaction.targetMessage.content;

	await interaction.showModal(modal);

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
				isSecret
			);
		}
	});
};