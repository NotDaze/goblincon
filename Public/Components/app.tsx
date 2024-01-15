//import DrawPadCanvas from "../../Modules/draw_pad_canvas";
import React from "react";
//import Canvas from "../../Modules/Client/Rendering/canvas";

import Connecting from "./Tabs/connecting";
import Landing from "./Tabs/landing";
import Lobby from "./Tabs/lobby";
import Game from "./Tabs/game";

//import LocalGameClient, { RemoteGameClient } from "../game_client";
import client from "../client_instance";

//import { GAME_CREATE_RESPONSE } from "../../MessageLists/game_signaling";

//const urlParams = new URLSearchParams(window.location.search);
// const client = new LocalGameClient("ws://localhost:5050", ["soap"]);

//const [tab, setTab] = React.createContext<Tab>("lobby");

/*client.serverConnected.connect(() => {
		
	let joinCode = urlParams.get("join");
	
	if (joinCode === null)
		setTab("lobby");
	else
		client.joinGame(joinCode);
	
});*/

/*export default class App extends React.Component {
	
	constructor(props: {}) {
		
		super(props, {
			tab: 2
		});
		
		this.state = {
			tab: 2
		};
		
		
		
	}
	
	
	render() {
		
		return (
			<div id="app" className="flex">
				{ this.state.tab === "loading" && <LoadingTab /> }
				{ this.state.tab === "lobby" && <LobbyTab /> }
			</div>
		);
		
	}
	
}*/




const Tabs = {
	
	Connecting,
	Landing,
	Lobby,
	Game
	
};

export default function App() {
	
	const [tab, setTab] = React.useState<keyof typeof Tabs>("Connecting");
	const Tab = Tabs[tab];
	
	React.useEffect(() => (
		
		client.serverConnected.subscribe(() => setTab("Landing"),
		client.serverDisconnected.subscribe(() => setTab("Connecting"),
		client.gameJoined.subscribe(() => setTab("Lobby"),
		client.gameStarted.subscribe(() => setTab("Game"),
		client.gameLeft.subscribe(() => setTab("Landing"))))))
		
	), []);
	
	return <div id="app"><Tab /></div>;
	
}
