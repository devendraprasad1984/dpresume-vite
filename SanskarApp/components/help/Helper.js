import React, {useEffect, useState} from 'react';
import Onboarding from "react-native-onboarding-swiper";
import AppImage from "../common/AppImage";
import Loading from "../common/Loading";
import getFromAPI from "../common/getFromAPI";
import {Linking, TouchableOpacity, View} from "react-native";
import NoDataFound from "../common/noDataFound";
import AppButton from "../common/AppButton";
import {connect} from 'react-redux'
import {appColor} from "../common/gcss";
import {Enum} from "../common/Config";

const Helper = props => {
    const [helpPages, setHelpPages] = useState([]);
    const [load, setLoad] = useState(true);
    const imgStyle = {height: 350, width: Enum.maxwidth, resizeMode:'contain'};
    const {uri} = props
    const color=props.color
    const colorObj=appColor(color)

    const setLink = (link) => {
        if (link !== '' && link !== null) Linking.openURL(link)
    }

    useEffect(() => {
        getFromAPI(uri, data => {
            let pages = data.map(x => {
                return {
                    backgroundColor: x.bgcolor,
                    title: x.title,
                    image: <TouchableOpacity onPress={() => setLink(x.link)}><AppImage uri={x.image} style={imgStyle}/></TouchableOpacity>,
                    subtitle: x.subtitle
                }
            })
            setHelpPages(pages)
            setLoad(false)
        })
    }, []);
    const handleSkip = () => {
        props.navigation.goBack();
    }
    const Next = (props) => <View><AppButton title={'Next'} icon={'step-forward'} {...props} style={colorObj}/></View>
    const Skip = (props) => <View><AppButton title={'Skip'} icon={'exit-to-app'} mat={true} {...props} style={colorObj}/></View>

    if (helpPages.length === 0) return <NoDataFound val={'No help found'}/>
    return load ? <Loading/> : <Onboarding
        pages={helpPages}
        onSkip={handleSkip}
        onDone={handleSkip}
        titleStyles={colorObj}
        subTitleStyles={{color: Enum.gray}}
        NextButtonComponent={Next}
        SkipButtonComponent={Skip}
    />
}
const mapx=state=>{
    return {
        color: state.config.color
    }
}
export default connect(mapx)(Helper);
