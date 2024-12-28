import {FontAwesome, Ionicons, MaterialCommunityIcons} from "@expo/vector-icons";
import {Enum} from "./Config";
import React from "react";
import {TouchableOpacity, View} from "react-native";
import {connect} from "react-redux";
import {bgColor} from "./gcss";


const AppIcon = props => {
    const {name, onPress, mat, size, style, ion, color, btn} = props
    const xstyle = {padding: 1, margin: 1}
    const bg = bgColor(btn)

    const displayIcon = () => {
        if (ion) return <View style={[style, xstyle]}>
            <Ionicons name={name} size={size || Enum.iconSize}
                      color={color || Enum.purple} onPress={onPress}/></View>
        else if (mat) return <View style={[style, xstyle]}>
            <MaterialCommunityIcons name={name}
                                    size={size || Enum.iconSize}
                                    color={color || Enum.purple}
                                    onPress={onPress}/></View>
        else return <View style={[style, xstyle]}>
                <FontAwesome name={name} color={color || Enum.purple}
                             size={size || Enum.iconSize} onPress={onPress}/></View>
    }
    return <TouchableOpacity
        onPress={onPress}
        style={[bg, {margin: 1, borderRadius: 40}]}>
        {displayIcon()}
    </TouchableOpacity>;
}

const mapx = state => {
    return {
        color: state.config.txt
        , btn: state.config.btn
    }
}
export default connect(mapx)(AppIcon)
