import React from "react";
import './App.css';
import Slide from "./components/Slide";
import Slides from "./components/Slides";
import {RecoilRoot} from "recoil";

function App() {
    return (
        <div className="container">
            <RecoilRoot>
            <Slides>
                <Slide page={1}/>
            </Slides>
            </RecoilRoot>
        </div>
    );
}

export default App;
