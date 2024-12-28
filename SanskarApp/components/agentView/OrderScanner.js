import {SafeAreaView, View} from 'react-native';
import React, {useState} from 'react';
import {CSS} from "../common/gcss";
import TopAppName from "../common/topAppName";
import {Heading} from "../common/Heading";
import AppCamera from "../common/Camera";
import AppButton from "../common/AppButton";
import ImagesLib from "../common/imagePicker";
import {Config} from "../common/Config";
import {connect} from 'react-redux'
import CustomInput from "../common/customInput";

const OrderScanner = props => {
    const {params} = props.route;
    const {item, color, bg, config, dealerInfo} = params;
    const [images, setImages] = useState([])
    const [remarks, setRemarks] = useState('')
    const {category} = item;
    const th = {height: CSS.xheight.height + 150}

    const handleUploadOrder = () => {
        // console.log('all images to upload', images)
        const formData = new FormData();
        let {id, addr} = props.agent.info
        formData.append('type', 'orderimages');
        formData.append('remarks', remarks);
        formData.append('address', addr);
        formData.append('id', id);
        images.forEach(x => {
            let fnarr = x.split('/')
            let fn = fnarr[fnarr.length - 1]
            // console.log('filename', fn)
            formData.append('files[]', {
                uri: x, type: 'image/jpeg', name: fn
            })
        })
        fetch(Config.orderUploaderEndpoint, {
            method: 'post',
            headers: {
                'Content-Type': 'multipart/form-data',
                'Accept': "application/x-www-form-urlencoded"
            },
            body: formData
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.status === 'success') {
                    setImages([])
                    alert('order images been uploaded, we will revert shortly')
                } else {
                    alert(data.status)
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }
    const setImgs = (x) => {
        if(x==='reset'){
            setImages([])
            return
        }
        setImages([...images, x])
    }

    // console.log('imagesx', images)
    return <SafeAreaView style={[CSS.xview]}>
        <TopAppName {...params} {...props}/>
        <Heading val={category + ' - Scan Order Picture'}/>
        <View>
            <View style={th}><AppCamera style={th} updateCurImage={x=>setImgs(x)}/></View>
            <View><CustomInput placeholder='remarks' value={remarks} onChange={v => setRemarks(v)}/></View>
            <View style={th}>
                <ImagesLib images={images} setImages={x=>setImgs(x)}/>
            </View>
            <View style={[CSS.bottom, CSS.right]}>
                <AppButton title='Upload Order' onPress={handleUploadOrder}/>
            </View>
        </View>
    </SafeAreaView>;
}
const mapx = state => {
    return {
        agent: state.agent.agent
    }
}
export default connect(mapx)(OrderScanner)
