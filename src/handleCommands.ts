import { REST, Routes } from "discord.js";
import * as dotenv from "dotenv";
import { show } from "./commands/show";
import { modalReport } from "./commands/modal-report";
import { report } from "./commands/report";
import { menuShow } from "./commands/menu-show";
import dayjs from "dayjs";
import { balance } from "./commands/balance";
import { secretReport } from "./commands/secret-report";
import { modalSetDayDuration } from "./commands/menu-set-day-duration";
import { ptoReport } from "./commands/pto-report";

export const allCommands = {
	report,
	show,
	Report: modalReport,
	"Report PTO": ptoReport,
	"Show report": menuShow,
	"Show balance": balance,
	"Report discreetly": secretReport,
	"Set workday duration": modalSetDayDuration,
};

dotenv.config();

const token = process.env.BOT_TOKEN as string;
const clientId = process.env.BOT_CLIENT_ID as string;

// Construct and prepare an instance of the REST module
const rest = new REST({ version: "10" }).setToken(token);

export const registerCommands = async () => {
	const commands = Object.values(allCommands);

	try {
		console.log(
			`Started refreshing ${commands.length} application (/) commands.`
		);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data: any = await rest.put(Routes.applicationCommands(clientId), {
			body: commands.map((c) => c.data.toJSON()),
		});

		console.log(
			`Successfully reloaded ${data.length} application (/) commands.`
		);
	} catch (error) {
		// And of course, make sure you catch and log any errors!

		console.error(dayjs().format("HH:mm DD.MM.YYYY"), error);
	}
};
