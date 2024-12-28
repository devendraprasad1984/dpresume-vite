import React from 'react'
import {config} from "../configs/config";

const Logger = (Component) => {
    const otherInjectedProps = {
        appName: 'dpresume.com',
        getFromLocalStore: () => {
            return 'data from localStore - ' + localStorage.getItem(config.enums.localStorage.name) || 'mate'
        }
    }
    // console.log('logging', Component.name, Component.prototype)
    return props => <Component {...otherInjectedProps} {...props}/>
    // return Component
}

export default Logger