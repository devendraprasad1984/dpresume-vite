import React from 'react';
import Left from "./component/left.jsx";
import Center from "./component/center.jsx";
import Right from "./component/right.jsx";

const Body = () => {
    return <React.Fragment>
        <div className="wid20 main-left mwid100p"><Left/></div>
        <div className="wid100 main-center mwid100p min-height-450 center-route-container overflow"><Center/></div>
        <div className="wid20 main-right mwid100p"><Right/></div>
    </React.Fragment>
};
export default Body;