import {SafeAreaView, Text, View} from 'react-native';
import {appColor, CSS} from './common/gcss';
import React, {useEffect, useState} from 'react';
import {Config, Enum} from "./common/Config";
import {connect} from 'react-redux'
import Loading from "./common/Loading";
import postToAPI from "./common/postToAPI";
import CustomInput from "./common/customInput";
import AppButton from "./common/AppButton";
import AppImage from "./common/AppImage";
import {bindActionCreators} from "redux";
import {getSetAgent} from "./redux/actionCreators";

const Splash = props => {
    const {config} = props;
    const {params} = props.route;
    const [loggedin, setLoggedIn] = useState(false);
    const [load, setLoad] = useState(true);
    const [passcode, setPasscode] = useState('admin');
    const [conf, setConf] = useState([])
    const [txt, setTxt] = useState('dummy')
    const [img, setImg] = useState('https://img.icons8.com/officel/2x/home.png')
    const {signout} =  params || {signout: 0};

    const moveNext = () => props.navigation.navigate(Enum.screenName.home);
    useEffect(() => {
        setConf(config)
        setImg(config[Enum.configKeys.splashimg])
        setLoad(false)
    }, [config])

    // setTimeout(()=>moveNext(),5000)
    const handleHelp = () => {
        props.navigation.navigate(Enum.screenName.helpSplash);
    }
    const handleGo = () => {
        if (passcode === '') {
            alert('plz input agent unique guid code');
            return;
        }
        let payload = {agent: 1, validate: 1, pin:passcode};
        postToAPI(Config.agentValidator, payload, (res) => {
            // console.log(res);
            if (res.status === Enum.successMsg) {
                const {info} = res;
                const mainDealerInfo = {
                    isloggedin: 1,
                    token: 'got the token',
                    info
                };
                props.getSetAgent(mainDealerInfo)
                moveNext()
                // Local.set(mainDealerInfo, v => navNextFromSplash());
            } else
                alert(Enum.validateMss);
        });
    }
    const handleForgot = () => {
        if (passcode === '') {
            alert('plz input agent id to get forgot email');
            return;
        }
        let payload = {agent: 1, forgot: 1, pin:passcode};
        postToAPI(Config.forgotCode, payload, (res) => {
            if (res.status === Enum.successMsg)
                alert(Enum.forgotMailSuccessMsg);
            else
                alert(Enum.forgotMailFailMsg);
        });
    }

    const LoggedInChecker = () => {
        if (!loggedin) {
            return <View>
                <CustomInput type='password' placeholder='passcode' onChange={(val) => setPasscode(val)} value={passcode}/>
                <View style={[CSS.inrow]}>
                    <AppButton onPress={handleGo} title='Go'/>
                    <AppButton onPress={handleForgot} title='forgot?'/>
                    <AppButton onPress={handleHelp} title='?'/>
                </View>
            </View>
        } else {
            return <View style={[CSS.inrow]}>
                <AppButton onPress={handleGo} title={`hi, proceed...`}/>
                <AppButton onPress={handleHelp} title='?'/>
            </View>
        }
    }


    if (conf.length === 0 || conf === undefined || txt === undefined) return <Loading/>
    const splittext = conf[Enum.configKeys.splashtxt].split('\n')
    let color = appColor(props.color);
    if (load) return <Loading/>;
    const {licence, tagline} = conf;
    return <SafeAreaView style={CSS.xview}>
        <View style={{flex: 1}}>
            <AppImage uri={img} style={{height: '100%', width: '100%'}}/>
        </View>
        <View>
            <View style={[CSS.right]}>
                <Text style={[CSS.splashFirstTxt, color]}>{splittext[0]}</Text>
                <Text style={[CSS.splashSecondTxt]}>{splittext[1]}</Text>
                <Text style={[CSS.splashThirdTxt, color]}>{splittext[2]}</Text>
            </View>
            <View>
                <Text style={[color]}>{tagline}</Text>
                {LoggedInChecker()}
            </View>
            <View style={[CSS.right]}>
                <Text style={[CSS.right, color,{fontSize:10}]}>{licence}</Text>
            </View>
        </View>
    </SafeAreaView>
}
const mapx = state => {
    return {
        config: state.config.config,
        color: state.config.color,
    }
}
const mapd = (dispatch) => {
    return {
        ...bindActionCreators({getSetAgent}, dispatch)
    }
}
export default connect(mapx, mapd)(Splash)
