

import React from "react";
import DrawPad from "../../draw_pad";

import LocalGameClient, { RemoteGameClient } from '../../../game_client';


function GameInfo({ client }: { client: LocalGameClient }) {
	
	
	return (
		
		<div id="info">
			
		</div>
		
	);
	
}

function PlayerName({ player }: { player: RemoteGameClient }) {
	
	const [finished, setFinished] = React.useState(false);
	
	React.useEffect(() => player.drawingFinished.subscribe(() => {
		setFinished(true);
	}));
	
	return (
		<div>
			{player.getName()} {finished && <span>✅</span>}
		</div>
	);
	
}

function PlayerList({ client }: { client: LocalGameClient }) {
	
	
	
	return (
		<div id="player-list">
			{Array.from(client.getPeers()).map(peer => <PlayerName player={peer} />)}
		</div>
	);
	
}


export default function Drawing({ client }: { client: LocalGameClient }) {
	
	const [tab, setTab] = React.useState();
	
	return (
		<div id="drawing" className="tab" >
			<GameInfo client={client} />
			<DrawPad />
			<PlayerList client={client} />
		</div>
	);
	
}


