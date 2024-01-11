

import React from "react"
import ReactDOM from "react-dom"
import { createRoot } from "react-dom/client"
import LocalGameClient, { RemoteGameClient } from "./game_client";

import App from "./Components/app"


const root = createRoot(document.getElementById("app")!);
root.render(<App />);

const urlParams = new URLSearchParams(window.location.search);


const client = new LocalGameClient("ws://localhost:5050", ["soap"]);


client.serverConnected.connect(() => {
	
	let joinCode = urlParams.get("join");
	
	if (joinCode === null)
		client.createGame();
	else
		client.joinGame(joinCode);
	
});



/*gameClient.serverConnected.connect(() => {
	gameClient.createGame();
});*/



