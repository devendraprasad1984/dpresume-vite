import {Image, ScrollView, Text, View, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import Loading from "../common/Loading";
import {appColor, bgColor, CSS} from "../common/gcss";
import {Heading} from "../common/Heading";
import getFromAPI from "../common/getFromAPI";
import {Config, Enum} from "../common/Config";
import CustomBanner from "../banner/CustomBanner";
import {connect} from "react-redux";

function MainAgentView(props) {
    const [iconsSource, setIconSource] = useState([]);
    const [iconLoad, setIconLoad] = useState(true);
    const [offerLoad, setOfferLoad] = useState(true);
    const [offerData, setOfferData] = useState([]);
    const color = appColor(props.color);
    const backColor = bgColor(props.color);

    const {info}=props.agent||{info:{id:-1,type:-1}}
    const {id,type}=info
    useEffect(() => {
        getFromAPI(Config.iconsEndpoint + '?type=' + type, (res) => {
            setIconSource(res);
            setIconLoad(false);
        });
        getFromAPI(Config.offerEndpoint + '?agentid=' + id, (res) => {
            setOfferData(res);
            setOfferLoad(false);
        });
    }, []);

    const handleIconClick = (item) => {
        const navOptions = {item, color, bg: backColor};
        props.navigation.navigate(item.screen, navOptions);
    }

    const getListIcons = (data) => {
        return data.map((x, i) => {
            return <TouchableOpacity key={'vri' + i} onPress={() => handleIconClick(x)}>
                <Image style={CSS.iconImg} source={{uri: x.icons}}/>
                <Text style={[CSS.iconText, color]}> {x.category}</Text>
            </TouchableOpacity>
        });
    }

    const mainRender = (id, cat, headText) => {
        let function2Call = undefined;
        if (headText.toLowerCase() === 'services') function2Call = () => getListIcons(iconsSource);
        if (function2Call === undefined) return null;
        return <ScrollView style={[CSS.xmargin, {height: CSS.xheight.height + 100}]}>
            <Heading val={headText} />
            <View style={[CSS.inrow]}>{function2Call()}</View>
        </ScrollView>
    }
    const renderBanner = (headText) => {
        if (props.agent.info.xtype === Enum.viewType.delivery) return null

        return <View style={[CSS.xheight, CSS.xmargin]}>
            <Heading val={headText} />
            <CustomBanner data={offerData} place={'offer'} autoplay={true} horizontal={false} {...props}/>
        </View>
    }

    if (iconLoad || offerLoad) return <Loading/>;
    return (
        <View>
            {mainRender(0, 'icons', 'Services')}
            {renderBanner('Offers')}
        </View>
    );
}

const mapx = state => {
    return {
        color: state.config.color
        , agent: state.agent.agent
    }
}
export default connect(mapx)(MainAgentView)
