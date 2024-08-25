import React from 'react';
import Left from "./left/left.jsx";
import Center from "./center/center.jsx";
import Right from "./right/right.jsx";

const Body = () => {
    return <React.Fragment>
        <div className="wid10 main-left mwid100p"><Left/></div>
        <div className="wid100 main-center mwid100p min-height-450"><Center/></div>
        <div className="wid20 main-right mwid100p"><Right/></div>
    </React.Fragment>
};
export default Body;