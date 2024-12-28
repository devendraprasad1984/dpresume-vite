import React from 'react'
import {Video} from "expo-av";
import {CSS} from "./gcss";
import Loading from "./Loading";
import {View} from "react-native";

export default function AppVideo(props) {
    const [imgLoad, setImgLoad] = React.useState(false);

    return <View>
        <Video
            source={{uri: props.uri}}
            rate={1.0}
            volume={1}
            isMuted={true}
            resizeMode="cover"
            shouldPlay={true}
            isLooping={true}
            style={CSS.imgVid}
            onPlaybackStatusUpdate={(x) => setImgLoad(false)}
            onLoadStart={() => setImgLoad(true)}
        />
        {imgLoad && <Loading/>}
    </View>

}
