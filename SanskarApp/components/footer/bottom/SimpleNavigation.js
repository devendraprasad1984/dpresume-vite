import {View, Button, StyleSheet} from 'react-native';
import React from 'react';
import {Enum} from "../../common/Config";


const navtohome = (navigation,miscinfo) => {
    navigation.navigate(Enum.screenName.home,{miscinfo});
}

const navtolearning = (navigation,miscinfo) => {
    navigation.navigate(Enum.screenName.learning,{miscinfo: miscinfo});
}

const navtosettings = (navigation,miscinfo) => {
    navigation.navigate(Enum.screenName.setting,{miscinfo});
}

const navtomedia = (navigation,miscinfo) => {
    navigation.navigate(Enum.screenName.media,{miscinfo});
}
const navtosupport = (navigation,miscinfo) => {
    navigation.navigate(Enum.screenName.support,{miscinfo});
}


const SimpleNavigation = props => {
    let {navigation, miscinfo} = props;
    // console.log('miscinfo',miscinfo);
    return (
        <View style={styles.container}>
            <View style={styles.buttonContainer}><Button onPress={() => navtohome(navigation,miscinfo)}
                                                         title={Enum.screenName.home} color='tomato'/></View>
            <View style={styles.buttonContainer}><Button onPress={() => navtolearning(navigation,miscinfo)}
                                                         title={Enum.screenName.learning} color='purple'/></View>
            <View style={styles.buttonContainer}><Button onPress={() => navtosettings(navigation,miscinfo)}
                                                         title={Enum.screenName.setting} color='purple'/></View>
            <View style={styles.buttonContainer}><Button onPress={() => navtomedia(navigation,miscinfo)}
                                                         title={Enum.screenName.media} color='purple'/></View>
            <View style={styles.buttonContainer}><Button onPress={() => navtosupport(navigation,miscinfo)}
                                                         title={Enum.screenName.support} color='purple'/></View>
        </View>
    );
}

export default SimpleNavigation;

const styles = StyleSheet.create({
    container: {
        bottom: 0,
        justifyContent: 'center',
        flexDirection: 'row',
        alignContent: 'space-between',
    },
    buttonContainer: {
        margin: 1
    },
});
