import {SafeAreaView, Text, View} from "react-native";
import React, {useEffect, useState} from "react";
import {appColor, CSS} from "./gcss";
import {connect} from "react-redux";
import {Enum} from "./Config";
import AppButton from "./AppButton";
import {Heading} from "./Heading";

const TopAppName = props => {
    const {navigation, config, agent} = props;
    const color = appColor(props.color)
    const [appText, setAppText] = useState('N');
    const {name,id,agentid}=agent.info||{name:'user',id:-1,agentid:-1}

    useEffect(() => {
        setAppText(config[Enum.configKeys.appText])
    }, [])

    let clickFuncToCall = undefined;
    clickFuncToCall = props.clicked;
    if (clickFuncToCall === undefined) clickFuncToCall = navigation.goBack;

    return <SafeAreaView style={[CSS.inrow]}>
        <View>
            <Heading val={appText} stylex={{fontSize:15}}/>
            <Heading sub={true} val={`hi, ${name} / ${agentid}`} stylex={{fontSize:11}}/>
        </View>
        <AppButton icon={'close'} onPress={clickFuncToCall}/>
    </SafeAreaView>
}
const mapx = state => {
    return {
        config: state.config.config,
        agent: state.agent.agent,
        color: state.config.color
    }
}
export default connect(mapx)(TopAppName)


