import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Game from "./components/new/Game";
import MainMenu from "./components/new/MainMenu";
// import StartGame from "./components/StartGame";
// import GamePanel from "./components/GamePanel";
// import Topics from "./components/Topics";
// import Quiz from "./components/Quiz";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainMenu />} />
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
