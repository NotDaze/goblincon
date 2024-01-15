

//import React from "react";
import LocalGameClient from "./game_client";

const client = new LocalGameClient("ws://localhost:5050", ["soap"]);

export default client


