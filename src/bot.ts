import { REST, Routes, Client, GatewayIntentBits, Events } from 'discord.js';
import * as dotenv from 'dotenv';

dotenv.config();

const token = process.env.BOT_TOKEN as string;

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on('ready', () => {
	console.log(`Logged in as ${client?.user?.tag}!`);
});

client.on(Events.InteractionCreate, async (interaction) => {
	console.log(interaction);
	if (!interaction.isChatInputCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'ping') {
		await interaction.reply('Pong!');
	} else if (commandName === 'beep') {
		await interaction.reply('Boop!');
	}
});

client.login(token);
