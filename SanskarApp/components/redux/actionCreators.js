import {fetchError, setAgentToStore, setCartToStore, setConfig} from "./actions/Types";
import {Config} from "../common/Config";
import fetchPromise from "../common/fetchPromise";

const filterResponse = (data, cb) => {
    let xconf = {}
    for (let x in data) {
        let ob = data[x]
        xconf[ob.key] = ob.value
    }
    cb(xconf)
}
export const getSetConfig=()=> {
    // console.log('pulling',Config.configEndPoint)
    return (dispatch) => fetchPromise(Config.configEndPoint).then(([response, json]) => {
        if (response.status === 200) {
            filterResponse(json, (data) => {
                dispatch(setConfig(data));
            })
        } else {
            dispatch(fetchError());
        }
    });
}

export const getSetAgent=(data)=>{
    return (dispatch)=>{
        dispatch(setAgentToStore(data))
    }
}

export const getSetCart=(data)=>{
    return (dispatch)=>{
        dispatch(setCartToStore(data))
    }
}
