import React from 'react';
import {TouchableOpacity} from "react-native";
import {FontAwesome as Icon} from '@expo/vector-icons';
import {Enum} from "./Config";

const Back = props => {
    let {onClick} = props;
    let style = {
        height: 30,
        width: 30,
        borderRadius: 20,
        backgroundColor: Enum.black,
        alignItems: "center",
        justifyContent: "center",
    }
    return <TouchableOpacity onPress={onClick} style={style}>
        <Icon name="close"
              color={props.color}
              size={Enum.iconSize + 5}
              onPress={onClick}
        />
    </TouchableOpacity>
}

export default Back;
