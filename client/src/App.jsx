import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Game from "./components/new/Game";
import MainMenu from "./components/new/MainMenu";
import JoinGame from "./components/new/JoinGame";
import StartGame from "./components/new/StartGame";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainMenu />} />
                <Route path="/join" element={<JoinGame />} />
                <Route path="/start" element={<StartGame />} />
                <Route path="/game/:id" element={<Game />} />
            </Routes>
        </BrowserRouter>
    );
    // return (
    //   <>
    //     {/* <StartGame /> */}
    //     {/* <GamePanel/>
    //       <Topics/>
    //       <Quiz/> */}
    //   </>
    // );
}

export default App;
