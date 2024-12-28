/* eslint-disable */
import React from "react";
import Home from "../components/screens/home/home";
import pageTitles from "./pageTitles";
import ShowAuth0Info from "../components/screens/login/showAuth0Info";
import Profile from "../components/screens/login/profile";
import Login from "../components/screens/login/login";
import AdminBoard from "../components/screens/admin/adminBoard";
import ExpenseViews from "../components/screens/expenseViews";
import GoverningBody from "../components/screens/governingBody/governingBody";

const menu = [
  {
    name: "Home",
    action: "",
    uri: "",
    icon: "",
    component: <Home title={pageTitles.home}/>,
    show: true,
    isBehindAdmin: false,
    isBehindAuth: true,
    isInLeftPanelNav: true
  },
  {
    name: "Login",
    action: "",
    uri: "",
    icon: "",
    component: <Login title={pageTitles.login}/>,
    show: false,
    isBehindAdmin: false,
    isBehindAuth: false,
    isInLeftPanelNav: false
  },
  {
    name: "Admin",
    action: "",
    uri: "",
    icon: "",
    component: <AdminBoard title={pageTitles.adminBoard}/>,
    show: true,
    isBehindAdmin: true,
    isInLeftPanelNav: true,
    isBehindAuth: true
  },
  {
    name: "Expenses View",
    action: "",
    uri: "",
    icon: "",
    component: <ExpenseViews title={pageTitles.expensesView}/>,
    show: true,
    isBehindAdmin: false,
    isInLeftPanelNav: true,
    isBehindAuth: true
  },
  {
    name: "Governing Members",
    action: "",
    uri: "",
    icon: "",
    component: <GoverningBody title={pageTitles.governingBody}/>,
    show: true,
    isBehindAdmin: false,
    isInLeftPanelNav: true,
    isBehindAuth: false
  },
  {
    name: "User Auth0 Info",
    action: "",
    uri: "",
    icon: "",
    component: <ShowAuth0Info title={pageTitles.auth0Title}/>,
    show: false,
  },
  {
    name: "Profile",
    action: "",
    uri: "",
    icon: "",
    show: true,
    component: <Profile title={pageTitles.profile}/>,
    isBehindAdmin: false,
    isInLeftPanelNav: true,
    isBehindAuth: true
  },
];
export default menu;
