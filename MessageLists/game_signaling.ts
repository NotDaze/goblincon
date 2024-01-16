

import Arg from '../Modules/Network/arg';
import { Message } from "../Modules/Network/network"

export const GAME_CREATE = new Message({
	name: Arg.STR1
});
export const GAME_JOIN = new Message({
	name: Arg.STR1,
	code: Arg.STR1
});
export const GAME_JOIN_FAILED = new Message();
export const GAME_JOINED = new Message(Arg.optional({
	id: Arg.INT2,
	name: Arg.STR1,
	code: Arg.STR1
}));
export const GAME_LOBBY_PLAYERS_JOINED = new Message(Arg.arrayShort({
	id: Arg.INT2,
	name: Arg.STR1
}));
export const GAME_LOBBY_PLAYERS_LEFT = new Message(Arg.arrayShort({
	id: Arg.INT2
}));


export const GAME_START = new Message();

/*export const GAME_JOIN_RESPONSE = new Message(
	Arg.branch(
		{
			success: Arg.const(false),
			code: Arg.const<string | undefined>(undefined)
		},
		{
			success: Arg.const(true),
			code: Arg.STR1
		}
	)
);*/
//export const GAME_CREATE_RESPONSE = new Message(Arg.STR1); // Game token
//export const GAME_JOIN = new Message(Arg.STR1);
//export const GAME_JOIN_RESPONSE = new Message(Arg.optional(Arg.STR1));

const MESSAGES: Array<Message<any>> = [
	
	GAME_CREATE,
	GAME_JOIN,
	GAME_JOINED,
	GAME_JOIN_FAILED,
	
	GAME_LOBBY_PLAYERS_JOINED,
	GAME_LOBBY_PLAYERS_LEFT,
	
	GAME_START,
	
];

export default MESSAGES;


