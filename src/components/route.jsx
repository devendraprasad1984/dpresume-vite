import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./routes/home.jsx";
import About from "./routes/about.jsx";
import ProjectList from "./routes/projectList.jsx";
import AppsHome from "../apps/appsHome.jsx";
import JsConcepts from "../apps/js-concepts/jsConcepts.jsx";

const AppRoutes = () => {
  return <Routes>
    <Route path="/" element={<Home/>}/>
    <Route path="/about" element={<About/>}/>
    <Route path="/projects" element={<ProjectList/>}/>
    <Route path="/apps/:id" element={<AppsHome/>}/>
    <Route path="/apps" element={<AppsHome/>}/>
    <Route path="/js-concepts" element={<JsConcepts/>}/>
  </Routes>;
};
export default AppRoutes;
