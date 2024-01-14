

import React from "react";
import LocalGameClient from "../../game_client";


function PlayerName({ name }: { name: string }) {
	
	return (
		<div className="player-name">{name}</div>
	);
	
}

function PlayerList({ client }: { client: LocalGameClient }) {
	
	const [peers, setPeers] = React.useState(Array.from(client.getPeers()));
	
	/*React.useEffect(() => client.lobbyPlayerListUpdate.subscribe(() => {
		setPlayerNames(client.getPeerNames());
	}));*/
	
	React.useEffect(() => client.peerAdded.subscribe(peer => {
		setPeers(Array.from(client.getPeers()));
	}));
	React.useEffect(() => client.peerDropped.subscribe(peer => {
		setPeers(Array.from(client.getPeers()));
	}));
	
	return (
		<div id="player-list">
			{ peers.map(peer => <PlayerName key={peer.getID()} name={peer.getName()} />) }
		</div>
	);
	
}

function LobbyHeader({ code, name }: { code: string, name: string }) {
	
	const copyCode = () => {
		navigator.clipboard.writeText(`localhost:5050?code=${code}`);
	};
	
	return (
		<div id="header">
			<div id="code" onClick={copyCode}>{code}</div>
			<div id="name">{name}</div>
		</div>
	);
	
}

export default function Lobby({ client }: { client: LocalGameClient }) {
	
	return (
		<div id="lobby" className="tab">
			<LobbyHeader code={client.getGameCode()} name={client.getGameName()} />
			<PlayerList client={client} />
			
			<div>
				{client.canStartGame() && <button id="start-btn" onClick={() => client.startGame()}>Start</button>}
			</div>
		</div>
	);
	
}


