import React, {useEffect, useState} from 'react';
import {Text, View, SafeAreaView} from 'react-native';
import {appColor, CSS} from "../common/gcss";
import {Enum} from "../common/Config";
import SupportQueries from './SupportQueries';
import TopAppName from "../common/topAppName";
import {connect} from "react-redux";
import {Heading} from "../common/Heading";
import SupportResponse from "./SupportResponse";

const Support = props => {
    const {config} = props;
    const [contactus, setContactus] = useState('');
    useEffect(() => {
        setContactus(config[Enum.configKeys.contactus]);
    }, []);
    return <SafeAreaView style={CSS.xview}>
        <TopAppName  {...props}/>
        <Heading val={'Support'}/>
        <Heading sub={true} val={contactus}/>
        <SupportQueries {...props}/>
        <SupportResponse {...props}/>
    </SafeAreaView>
}
const mapx = state => {
    return {
        config: state.config.config,
        color: state.config.color,
        agent: state.agent.agent
    }
}
export default connect(mapx)(Support)



