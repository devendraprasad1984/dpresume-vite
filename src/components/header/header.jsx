import React from 'react';

const Header = () => {
    return <div className="relative wid100 height100">
        <img src="images/coding-bg.jpeg" alt="coding background" className="wid100 height100"/>
        <div className="flex row space-between absolute glass wid100 top height100p">
            <div className="wid10">my pic</div>
            <div className="wid60 flex col align-center">
                <span className="size38">Devendra Prasad</span>
                <span>Senior Staff Software Engineer</span>
            </div>
            <div className="wid30 flex col right">
                <span>+91 958 279 7772</span>
                <span>devendraprasad1984@gmail.com</span>
            </div>
        </div>
    </div>
}
export default Header;
