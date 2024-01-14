

import React from "react";
import LocalGameClient from "../../game_client";

export default function Connecting({ client }: { client?: LocalGameClient }) {
	
	return (
		<div id="connecting" className="tab">
			Connecting...
		</div>
	);
	
}


