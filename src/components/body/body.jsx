import React from 'react';
import Left from "./component/left.jsx";
import Center from "./component/center.jsx";
import Right from "./component/right.jsx";

const Body = () => {
    return <React.Fragment>
        <div className="wid20 main-left mwid100p border-right pad10"><Left/></div>
        <div className="wid100 main-center mwid100p min-height-450 pad10"><Center/></div>
        <div className="wid20 main-right mwid100p border-left pad10"><Right/></div>
    </React.Fragment>
};
export default Body;