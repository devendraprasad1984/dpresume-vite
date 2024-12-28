import * as React from 'react';
import {View} from 'react-native';
import SvgQRCode from 'react-native-qrcode-svg';
import {QRCode} from 'react-native-custom-qr-codes-expo';
import {Enum} from "./Config";

const logoSize=30
const size=90
function Simple(props) {
    return <SvgQRCode
        value={props.val}
        size={size}
        logoSize={logoSize}
        logoBackgroundColor='transparent'
    />;
}

function LogoFromFile(props) {
    return <SvgQRCode
        value={props.val}
        logo={Enum.logo}
        size={size}
        logoSize={logoSize}
        logoBackgroundColor='transparent'
    />;
}

function CustomQRCodes(props) {
    return <View>
        <QRCode
            codeStyle="circle"
            size={size}
            content={props.val}
            logoSize={logoSize}
            logoBackgroundColor='transparent'
        />
        {/*<CustomQRCode linearGradient={['green', 'red']} content={props.val}/>*/}
    </View>
}

const GetQRCode = props => {
    const {simple, logo, custom, val} = props
    return <View>
        {simple && <Simple val={val}/>}
        {logo && <LogoFromFile val={val}/>}
        {custom && <CustomQRCodes val={val}/>}
    </View>
}

export default GetQRCode
