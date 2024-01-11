

import Arg from '../Modules/Network/arg';
import { Message } from "../Modules/Network/network"

export const GAME_CREATE_REQUEST = new Message();
export const GAME_CREATE_RESPONSE = new Message(Arg.STR1); // Game token
export const GAME_JOIN_REQUEST = new Message(Arg.STR1);

const MESSAGES: Array<Message> = [
	GAME_CREATE_REQUEST,
	GAME_CREATE_RESPONSE,
	GAME_JOIN_REQUEST
];

export default MESSAGES;


