

import React from "react";
//import LocalGameClient from "../../game_client";
import client from "../../client_instance";


function PlayerName({ name }: { name: string }) {
	
	return (
		<div className="player box-item">{name}</div>
	);
	
}

function PlayerList() {
	
	const [peers, setPeers] = React.useState(Array.from(client.getPeers()));
	
	React.useEffect(() => {
		
		const update = () => setPeers(Array.from(client.getPeers()));
		
		// Sometimes the list doesn't update properly the first time if
		// the server response happens before rendering finishes
		// This fixes that
		if (peers.length !== client.getPeerCount())
			update(); 
		
		return (
			client.peerAdded.subscribe(() => update(),
			client.peerDropped.subscribe(() => update()))
		);
		
	}, []);
	
	/*React.useEffect(() => client.lobbyPlayerListUpdate.subscribe(() => {
		setPeers(Array.from(client.getPeers()));
	}), []);*/
	
	return (
		<div id="player-list" className="box-ctr">
			{ peers.map(peer => <PlayerName key={peer.getID()} name={peer.presence.getName()} />) }
		</div>
	);
	
}

function LobbyHeader({ code, name }: { code: string, name: string }) {
	
	const copyCode = () => {
		navigator.clipboard.writeText(`${window.location.host}?code=${code}`);
	};
	
	return (
		<div id="header">
			<div id="code" onClick={copyCode}>{client.getGameCode()}</div>
			<div id="name">{client.presence.getName()}</div>
		</div>
	); // Should not ever need to rerender
	
}

export default function Lobby() {
	
	const [canStart, setCanStart] = React.useState(false);
	
	React.useEffect(() => {
		
		const update = () => setCanStart(client.canStartGame());
		
		return (
			client.peerAdded.subscribe(() => update(),
			client.peerDropped.subscribe(() => update()))
		);
		
	}, []);
	
	return (
		<div id="lobby" className="tab">
			<LobbyHeader code={client.getGameCode()} name={client.presence.getName()} />
			<hr />
			<PlayerList />
			
			<div>
				{client.canStartGame() && <button id="start-btn" onClick={() => client.startGame()}>Start</button>}
			</div>
		</div>
	);
	
}


