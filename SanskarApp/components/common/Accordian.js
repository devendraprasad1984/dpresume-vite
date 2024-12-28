import React, {Component, createRef} from 'react';
import {LayoutAnimation, Linking, Platform, ScrollView, Text, TouchableOpacity, UIManager, View} from "react-native";
import AppIcon from "./AppIcon";
import {Heading} from "./Heading";
import {CSS} from "./gcss";

export default class Accordian extends Component {
    constructor(props) {
        super(props);
        this.accordian = createRef();
        this.state = {
            data: props.data,
            expanded: false,
        }
        if (Platform.OS === 'android') {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
    }

    render() {
        return (
            <View>
                <TouchableOpacity ref={this.accordian} style={[CSS.inrow]} onPress={() => this.toggleExpand()}>
                    <Heading val={this.props.title}/>
                    <AppIcon mat={true} name={this.state.expanded ? 'mouse-off' : 'mouse'}
                             onPress={() => this.toggleExpand()}/>
                </TouchableOpacity>
                {
                    this.state.expanded &&
                    <ScrollView>
                        <View style={[CSS.inrow]}>
                            {this.props.link !== undefined && this.props.link !== '' ?
                                <AppIcon name="google-chrome" mat={true}
                                         onPress={() => Linking.openURL(this.props.link)}/> : null}
                        </View>
                        <View>
                            <Text>{this.props.data}</Text>
                        </View>
                    </ScrollView>
                }

            </View>
        )
    }

    toggleExpand = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        this.setState({expanded: !this.state.expanded})
    }
}
