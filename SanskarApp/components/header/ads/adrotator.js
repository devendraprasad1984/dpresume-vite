import {Text, View} from 'react-native';
import React, {createRef, useEffect, useState} from 'react';
import Swiper from 'react-native-swiper';
import {Config, Enum} from '../../common/Config';
import Loading from "../../common/Loading";
import Popup from "../../common/popup";
// import Text2Speech from "../../common/text2Speech";
import getFromAPI from "../../common/getFromAPI";
import {appColor, CSS} from "../../common/gcss";
import {connect} from "react-redux";
import AppVideo from "../../common/AppVideo";
import AppImage from "../../common/AppImage";

const Adrotator = props => {
    let modalRef = createRef();
    const [loading, setLoading] = useState(true)
    const [datasource, setdatasource] = useState([])

    useEffect(() => {
        getFromAPI(Config.adsEndpoint, (data) => {
            setdatasource(data)
            setLoading(false)
        })
    }, [])

    const showAds = () => {
        if (loading) return <Loading/>;
        return datasource.map(item => {
            return item.type === 'Image' ? showImage(item) : item.type === 'Text' ? showText(item) : showVideo(item);
        });
    }

    const setModalState = (item) => {
        //set pop ups header and content to show
        modalRef.show(item.about, item.description);
    }
    const getReadMoreText = (item) => {
        let maxSize = 400
        let {about, description} = item;
        let color = appColor(props.color);
        let txtLen = description.length;
        return <Text style={[color, CSS.para]}>
            <Text style={[color, {fontWeight: 'bold'}]}>{about}{'\n'}</Text>
            <Text>{description.substr(0, maxSize)}</Text>
            {txtLen > maxSize ?
                <Text style={[{fontWeight: 'bold'}]} onPress={() => setModalState(item)}>...More</Text> : ''}
        </Text>
    }
    const showImage = (value) => <View key={value.id}><AppImage uri={value.description}/></View>
    const showText = (item) => <View key={item.id}>{getReadMoreText(item)}</View>
    const showVideo = (value) => <View key={value.id}><AppVideo uri={value.description}/></View>

    if (loading) return <Loading/>;
    return <View>
        <Popup ref={(target) => modalRef = target} color={props.color}/>
        <Swiper showsButtons={false} loop showsPagination dot={<View style={[CSS.dot, {backgroundColor: props.color}]}/>}
                activeDot={<View style={CSS.activedot}/>}>
            {showAds()}
        </Swiper>
    </View>
}
const mapx = state => {
    return {
        config: state.config.config,
        color: state.config.color
    }
}
export default connect(mapx)(Adrotator)
