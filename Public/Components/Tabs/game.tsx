

import React from "react";
import DrawPad from "../draw_pad";
import LocalGameClient from '../../game_client';

import Drawing from "./Game/drawing";
import Voting from "./Game/voting";
import { RemoteGameClient } from '../../game_client';




export default function Game({ client }: { client: LocalGameClient }) {
	
	const [tab, setTab] = React.useState(<Drawing client={client} />);
	
	return (
		<div id="game" className="tab" >
			{ tab }
		</div>
	);
}


