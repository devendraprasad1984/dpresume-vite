import * as React from 'react';
import {View} from 'react-native';
import * as Speech from 'expo-speech';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Enum} from "./Config";
import {CSS} from "./gcss";

export default class Text2Speech extends React.Component {
    constructor(props) {
        super(props);
        this.text = this.props.val;
        this.state = {
            currentIcon: 'speak'
        }
        this.speak = <Icon name="play" color={'tomato'} size={Enum.iconSize} onPress={this.handleSpeak}/>;
        this.mute = <Icon name="stop" color={'tomato'} size={Enum.iconSize} onPress={this.handleStop}/>;
        this.speakOptions = {
            pitch: 1,
            rate: 1
        };
    }

    handleSpeak = () => {
        this.setState({currentIcon: 'stop'});
        Speech.speak(this.text.substr(0, Speech.maxSpeechInputLength), this.speakOptions);
    }
    handleStop = () => {
        this.setState({currentIcon: 'speak'});
        if(Speech.isSpeakingAsync()) Speech.stop();
    }
    handleIconToggle = () => {
        // if(this.text.length> Speech.maxSpeechInputLength) return null;
        return this.state.currentIcon === 'speak' ? this.speak : this.mute;
    }

    render() {
        return (
            <View style={CSS.rightAlign}>
                {this.handleIconToggle()}
            </View>
        );
    }
}
