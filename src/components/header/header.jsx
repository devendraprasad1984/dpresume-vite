import React from 'react';

const Header = () => {
    return <div className="relative wid100 height100p">
        <div className="flex row space-between absolute glass wid100 top">
            <div className="wid10 pad10">
                <img src="images/my-pic.jpeg" className="logo"/>
            </div>
            <div className="mcol flex row space-between wid100 space-fill-100">
                <div className="wid100p mwid100p flex col flex-start space-fill-100">
                    <span className="size38">Devendra Prasad</span>
                    <span>Senior Staff Software Engineer</span>
                </div>
                <div className="wid30 flex col right mwid100p pad10">
                    <span>+91 958 279 7772</span>
                    <span>devendraprasad1984@gmail.com</span>
                </div>
            </div>
        </div>
    </div>
}
export default Header;
