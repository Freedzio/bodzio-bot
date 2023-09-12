import {
	ApplicationCommandType,
	Client,
	ContextMenuCommandBuilder,
	MessageContextMenuCommandInteraction
} from 'discord.js';
import { modalAction } from '../common/handle-modal-report';

const ptoModalAction = (
	interaction: MessageContextMenuCommandInteraction,
	client: Client
) => {
	modalAction(interaction, client, false, true);
};

export const ptoReport = {
	data: new ContextMenuCommandBuilder()
		.setName('Zaraportuj urlop')
		.setType(ApplicationCommandType.Message),
	execute: ptoModalAction
};
