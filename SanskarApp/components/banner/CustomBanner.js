import {Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import Swiper from 'react-native-swiper';
import Popup from "../common/popup";
import {appColor, CSS} from "../common/gcss";
import AppVideo from "../common/AppVideo";
import AppImage from "../common/AppImage";
import {Enum} from "../common/Config";
import NoDataFound from "../common/noDataFound";
import {connect} from "react-redux";

const CustomBanner = props => {
    let modalRef = React.useRef();
    const [data, setDatasource] = React.useState(props.data);

    const handleImageClickForOffer=(item)=>{
        if(props.place==='offer'){
            props.navigation.navigate(Enum.screenName.offers,{item});
        }
    }
    const setModalState = (item) => modalRef.show(item.about, item.description);
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
    const showText = (item) => <View key={item.id}>{getReadMoreText(item)}</View>
    const showImage = (value) => <View key={value.id}><TouchableOpacity onPress={()=>handleImageClickForOffer(value)}><AppImage uri={value.description}/></TouchableOpacity></View>;
    const showVideo = (value) => <View key={value.id}><AppVideo uri={value.description}/></View>
    const showBannerItems = () => data.map(item => item.type.toLowerCase() === 'image' ? showImage(item) : item.type.toLowerCase() === 'text' ? showText(item) : showVideo(item));

    if(data.length===0 || data===undefined) return <NoDataFound/>
    return <View style={{flex:1}}>
        <Popup ref={(target) => modalRef = target} color={props.color}/>
        <View style={[CSS.xheight]}>
            <Swiper showsButtons={false}
                    loop={true} showsPagination={true}
                    autoplay={props.autoplay || false}
                    horizontal={props.horizontal || false}
                    dot={<View style={[CSS.dot, {backgroundColor: props.color}]}/>}
                    activeDot={<View style={CSS.activedot}/>}
            >
                {showBannerItems()}
            </Swiper>
        </View>
    </View>
}
const mapx = state => {
    return {
        color: state.config.color
    }
}
export default connect(mapx)(CustomBanner)
