import React, {useEffect} from "react";
import {connect} from "react-redux";
import * as actions from './redux/actions'

const Signout = props => {
    const {history}=props

    useEffect(()=>{
        //componentDidMount
        props.signout()
        history.push('/')
    })

    return <div>
        <h2>sorry to see you go</h2>
    </div>
}

export default connect(null, actions)(Signout)
