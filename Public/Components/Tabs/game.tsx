

import React from "react";
import client from "../../client_instance";
//import LocalGameClient from '../../game_client';

import Drawing from "./Game/drawing";
import Voting from "./Game/voting";
//import { RemoteGameClient } from '../../game_client';


const Tabs = {
	
	Drawing,
	Voting
	
}

export default function Game() {
	
	const [tab, setTab] = React.useState<keyof typeof Tabs>("Drawing");
	const Tab = Tabs[tab];
	
	React.useEffect(() => (
		client.drawingStarted.subscribe(() => setTab("Drawing"),
		client.votingStarted.subscribe(() => setTab("Voting")))
	), []);
	
	return (
		<div id="game" className="tab" >
			<Tab />
		</div>
	);
}


