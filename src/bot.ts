import { Client, GatewayIntentBits, Events } from 'discord.js';
import * as dotenv from 'dotenv';
import { allCommands, registerCommands } from './handleCommands';

dotenv.config();

const token = process.env.BOT_TOKEN as string;

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

registerCommands();

client.on('ready', () => {
	console.log(`Logged in as ${client?.user?.tag}!`);
});

client.on(Events.InteractionCreate, async (interaction) => {
	try {
		if (
			interaction.isChatInputCommand() ||
			interaction.isMessageContextMenuCommand()
		) {
			const { commandName } = interaction;
			allCommands[commandName].execute(interaction, client);
		}

		return;
	} catch (e) {
		console.log(e);
	}
});

client.login(token);
