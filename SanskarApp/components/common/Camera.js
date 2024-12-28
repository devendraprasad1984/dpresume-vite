import React, {useEffect, useState} from 'react'
import {Text, View} from 'react-native'
import {Camera} from 'expo-camera'
import AppButton from "./AppButton"
import {CSS} from "./gcss"
import * as MediaLibrary from 'expo-media-library'
import {Heading} from "./Heading";
import {Enum} from "./Config";
import AlertX from "./alertX";

export default function AppCamera(props) {
    const [cameraPermission, setCameraPermission] = useState(null)
    const [mediaPermission, setMediaPermission] = useState(null)
    const [saved, setSaved] = useState(false)
    const [type, setType] = useState(Camera.Constants.Type.back)
    let camref = React.useRef(null)

    useEffect(() => {
        (async () => {
            const {status} = await Camera.requestPermissionsAsync()
            const obj = await MediaLibrary.requestPermissionsAsync()
            setCameraPermission(status === 'granted')
            setMediaPermission(status === 'granted')
            // console.log('media permi',obj)
        })();
    }, []);

    if (cameraPermission === null || cameraPermission === false)
        return <Text>No access to camera</Text>;
    if (mediaPermission === null || mediaPermission === false)
        return <Text>No access to medial library</Text>;
    const flip = () => {
        setType(
            type === Camera.Constants.Type.back
                ? Camera.Constants.Type.front
                : Camera.Constants.Type.back
        );
    }
    const save = () => {
        (async () => {
            setSaved(false)
            camref.takePictureAsync().then(pic => {
                MediaLibrary.createAssetAsync(pic.uri).then(r => {
                    setSaved(true)
                    if (props.updateCurImage !== undefined) props.updateCurImage(pic.uri)
                }).catch(e => setSaved(false))
            }).catch(e => setSaved(false))
        })()
    }
    return <Camera ref={t => camref = t} style={[props.style]} type={type}>
        <AlertX val='saved to gallery' saved={saved} cb={(x) => setSaved(x)}/>
        <View style={[CSS.bottomx]}>
            <AppButton title={'flip'} onPress={flip}/>
            <AppButton icon='save' onPress={save}/>
        </View>
    </Camera>
}
