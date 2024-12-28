import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {CSS} from "./gcss";
import {Enum} from "./Config";
import AppIcon from "./AppIcon";
import AppButton from "./AppButton";


const thisStyle = {color: Enum.black, textAlign: 'justify'}
export const Heading = props => {
    const {style, stylex, val, icon, click} = props;
    const issub = props.sub === true
    return <View style={[style, CSS.xmargin]}>
        {icon !== undefined ? <AppIcon {...props} name={icon}/> : null}
        <View style={CSS.inrow}>
            <Text style={[issub ? CSS.subheading : CSS.heading, thisStyle, stylex]}>{val}</Text>
            {click !== undefined ? <AppButton title='...' onPress={click}/> : null}
        </View>
    </View>
}
