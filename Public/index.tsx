

import React from "react"
import ReactDOM from "react-dom"
import { createRoot } from "react-dom/client"
import LocalGameClient, { RemoteGameClient } from "../Modules/game_client";

import App from "./Components/app"


const root = createRoot(document.getElementById("app")!);
root.render(<App />);


const gameClient = new LocalGameClient("ws://localhost:5050", ["soap"]);

/*gameClient.serverConnected.connect(() => {
	gameClient.createGame();
});*/



