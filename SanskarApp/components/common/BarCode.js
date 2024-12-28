import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {BarCodeScanner} from 'expo-barcode-scanner';
import AppButton from "./AppButton";
import {Heading} from "./Heading";

export default function BarCode(props) {
    const [hasPermission, setHasPermission] = useState(null);
    const {scan,scanCallback}=props

    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const handleBarCodeScanned = ({ type, data }) => {
        scanCallback(true);
        alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    };

    if (hasPermission === null) {
        return <Heading sub={true} val='Requesting Camera Permission'/>;
    }
    if (hasPermission === false) {
        return <Heading sub={true} val='No Camera Access Granted'/>;
    }

    return (
        <View>
            <BarCodeScanner onBarCodeScanned={scan ? undefined : handleBarCodeScanned}/>
            {scan && <AppButton title='Tap Again...' onPress={() => scanCallback(false)} />}
        </View>
    );
}
