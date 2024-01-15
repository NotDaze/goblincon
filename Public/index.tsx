import React from "react";
import { createRoot } from "react-dom/client";

import App from "./Components/app";

const root = createRoot(document.getElementById("root")!);
root.render(<App />);

/*gameClient.serverConnected.connect(() => {
	gameClient.createGame();
});*/
