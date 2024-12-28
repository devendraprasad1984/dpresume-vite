/* eslint-disable */
import React from "react";
import pageTitles from "./pageTitles";
import Home from "../screens/home";
import ProductDetail from "../screens/productdetail";
import navigate from "./navigate";


const menu = [
    {
        name: navigate.home,
        action: "",
        uri: "",
        icon: "",
        component: <Home title={pageTitles.home}/>,
    },
    {
        name: `${navigate.productDetail}/:id`,
        action: "",
        uri: "",
        icon: "",
        component: <ProductDetail title={pageTitles.productDetails}/>,
    },

];
export default menu;
