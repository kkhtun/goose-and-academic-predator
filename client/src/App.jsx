import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Game from "./components/Game";
import MainMenu from "./components/MainMenu";
import JoinGame from "./components/JoinGame";
import StartGame from "./components/StartGame";

function App() {
    return (
        <>
            <ToastContainer />
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<MainMenu />} />
                    <Route path="/join" element={<JoinGame />} />
                    <Route path="/start" element={<StartGame />} />
                    <Route path="/game/:gameId" element={<Game />} />
                </Routes>
            </BrowserRouter>
        </>
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
