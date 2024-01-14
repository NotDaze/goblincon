

import React from "react";
import DrawPad from "../draw_pad";
import LocalGameClient from '../../game_client';




export default function Game({ client }: { client: LocalGameClient }) {
	return (
		<div className="tab" id="game">
			<DrawPad />
		</div>
	);
}


