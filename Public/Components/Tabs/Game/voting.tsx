

import React from "react";
import client from "../../../client_instance";
//import { RemoteGameClient } from "../../../game_client";
//import LocalGameClient from '../../../game_client';

function VoteBtn({ playerID }: { playerID: number }) {
	
	const [enabled, setEnabled] = React.useState(true);
	
	React.useEffect(() => (
		client.doneVoting.subscribe(() => setEnabled(false),
		client.scoringStarted.subscribe(() => setEnabled(false)))
	), []);
	
	return (
		<div id="vote-btn-ctr">
			<button
				className="vote-btn"
				disabled={!enabled}
				onClick={() => client.submitVote(playerID)}
			>
				Vote!
			</button>
		</div>
	);
	
}

function PlayerSubmission({ playerID }: { playerID: number }) {
	
	const [voteCount, setVoteCount] = React.useState(-1); // Slightly janky
	
	React.useEffect(() => client.scoringStarted.subscribe(() => {
		setVoteCount(client.getVoteCount(playerID));
	}), []);
	
	let presence = client.getPresence(playerID);
	let isClient = (playerID === client.getID())
	
	if (!presence) {
		console.error("<PlayerSubmission /> created for invalid player.");
		return <div></div>;
	}
	
	let voteCountStr: string;
	
	if (voteCount < 0) {
		voteCountStr = "";
	}
	else if (voteCount === 0) {
		voteCountStr = "0 votes";
	}
	else {
		
		if (isClient)
			voteCountStr = `${voteCount} vote${voteCount > 1 ? "s" : ""}!`;
		else
			voteCountStr = `${voteCount} vote${voteCount > 1 ? "s" : ""}`;
		
	}
	
	/*let voteCountStr = voteCount < 0 ? "" : (
		voteCount === 0 ? "0 votes" : (
			`${voteCount} vote${voteCount > 1 ? "s" : ""}${isClient ? "!" : ""}`
		)
	);*/
	
	return (
		<div className={`submission box-ctr${isClient ? " client" : ""}`}>
			<img className="image" src={presence.getDrawing(client.getRound())}></img>
			<div className="footer">
				<div className="name">{presence.getName()}</div>
				<div className="vote-count">
					{voteCountStr}
				</div>
				{!isClient && <VoteBtn playerID={playerID} />}
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
				<PlayerSubmission key={client.getID()} playerID={client.getID()} />
				{Array.from(client.getPeerIDs()).map(id => <PlayerSubmission key={id} playerID={id} />)}
			</div>
		</div>
	);
}


