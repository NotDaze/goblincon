

import React from "react";
import client from "../../../client_instance";

import DrawPad from "../../draw_pad";

import LocalGameClient, { RemoteGameClient } from '../../../game_client';
import { Countdown } from "../../countdown";


function RoundInfo() {
	
	return (
		
		<div id="round-info">
			<div>Draw a creature named...</div>
			<div id="creature-name">{client.getCreatureName()}</div>
			<Countdown time={Date.now() + LocalGameClient.DRAWING_TIME} />
		</div>
		
	);
	
}

function PlayerName({ player }: { player: RemoteGameClient }) {
	
	const [done, setDone] = React.useState(false);
	
	React.useEffect(() => player.doneDrawing.subscribe(() => {
		setDone(true);
	}), []);
	
	return (
		<div className="player box-item">
			<span>{player.presence.getName()}</span>
			{done && <span>✅</span>}
		</div>
	);
	
}

function PlayerList() {
	
	return (
		<div id="player-list" className="box-ctr">
			{Array.from(client.getPeers()).map(peer => <PlayerName key={peer.getID()} player={peer} />)}
		</div>
	);
	
}

/*function DoneBtn({ onClick }: { onClick: () => void }) {
	return (
		
	);
}*/

function DoneBtn({ onClick }: { onClick: () => void }) {
	
	const [enabled, setEnabled] = React.useState(true);
	
	React.useEffect(() => (
		client.doneDrawing.subscribe(() => setEnabled(false))
	), []);
	
	return <button id="done-btn" disabled={!enabled} onClick={onClick}>Done!</button>;
	
}

export default function Drawing() {
	
	//const onDoneClicked = () => client.handleDoneDrawing();
	
	//<GameInfo onDoneClicked={onDoneClicked} />
	
	
	
	return (
		<div id="drawing" className="tab" >
			
			<RoundInfo />
			
			<div id="drawpad-ctr">
				<DrawPad />
				<DoneBtn onClick={() => client.handleDoneDrawing()} />
			</div>
			
			<PlayerList />
			
		</div>
	);
	
}


