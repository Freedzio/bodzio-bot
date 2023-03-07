import dayjs from 'dayjs';
import {
	ActionRowBuilder,
	ApplicationCommandType,
	Client,
	ContextMenuCommandBuilder,
	ModalBuilder,
	ModalSubmitInteraction,
	TextInputBuilder,
	TextInputStyle,
	UserContextMenuCommandInteraction
} from 'discord.js';
import { fetchApi } from '../common/fetch-api';
import { EndpointeEnum } from '../enpoints.enum';

var customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);

const modal = new ModalBuilder()
	.setCustomId('dayDurationModal')
	.setTitle('Ustaw czas pracy');

const hoursInput = new TextInputBuilder()
	.setCustomId('hoursInput')
	.setLabel('Ile godzin ma mieć dzień pracy?')
	.setStyle(TextInputStyle.Short);

const dateInput = new TextInputBuilder()
	.setCustomId('dateInput')
	.setLabel('Od kiedy?')
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
	if (interaction.user.id !== '496438141561864192') {
		return interaction.reply({
			ephemeral: true,
			content: 'A co Ty majstrujesz?'
		});
	}

	const { username } = interaction.targetUser;
	await interaction.showModal(modal);

	interaction.awaitModalSubmit({ time: 1000 * 60 * 60 }).then((data) => {
		const hours = parseFloat(
			data.fields.getTextInputValue('hoursInput').replace(',', '.')
		);

		const fromDate = data.fields.getTextInputValue('dateInput');

		if (isNaN(hours)) {
			return data.reply({
				content:
					'Niestety, nie zrozumiałem ile godzin ma trwać dzień pracy tego użytkownika.',
				ephemeral: true
			});
		}
		if (hours <= 0 || hours >= 24) {
			return data.reply({
				content: 'Niepoprawna wartość. Należy podać liczbę pomiędzy 0 a 24',
				ephemeral: true
			});
		}

		if (dayjs().startOf('day').isAfter(dayjs(fromDate))) {
			return data.reply({
				content: 'Niepoprawna wartość. Data nie może być wsteczna',
				ephemeral: true
			});
		}

		if (dayjs(fromDate, 'DD.MM.YYYY').format() === 'Invalid Date') {
			return data.reply({
				content: 'Wprowadzono niepoprawną datę',
				ephemeral: true
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
		method: 'POST',
		body: JSON.stringify({
			username,
			duration: hours,
			fromDate
		})
	});

	if (!response.ok) {
		interaction.followUp('Coś poszło nie tak');
	} else {
		interaction.followUp(
			`Ustawiłem ${hours}-godzinny dzień pracy dla ${username}`
		);
	}
};

export const modalSetDayDuration = {
	data: new ContextMenuCommandBuilder()
		.setName('Ustaw godziny')
		.setType(ApplicationCommandType.User),
	execute: dayDurationModalAction
};
