import app_enums from "../configs/enums";
import App from "../App";
import Facets from "../screens/facets";
import Products from "../screens/products";
import ProductDetail from "../screens/productdetail";
import React from "react";
import ReactRouter from 'react-router'

// const matchParam = {params: {id: 1}, exact: false, path: "", url: ""}
const productDetailRoute=jest.spyOn(ReactRouter, 'useParams').mockReturnValue({ id: 1 })
const appComponents = [
    {name: app_enums.app, desc: app_enums.app, component: <App/>},
    {name: app_enums.facets, desc: app_enums.facets, component: <Facets/>, isRedux: true},
    {name: app_enums.products, desc: app_enums.products, component: <Products/>, isRedux: true},
    {name: app_enums.productDetails, desc: app_enums.productDetails, component: <ProductDetail/>, routeMock: productDetailRoute},
];

export default appComponents


describe("ignore", () => {
    it("ignore this", () => {
        expect(1).toEqual(1);
    });
});