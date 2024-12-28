import React from "react";
import PropTypes from "prop-types";
import Products from "./products";
import Facets from "./facets";
import pageTitles from "../configs/pageTitles";
import {connect} from "react-redux";
import Types from "../redux/types";

const Home = props => {
    const {toggleLeftPanel,handleToggle} = props


    return <div>
        <div className='row margin-ud'>
            {toggleLeftPanel && <div className='leftPanel size300'>
                <Facets title={pageTitles.facets} handleLeftPane={()=>handleToggle(!toggleLeftPanel)}/>
            </div>}
            <div className='rightPanel'><Products title={pageTitles.products}/></div>
        </div>
    </div>
}

Home.propTypes = {
    title: PropTypes.string
}
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

export default connect(mapx, mapd)(Home)