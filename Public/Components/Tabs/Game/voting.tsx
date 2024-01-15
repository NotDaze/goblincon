

import React from "react";
import client from "../../../client_instance";
import { RemoteGameClient } from "../../../game_client";
//import LocalGameClient from '../../../game_client';

function PlayerSubmission({ player }: { player: RemoteGameClient }) {
	
	return (
		<div className="submission">
			<img className="image" src={player.presence.getDrawing(client.getRound())}></img>
			<div className="name">{player.presence.getName()}</div>
		</div>
	);
	
}


export default function Voting() {
	
	return (
		<div id="voting" className="tab" >
			<div id="submissions">
				{Array.from(client.getPeers()).map(player => <PlayerSubmission player={player} />)}
			</div>
		</div>
	);
}


