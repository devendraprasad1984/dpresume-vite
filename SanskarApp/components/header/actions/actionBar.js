import {Linking, Text, View, SafeAreaView} from 'react-native';
import React, {useEffect, useState} from 'react';
import {FontAwesome} from '@expo/vector-icons';
import {appColor, CSS} from "../../common/gcss";
import {Enum} from "../../common/Config";
import {connect} from "react-redux";

const ActionBar = props => {
    const {config, navigation} = props;
    const [facebook, setfacebookurl] = useState('');
    const [twitter, settwitterurl] = useState('');
    const [linkedin, setlinkedinurl] = useState('');
    const [whatsapp, setwhatsappurl] = useState('');
    const [logo, setLogo] = useState('N');
    const color = props.color
    const {name, xtype, agentid} = props.agent.info
    const colorObj = appColor(color)
    // console.log('action', props.agent.info.name)
    useEffect(() => {
        setLogo(config[Enum.configKeys.logo]);
        // setfacebookurl(config[Enum.configKeys.facebook]);
        // settwitterurl(config[Enum.configKeys.twiter]);
        // setlinkedinurl(config[Enum.configKeys.linkedin]);
        setwhatsappurl(config[Enum.configKeys.whatsapp]);
    }, []);
    const eventsIconClick = () => {
        handleNav(Enum.screenName.events);
    }

    const blogIconClick = () => {
        handleNav(Enum.screenName.blogs);
    }

    const handleNav = (screen) => {
        navigation.navigate(screen, {});
    }
    const displayIcon = (iconname, value, click) => {
        if (value === '' && click === undefined) return null;
        if (click === undefined) click = () => Linking.openURL(value)
        return <FontAwesome name={iconname} color={color} size={Enum.iconSize} onPress={click}/>
    }
    return <SafeAreaView>
        <View style={[CSS.inrow]}>
            {displayIcon('bars', '', () => handleNav(Enum.screenName.moreOptions))}
            <Text style={[{fontWeight: 'bold', fontSize: Enum.iconSize-6}, colorObj]}
                  onPress={() => handleNav(Enum.screenName.userProfile)}>{logo}{'\n'}
                <Text style={{fontSize: 11,color:Enum.rebeccaPurple}}>{agentid} or {name}</Text>{'\n'}
                <Text style={{fontSize: 10,color:Enum.goldenRod}}>{xtype}</Text>
            </Text>
            {/*{displayIcon('facebook', facebook)}*/}
            {/*{displayIcon('linkedin', linkedin)}*/}
            {/*{displayIcon('twitter', twitter)}*/}
            {displayIcon('whatsapp', whatsapp)}
            {displayIcon('cart-plus', '', () => handleNav(Enum.screenName.cart))}
            {displayIcon('support', '', () => handleNav(Enum.screenName.support))}
        </View>
    </SafeAreaView>
}
const mapx = state => {
    return {
        config: state.config.config,
        color: state.config.color
    }
}
export default connect(mapx)(ActionBar);



