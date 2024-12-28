import React from 'react'
import {View} from 'react-native'
import {CSS} from "./gcss"
import {Heading} from "./Heading";
import {Enum} from "./Config";

export default function AlertX(props) {
    const {saved, val, cb} = props
    const stx = {
        fontSize: 30,
        color: Enum.orangered
    }
    // console.log(val, saved)
    if (saved) setTimeout(() => cb(!saved), 1000)
    return <View style={[CSS.bottomx, CSS.center, {marginBottom: 50}]}>
        <Heading val={saved ? val : ''} stylex={stx}/>
    </View>
}
