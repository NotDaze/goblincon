

import Arg from '../Modules/Network/arg';
import { Message } from "../Modules/Network/network"

/*export const GAME_CREATE = new Message({
	name: Arg.STR1
});
export const GAME_JOIN = new Message({
	name: Arg.STR1,
	code: Arg.STR1
});
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


export const GAME_START = new Message();*/

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

export const ROUND_START = new Message(Arg.INT1);

export const DRAWING_START = new Message();
export const DRAWING_END = new Message();
export const DONE_DRAWING = new Message();

export const LOADING_CHUNK = new Message({
	//round: Arg.INT1,
	//index: Arg.INT2,
	//data: Arg.RAW2
	data: Arg.STR2,
	done: Arg.BOOL
});
export const DONE_LOADING = new Message();

export const VOTING_START = new Message();
export const VOTING_END = new Message();
export const DONE_VOTING = new Message(
	// Vote results
);



/*export const VOTING_RESULTS = new Message({
	
});*/
/*export const VOTING_END = new Message({
	
});*/


const MESSAGES: Array<Message<any>> = [
	
	ROUND_START,
	
	DRAWING_START,
	DRAWING_END,
	DONE_DRAWING,
	
	LOADING_CHUNK,
	DONE_LOADING,
	
	VOTING_START,
	VOTING_END,
	DONE_VOTING
	
];

export default MESSAGES;


