// import dayjs from "dayjs";
// import { ContextMenuCommandBuilder, ApplicationCommandType, ChatInputCommandInteraction, UserContextMenuCommandInteraction } from "discord.js";

// const showReport = async (interaction: UserContextMenuCommandInteraction) => {
//     const month = interaction.options.get('miesiąc')?.value;
// 	const year = interaction.options.get('rok')?.value;
// 	const { username } = interaction.targetUser;

// 	const reportUrl = `${(process.env.API_URL as string).replace(
// 		'/api',
// 		''
// 	)}/${requestedUser}/${monthToShow}/${yearToShow}`;

// 	const content = `Raport ${requestedUser} za ${
// 		monthOptions.find((o) => o.value.toString() === monthToShow.toString()).name
// 	} ${yearToShow} - ${reportUrl}`;

// 	if (!!interaction.channel) {
// 		await interaction.reply({
// 			ephemeral: true,
// 			content: 'Sprawdź DMki ziomek'
// 		});
// 		user.createDM().then((c) => c.send(content));
// 	} else {
// 		await interaction.reply({ ephemeral: true, content });
// 	}
// };

// export const menuShow = {
// 	data: new ContextMenuCommandBuilder()
// 		.setName('Pokaż raport')
// 		.setType(ApplicationCommandType.Message),
// 	execute: modalAction
// };
