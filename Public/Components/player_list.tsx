

import React from "react";
import client from "../client_instance";


function PlayerName({ id }: { id: number }) {
	
	let presence = client.getPresence(id);
	
	if (!presence) {
		
	}
	
	return (
		<div className="player box-item">
			<span>{presence?.score.get()}</span>
		</div>
	);
	
}

function PlayerList() {
	
	return (
		<div className="player-list box-ctr">
			{Array.from(client.getPeers()).map(peer => <PlayerName key={peer.getID()} player={peer} />)}
		</div>
	);
	
}

