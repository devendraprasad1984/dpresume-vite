import {TextInput, Keyboard, View} from 'react-native';
import React, {Component, createRef} from 'react';
import {Enum} from "./Config";
import {connect} from "react-redux";
import AppIcon from "./AppIcon";
import {CSS} from "./gcss";

class CustomInput extends Component {
    constructor(props) {
        super(props);
        this.input = createRef();
    }

    render() {
        const {onChange, placeholder, multiline, width, type, icon, submit, value} = this.props;
        const inputStyle = {
            width: '90%',
            borderColor: this.props.color || Enum.purple,
            textAlignVertical: 'top',
            height: (multiline === true ? 120 : undefined)
        }
        const inputView = {
            borderWidth: 1.3,
            borderRadius: 5,
            margin: 3,
            padding: 5,
            width: (width !== undefined ? width : Enum.maxwidth - 20)
        }
        const pwd = type === 'password' ? true : false;
        let xsubmit = submit;
        if (submit === undefined) xsubmit = () => {
        }
        return <View style={[inputView, CSS.inrow]}>
            {icon !== undefined ? <AppIcon {...this.props} name={icon}/> : null}
            <TextInput
                multiline={multiline}
                secureTextEntry={pwd}
                ref={this.input}
                autoCorrect={false}
                placeholder={placeholder}
                style={inputStyle}
                placeholderTextColor={this.props.color || Enum.purple}
                underlineColorAndroid="transparent"
                onChangeText={onChange}
                onSubmitEditing={() => {
                    if (multiline) return
                    Keyboard.dismiss();
                    xsubmit();
                }}
                keyboardType="default"
                returnKeyType="done"
                {...this.props}
            />
        </View>
    }
}

const mapx = state => {
    return {
        config: state.config.config,
        color: state.config.color
    }
}
export default connect(mapx)(CustomInput)
