import { SlashCommandBuilder } from 'discord.js';
import { EndpointeEnum } from '../enpoints.enum';
import fetch from 'node-fetch';
import * as dotenv from 'dotenv';

dotenv.config();

const url = process.env.API_URL;

const reportWork = async (interaction: any) => {
	const response = await fetch(url + EndpointeEnum.REPORT, {
		method: 'POST',
		body: JSON.stringify({ dupa: 123 }),
		headers: {
			'x-bodzio-secret': process.env.API_SECRET as string
		}
	});

	const data = (await response).json();

	await interaction.reply((await data).message);
};

export const report = {
	data: new SlashCommandBuilder()
		.setName('report')
		.setDescription('Zaraportuj wykonaną pracę'),
	execute: reportWork
};
