

import React from "react";
import client from "../../../client_instance";

import DrawPad from "../../draw_pad";

import { RemoteGameClient } from '../../../game_client';


function GameInfo({ onDoneClicked }: { onDoneClicked: () => void }) {
	
	
	return (
		
		<div id="info">
			<button id="done-btn" onClick={onDoneClicked}>Done!</button>
		</div>
		
	);
	
}

function PlayerName({ player }: { player: RemoteGameClient }) {
	
	const [done, setDone] = React.useState(false);
	
	React.useEffect(() => player.doneDrawing.subscribe(() => {
		setDone(true);
	}), []);
	
	return (
		<div className="player">
			{player.presence.getName()} {done && <span>✅</span>}
		</div>
	);
	
}

function PlayerList() {
	
	return (
		<div id="player-list">
			{Array.from(client.getPeers()).map(peer => <PlayerName key={peer.getID()} player={peer} />)}
		</div>
	);
	
}


export default function Drawing() {
	
	const onDoneClicked = () => client.handleDoneDrawing();
	
	return (
		<div id="drawing" className="tab" >
			<GameInfo onDoneClicked={onDoneClicked} />
			<DrawPad />
			<PlayerList />
		</div>
	);
	
}


