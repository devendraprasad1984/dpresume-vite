import React from 'react';

const Header = () => {
    return <div className="relative wid100 height100p">
        <img src="images/coding-bg.jpeg" alt="coding background" className="wid100 height100p"/>
        <div className="flex row space-between absolute glass wid100 top">
            <div className="wid10">
                <img src="images/my-pic.jpeg" className="logo"/>
            </div>
            <div className="mcol flex row space-between wid100">
                <div className="wid100p mwid100p flex col align-center">
                    <span className="size38">Devendra Prasad</span>
                    <span>Senior Staff Software Engineer</span>
                </div>
                <div className="wid30 flex col right mwid100p">
                    <span>+91 958 279 7772</span>
                    <span>devendraprasad1984@gmail.com</span>
                </div>
            </div>
        </div>
    </div>
}
export default Header;
