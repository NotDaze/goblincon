"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//import DrawPadCanvas from "../../Modules/draw_pad_canvas";
const react_1 = __importDefault(require("react"));
//import Canvas from "../../Modules/Client/Rendering/canvas";
const connecting_1 = __importDefault(require("./Tabs/connecting"));
const landing_1 = __importDefault(require("./Tabs/landing"));
const lobby_1 = __importDefault(require("./Tabs/lobby"));
const game_client_1 = __importDefault(require("../game_client"));
//import { GAME_CREATE_RESPONSE } from "../../MessageLists/game_signaling";
//const urlParams = new URLSearchParams(window.location.search);
const client = new game_client_1.default("ws://localhost:5050", ["soap"]);
//const [tab, setTab] = React.createContext<Tab>("lobby");
/*client.serverConnected.connect(() => {
        
    let joinCode = urlParams.get("join");
    
    if (joinCode === null)
        setTab("lobby");
    else
        client.joinGame(joinCode);
    
});*/
/*export default class App extends React.Component {
    
    constructor(props: {}) {
        
        super(props, {
            tab: 2
        });
        
        this.state = {
            tab: 2
        };
        
        
        
    }
    
    
    render() {
        
        return (
            <div id="app" className="flex">
                { this.state.tab === "loading" && <LoadingTab /> }
                { this.state.tab === "lobby" && <LobbyTab /> }
            </div>
        );
        
    }
    
}*/
function App() {
    const [tab, setTab] = react_1.default.useState(react_1.default.createElement(connecting_1.default, { client: client }));
    react_1.default.useEffect(() => client.serverConnected.subscribe(() => {
        setTab(react_1.default.createElement(landing_1.default, { client: client }));
    }));
    react_1.default.useEffect(() => client.serverDisconnected.subscribe(() => {
        setTab(react_1.default.createElement(connecting_1.default, { client: client }));
    }));
    react_1.default.useEffect(() => {
        return client.connected.subscribe(() => {
            //setTab(<Game />);
            //setTab(<Lobby />);
        });
    });
    react_1.default.useEffect(() => client.gameJoined.subscribe(() => {
        setTab(react_1.default.createElement(lobby_1.default, { client: client }));
        //setTab(<Game client={client} />);
    }));
    react_1.default.useEffect(() => client.gameLeft.subscribe(() => {
        setTab(react_1.default.createElement(landing_1.default, { client: client }));
    }));
    //<DrawPad />
    return (react_1.default.createElement("div", { id: "app" }, tab));
}
exports.default = App;
