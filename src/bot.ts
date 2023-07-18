import dayjs from 'dayjs';
import { Client, GatewayIntentBits, Events, Interaction } from 'discord.js';
import * as dotenv from 'dotenv';
import { allCommands, registerCommands } from './handleCommands';

dotenv.config();

const { BOT_TOKEN } = process.env;

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

registerCommands();

client.on('ready', () => {
	console.log(`Logged in as ${client?.user?.tag}!`);
});

client.on(Events.InteractionCreate, async (interaction: Interaction<any>) => {
	try {
		if (
			interaction.isChatInputCommand() ||
			interaction.isMessageContextMenuCommand() ||
			interaction.isUserContextMenuCommand()
		) {
			console.log(
				`USER ${interaction.user.username}\nCOMMAND ${interaction.commandName}`
			);

			const { commandName } = interaction;
			allCommands[commandName].execute(interaction, client);
		}

		return;
	} catch (e) {
		console.log(dayjs().toISOString());
		console.log(e);
	}
});

client.login(BOT_TOKEN);
