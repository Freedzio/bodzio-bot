import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import * as dotenv from 'dotenv';
import dayjs from 'dayjs';

dotenv.config();

const monthOptions = [
	{ value: '0', name: 'styczeń' },
	{ value: '1', name: 'luty' },
	{ value: '2', name: 'marzec' },
	{ value: '3', name: 'kwiecień' },
	{ value: '4', name: 'maj' },
	{ value: '5', name: 'czerwiec' },
	{ value: '6', name: 'lipiec' },
	{ value: '7', name: 'sierpień' },
	{ value: '8', name: 'wrzesień' },
	{ value: '9', name: 'październik' },
	{ value: '10', name: 'listopad' },
	{ value: '11', name: 'grudzień' }
];

const showReport = async (interaction: ChatInputCommandInteraction) => {
	const requestedUser = interaction.options.get('użytkownik')?.value;
	const month = interaction.options.get('miesiąc')?.value;
	const year = interaction.options.get('rok')?.value;

	const { user } = interaction;

	const monthToShow = month ?? monthOptions[dayjs().get('month')].value;
	const yearToShow = year ?? dayjs().get('year');

	const reportUrl = `${(process.env.API_URL as string).replace(
		'/api',
		''
	)}/${requestedUser}/${monthToShow}/${yearToShow}`;

	const content = `Raport ${requestedUser} za ${
		monthOptions.find((o) => o.value.toString() === monthToShow.toString()).name
	} ${yearToShow} - ${reportUrl}`;

	await interaction.reply({ ephemeral: true, content });
	user.createDM().then((c) => c.send(content));
};

export const show = {
	data: new SlashCommandBuilder()
		.setName('show')
		.setDescription('Pobierz link do raportu pracy danego użytkownika')
		.addStringOption((option) =>
			option
				.setName('użytkownik')
				.setDescription('Użytkownik, którego raport chcesz zobaczyć')
				.setRequired(true)
		)
		.addStringOption((option) =>
			option
				.setName('miesiąc')
				.setDescription('Miesiąc, za który raport chcesz zobaczyć')
				.addChoices(...monthOptions)
		)
		.addNumberOption((option) =>
			option
				.setName('rok')
				.setDescription('Rok, z którego mam pobrać raport miesięczny')
				.setMinValue(2022)
				.setMaxValue(dayjs().get('year'))
		),
	execute: showReport
};
