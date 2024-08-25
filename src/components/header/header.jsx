import React from 'react';

const Header = () => {
    return <div className="flex row space-between">
        <div className="wid10">my pic</div>
        <div className="wid60 flex col align-center">
            <span>Devendra Prasad</span>
            <span>Senior Staff Software Engineer</span>
        </div>
        <div className="wid30 flex col right">
            <span>+91 958 279 7772</span>
            <span>devendraprasad1984@gmail.com</span>
        </div>
    </div>
}
export default Header;
