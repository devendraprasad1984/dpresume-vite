import React from 'react';
import {Linking, View, ScrollView, SafeAreaView, Text} from 'react-native';
import {CSS} from "../common/gcss";
import TopAppName from "../common/topAppName";
import {Heading} from "../common/Heading";
import AppImage from "../common/AppImage";
import AppIcon from "../common/AppIcon";

const Offers = props => {
    const {params} = props.route;
    const {item, color, bg} = params;
    const {about, description, link, information, type} = item;
    const subhead = {width: 100, height: 100};
    const margin = {marginTop: 30};
    // console.log(item);
    return <SafeAreaView style={CSS.xview}>
        <TopAppName {...props}/>
        <Heading val={'Offers'}/>
        <View style={CSS.inrow}>
            <AppImage uri={description} style={subhead}/>
            {link !== undefined && link !== '' && link != null ?
                <AppIcon style={margin} name="google-chrome" mat={true} onPress={() => Linking.openURL(link)}/> : null}
            <Heading sub={true} val={about} style={margin}/>
        </View>
        <ScrollView>
            <Heading val='Information about this offer'/>
            <Text>{information}</Text>
        </ScrollView>
    </SafeAreaView>
}


export default Offers;
