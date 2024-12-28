import React, {useEffect, useState} from 'react';
import {Platform, View, ScrollView} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AppButton from "./AppButton";
import AppImage from "./AppImage";
import {CSS} from "./gcss";


const imgsty = {width: 120, height: 120, marginBottom: 2}
const ImagesLib = props => {
    const {images, setImages}=props

    useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    alert('no camera permission!');
                }
            }
        })();
    }, [])

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        if (!result.cancelled) {
            // console.log('cur image', result.uri)
            setImages(result.uri)
        }
    }

    const reset = () => {
        setImages('reset')
    }

    const displayImages = () => {
        // console.log('imagesxxxx',images)
        if (images.length === 0) return null
        return images.map((x, i) => {
            return <AppImage key={'img' + i} uri={x} style={imgsty}/>
        })
    }

    return <View style={[{margin: 10}]}>
        <View style={[CSS.inrow]}>
            <AppButton title="choose images" onPress={pickImage}/>
            <AppButton title="reset" onPress={reset}/>
        </View>
        <ScrollView>
            <View style={[CSS.inrow, {marginTop: 5}]}>{displayImages()}</View>
        </ScrollView>
    </View>
}

export default ImagesLib
