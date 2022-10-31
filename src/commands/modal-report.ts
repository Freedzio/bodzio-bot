import {
	ActionRowBuilder,
	ApplicationCommandType,
	Client,
	ContextMenuCommandBuilder,
	MessageContextMenuCommandInteraction,
	ModalBuilder,
	TextInputBuilder,
	TextInputStyle
} from 'discord.js';
import { isNaN } from 'lodash';
import { sendReport } from '../common/send-report';

const reactions = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];

const modalAction = async (
	interaction: MessageContextMenuCommandInteraction,
	client: Client
) => {
	if (interaction.targetMessage.author.bot) {
		return interaction.reply({
			content: 'To bocia wiadomość, nie możesz jej zaraportować',
			ephemeral: true
		});
	}
	const { username } = interaction.targetMessage.author;
	const job = interaction.targetMessage.content;

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
	await interaction.showModal(modal);

	interaction.awaitModalSubmit({ time: 999999 }).then((data) => {
		const hours = parseFloat(data.fields.getTextInputValue('hoursInput'));
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
				interaction.targetMessage.id
			);
		}
	});
};

export const modalReport = {
	data: new ContextMenuCommandBuilder()
		.setName('Zaraportuj')
		.setType(ApplicationCommandType.Message),
	execute: modalAction
};
