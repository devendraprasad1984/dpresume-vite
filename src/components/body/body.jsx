import React from 'react';
import Left from "./left/left.jsx";
import Center from "./center/center.jsx";
import Right from "./right/right.jsx";

const Body = () => {
    return <React.Fragment>
        <div className="wid10 main-left"><Left/></div>
        <div className="wid100 main-center"><Center/></div>
        <div className="wid20 main-right"><Right/></div>
    </React.Fragment>
};
export default Body;