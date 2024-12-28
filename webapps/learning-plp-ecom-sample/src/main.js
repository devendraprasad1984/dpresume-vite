import React from "react";
import Nav from "./components/common/nav";
import {config} from "./configs/config";
import {connect} from "react-redux";
import Types from "./redux/types";

const Main = (props) => {
    const {handleToggle, toggleLeftPanel} = props

    return <div className='container '>
        <header className="topbar">
            <h1>
                <a onClick={() => handleToggle(!toggleLeftPanel)}>{config.chars.hamburger}</a>
                {config.appName}
            </h1>
        </header>
        <section>
            <Nav/>
        </section>
        <footer className='fixed'>
            <p className='right'>{config.codeBy}, <a href={config.developerPortfolio}>{config.developerPortfolio}</a>
            </p>
        </footer>
    </div>
};
const mapx = (state, own) => {
    return {
        toggleLeftPanel: state.toggleLeftPanel.visible
    }
}
const mapd = (dispatch, own) => {
    return {
        handleToggle: (value) => dispatch(Types().toggleLeftPanel(value))
    }
}
export default connect(mapx, mapd)(Main);
