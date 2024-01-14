
//import DrawPadCanvas from "../../Modules/draw_pad_canvas";
import React from "react"
//import Canvas from "../../Modules/Client/Rendering/canvas";

import Connecting from "./Tabs/connecting";
import Landing from "./Tabs/landing";
import Lobby from "./Tabs/lobby";
import Game from "./Tabs/game"

import LocalGameClient, { RemoteGameClient } from "../game_client";
//import { GAME_CREATE_RESPONSE } from "../../MessageLists/game_signaling";

//const urlParams = new URLSearchParams(window.location.search);
const client = new LocalGameClient("ws://localhost:5050", ["soap"]);

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




export default function App() {
	
	const [tab, setTab] = React.useState(<Connecting client={client} />);
	
	React.useEffect(() => client.serverConnected.subscribe(() => {
		setTab(<Landing client={client} />);
	}));
	
	React.useEffect(() => client.serverDisconnected.subscribe(() => {
		setTab(<Connecting client={client} />);
	}));
	
	React.useEffect(() => {
		
		return client.connected.subscribe(() => {
			//setTab(<Game />);
			//setTab(<Lobby />);
		});
		
	});
	
	React.useEffect(() => client.gameJoined.subscribe(() => {
		setTab(<Lobby client={client} />);
		//setTab(<Game client={client} />);
	}));
	
	React.useEffect(() => client.gameStarted.subscribe(() => {
		setTab(<Game client={client} />)
	}));
	
	React.useEffect(() => client.gameLeft.subscribe(() => {
		setTab(<Landing client={client} />);
	}));
	
	
	//<DrawPad />
	return (
		<div id="app">
			{ tab }
		</div>
	);
	
}

