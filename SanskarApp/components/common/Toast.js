import {ToastAndroid, Platform, Alert} from 'react-native' ;

// console.log('Platform.OS.toLowerCase()',Platform.OS.toLowerCase())
const isAndroid = Platform.OS.toLowerCase() === 'android'

const createAlert = (msg, ok, cancel) => {
    // console.log(ok, cancel)
    const buttons=[
        {text: "Ok", onPress: () => ok === undefined ? {} : ok()},
        {text: "Cancel", onPress: () => cancel === undefined ? {} : cancel()}
    ]
    Alert.alert(msg, "", buttons, {cancelable: false})
}

export const toastr = {
    showToast: (message = 'message', ok, cancel) => {
        if (isAndroid) {
            ToastAndroid.showWithGravity(
                message,
                ToastAndroid.SHORT,
                ToastAndroid.CENTER
            )
        } else {
            createAlert(message, ok, cancel)
        }
    }
    , alert: (message = 'message', ok, cancel) => {
        createAlert(message, ok, cancel)
    }
};
