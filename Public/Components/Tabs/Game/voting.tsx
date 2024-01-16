

import React from "react";
import client from "../../../client_instance";
import { RemoteGameClient } from "../../../game_client";
//import LocalGameClient from '../../../game_client';

function VoteBtn({ player }: { player: RemoteGameClient }) {
	
	let [enabled, setEnabled] = React.useState(true);
	
	React.useEffect(() => (
		client.doneVoting.subscribe(() => setEnabled(false),
		client.scoringStarted.subscribe(() => setEnabled(false)))
	), []);
	
	return (
		<div id="vote-btn-ctr">
			<button
				className="vote-btn"
				disabled={!enabled}
				onClick={() => client.submitVote(player)}
			>
				Vote!
			</button>
		</div>
	);
	
}

function PlayerSubmission({ player }: { player: RemoteGameClient }) {
	
	const [voteCount, setVoteCount] = React.useState(0);
	
	React.useEffect(() => client.scoringStarted.subscribe(() => {
		setVoteCount(client.getVoteCount(player.getID()));
	}), []);
	
	return (
		<div className="submission box-ctr">
			<img className="image" src={player.presence.getDrawing(client.getRound())}></img>
			<div className="footer">
				<div className="name">{player.presence.getName()}</div>
				<div className="vote-count">
					{voteCount > 0 ? voteCount : ""}
				</div>
				<VoteBtn player={player} />
			</div>
		</div>
	);
	
}


export default function Voting() {
	
	/*React.useEffect(() => (
		client.scoringStarted.subscribe(() => )
	));*/
	
	return (
		<div id="voting" className="tab" >
			<div id="submissions">
				{Array.from(client.getPeers()).map(player => <PlayerSubmission key={player.getID()} player={player} />)}
			</div>
		</div>
	);
}


