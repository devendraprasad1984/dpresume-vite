import React from 'react';
import {Route, Routes} from "react-router-dom";
import Home from "../../routes/home.jsx";
import About from "../../routes/about.jsx";

const Center = () => {
    return <div className="">
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/about" element={<About/>}/>
        </Routes>
    </div>
}
export default Center;
