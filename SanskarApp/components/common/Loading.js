import {ActivityIndicator, Text, View} from "react-native";
import React from "react";
import {appColor, CSS} from "./gcss";
import {connect} from "react-redux";
import {Enum} from "./Config";

const Loading=props=> {
    let loadingDefaultText=props.text || 'working...';
    let color=appColor(props.color);
    return <View style={[CSS.center,{flex:1}] }>
        <ActivityIndicator size="large" color={props.color||Enum.orange}/>
        <Text style={[color]}>
            {loadingDefaultText}
        </Text>
    </View>
}
const mapx = state => {
    return {
        config: state.config.config,
        color: state.config.color
    }
}
export default connect(mapx)(Loading)

