import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {appColor, bgColor, CSS} from "./gcss";
import AppIcon from "./AppIcon";
import {Enum} from "./Config";
import {connect} from 'react-redux';

const AppButton = props => {
    const {onPress, title, width, icon, style} = props;
    const issave = (title || '').toLowerCase() === 'save'
    const saveName = issave ? 'save' : icon
    const widthX = width === undefined && issave ? 70 : width
    // console.log('button',saveName)
    let bg = bgColor(props.btn || Enum.mintCream);
    let txt = appColor(props.txt || Enum.greenYellow);
    return <TouchableOpacity onPress={onPress} style={[CSS.button, bg, {width: widthX}]}>
        <View style={[CSS.inrow, CSS.center,{opacity:0.7}]}>
            {(icon !== undefined || issave) ? <AppIcon {...props} name={saveName}/> : null}
            <Text style={[{fontWeight: 'bold'}, style, txt]}>{title}</Text>
        </View>
    </TouchableOpacity>;
};
const mapx = state => {
    return {
        btn: state.config.btn
        , txt: state.config.txt
    }
}
export default connect(mapx)(AppButton)

