import * as Device from 'expo-device'

export const getHost = () => {
    let isdevice = Device.isDevice;
    // isdevice = false;
    let ip = !isdevice ? 'http://192.168.1.3:8080/' : 'https://dpresume.com/';
    // let ip = !isdevice ? 'http://192.168.29.33:8080/' : 'https://dpresume.com/';
    if(!isdevice) console.log('you are connected to '+ip)
    return ip
}

export default getHost;
