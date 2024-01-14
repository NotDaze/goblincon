

import React from "react";
import LocalGameClient from "../../game_client";


function PlayerEntry({ name }: { name: string }) {
	
	return (
		<div>{name}</div>
	);
	
}

function PlayerList({ client }: { client: LocalGameClient }) {
	
	const [playerNames, setPlayerNames] = React.useState(client.getPeerNames());
	
	React.useEffect(() => client.lobbyPlayerListUpdate.subscribe(() => {
		setPlayerNames(client.getPeerNames());
	}));
	
	return (
		<div id="player-list">
			{playerNames.map(name => <PlayerEntry name={name} />)}
		</div>
	);
	
}

function LobbyCode({ code }: { code: string }) {
	
	const copyCode = () => {
		navigator.clipboard.writeText(`localhost:5050?code=${code}`);
	};
	
	return (
		<h2 id="code" onClick={copyCode}>{code}</h2>
	);
	
}

export default function Lobby({ client }: { client: LocalGameClient }) {
	
	return (
		<div id="lobby">
			<LobbyCode code={client.getGameCode()} />
			<PlayerList client={client} />
			<button id="start-btn"></button>
		</div>
	);
	
}


