import {
	ApplicationCommandType,
	Client,
	ContextMenuCommandBuilder,
	MessageContextMenuCommandInteraction
} from 'discord.js';
import { modalAction } from '../common/handle-modal-report';

const secretModalAction = (
	interaction: MessageContextMenuCommandInteraction,
	client: Client
) => {
	modalAction(interaction, client, true);
};

export const secretReport = {
	data: new ContextMenuCommandBuilder()
		.setName('Zaraportuj dyskretnie')
		.setType(ApplicationCommandType.Message),
	execute: secretModalAction
};
