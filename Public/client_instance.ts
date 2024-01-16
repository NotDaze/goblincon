

//import React from "react";
import LocalGameClient from "./game_client";

const socketURLprefix = window.location.hostname === "localhost" ? "ws://" : "wss://";
const socketURL = socketURLprefix + window.location.host;

const client = new LocalGameClient(socketURL, ["soap"], {
	iceServers: [
		{
			urls: "stun:stun.relay.metered.ca:80",
		},
		{
			urls: "turn:standard.relay.metered.ca:80",
			username: "2ef61ca96831562e93adee6e",
			credential: "4LHSifzz+bZex76+",
		},
		{
			urls: "turn:standard.relay.metered.ca:80?transport=tcp",
			username: "2ef61ca96831562e93adee6e",
			credential: "4LHSifzz+bZex76+",
		},
		{
			urls: "turn:standard.relay.metered.ca:443",
			username: "2ef61ca96831562e93adee6e",
			credential: "4LHSifzz+bZex76+",
		},
		{
			urls: "turns:standard.relay.metered.ca:443?transport=tcp",
			username: "2ef61ca96831562e93adee6e",
			credential: "4LHSifzz+bZex76+",
		},
	],
});

export default client


