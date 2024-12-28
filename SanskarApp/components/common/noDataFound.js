import React from 'react';
import {View, Text} from 'react-native';
import {CSS} from "./gcss";
import {Enum} from "./Config";

export default function NoDataFound(props, {navigation}) {
    const {val,stylex} = props
    const txt = val === undefined ? 'No Data Found!' : val
    return (<View>
        <Text style={[CSS.center, CSS.xmargin, {color:Enum.darkGray}, stylex]}>{txt}</Text>
    </View>);
}
