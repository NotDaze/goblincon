

//import React from "react";
import LocalGameClient from "./game_client";

const socketURLprefix = window.location.hostname === "localhost" ? "ws://" : "wss://";
const socketURL = socketURLprefix + window.location.host;

const client = new LocalGameClient(socketURL, ["soap"]);

export default client


