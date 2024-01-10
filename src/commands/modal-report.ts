import { ApplicationCommandType, ContextMenuCommandBuilder } from "discord.js";
import { modalAction } from "../common/handle-modal-report";

export const modalReport = {
	data: new ContextMenuCommandBuilder()
		.setName("Report")
		.setType(ApplicationCommandType.Message),
	execute: modalAction,
};
