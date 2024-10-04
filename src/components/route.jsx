import React from "react";
import {Route, Routes} from "react-router-dom";
import Home from "./routes/home.jsx";
import About from "./routes/about.jsx";
import ProjectList from "./routes/projectList.jsx";
import AppsList from "./routes/appsList.jsx";

const AppRoutes = () => {
  return <div className="">
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/about" element={<About/>}/>
      <Route path="/projects" element={<ProjectList/>}/>
      <Route path="/apps" element={<AppsList/>}/>
    </Routes>
  </div>;
};
export default AppRoutes;
