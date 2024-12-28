import React from 'react';
import SweetAlert from "react-native-sweet-alert";

const AlertMe = props => {
    let {onFinish, title, subtitle} = props;
    return SweetAlert.showAlertWithOptions({
            title: (typeof title==='undefined' ? '' : title),
            subTitle: (typeof subtitle==='undefined' ? '' : subtitle),
            confirmButtonTitle: 'OK',
            confirmButtonColor: '#000',
            otherButtonTitle: 'Cancel',
            otherButtonColor: '#dedede',
            cancellable: true
        },
        flag => onFinish());
}

export default AlertMe;
