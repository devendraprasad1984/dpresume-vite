import React from 'react'
import {Image, View} from "react-native";
import {CSS} from "./gcss";
import Loading from "./Loading";

export default function AppImage(props) {
    const {uri, style, med, click} = props;
    let thisStyle = style;
    if (style === undefined) thisStyle = CSS.fitImage;
    const [imgLoad, setImgLoad] = React.useState(false);
    // console.log('click image....',click)
    return <View>
        {med ? <Image source={uri} style={[thisStyle]} onLoadEnd={() => setImgLoad(false)}
                      onLoadStart={() => setImgLoad(true)} onPress={click}/>
            : <Image source={{uri: uri}} style={[thisStyle]} onLoadEnd={() => setImgLoad(false)}
                     onLoadStart={() => setImgLoad(true)} onPress={click}/>}
        {imgLoad && <Loading/>}
    </View>
}
