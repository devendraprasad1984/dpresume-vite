import {Modal, ScrollView, StyleSheet, Text, View} from "react-native";
import React, {Component} from "react";
import {appColor, CSS} from "./gcss";
import TopAppName from "./topAppName";
import AppImage from "./AppImage";
import {Enum} from "./Config";
import NoDataFound from "./noDataFound";


const styles = StyleSheet.create({
    modalview: {
        flex: 3,
        textAlign: "center",
        overflow: "scroll",
        zIndex: 9999,
    }, desc: {
        padding: 5,
        textAlign: "justify"
    }, about: {
        fontSize: 15,
        padding: 5,
        marginTop: 1,
        fontWeight: 'bold',
    }
});


export default class Popup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            header: '',
            content: '',
            isimage: false
        };
    }

    show = (header, content, img = false) => {
        if (img === false)
            this.setState({modal: true, header, content, isimage: false});
        else if (img === true)
            this.setState({modal: true, header, content, isimage: true});
    }
    hide = () => {
        this.setState({modal: false});
    }

    displayImage=(imgdata=[])=>{
        if(imgdata.length===0) return <NoDataFound val='No Images to Load...'/>
        return imgdata.map((x,i)=>{
            return <View key={'imgpop'+i}><AppImage uri={x.uri} style={[CSS.ordimg]}/></View>
        })
    }


    render() {
        let color = appColor();
        return (
            <Modal transparent={false} visible={this.state.modal}>
                <TopAppName clicked={this.hide} navigation={this.props.navigation}/>
                <ScrollView style={styles.modalview}>
                    <View style={styles.modalview}>
                        <Text style={[styles.about, color]}
                              onPress={() => this.hide()}>{this.state.header}</Text>
                        {!this.state.isimage ? <Text style={[styles.desc, CSS.para, color]}>{this.state.content}</Text>:null}
                        {this.state.isimage ? <View style={CSS.xview}>{this.displayImage(this.state.content)}</View>:null}
                    </View>
                </ScrollView>
            </Modal>
        );
    }
}
