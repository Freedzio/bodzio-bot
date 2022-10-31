import dayjs from 'dayjs';
import {
	ContextMenuCommandBuilder,
	ApplicationCommandType,
	UserContextMenuCommandInteraction
} from 'discord.js';

const contextMenuReport = async (
	interaction: UserContextMenuCommandInteraction
) => {
	const month = dayjs().get('month');
	const year = dayjs().get('year');
	const { username } = interaction.targetUser;
	const { user } = interaction;

	const reportUrl = `${(process.env.API_URL as string).replace(
		'/api',
		''
	)}/${username}/${month}/${year}`;

	const content = `Raport ${username} za ${month} ${year} - ${reportUrl}`;

	await interaction.reply({
		ephemeral: true,
		content: 'Sprawdź DMki ziomek'
	});
	user.createDM().then((c) => c.send(content));
};

export const menuShow = {
	data: new ContextMenuCommandBuilder()
		.setName('Pokaż raport')
		.setType(ApplicationCommandType.User),
	execute: contextMenuReport
};
