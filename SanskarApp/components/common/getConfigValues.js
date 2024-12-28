import getFromAPI from "./getFromAPI";
import {Config} from "./Config";

export default function getConfigValues(callback) {
    const filterResponse = (data) => {
        let xconf = {}
        for (let x in data) {
            let ob = data[x]
            xconf[ob.key] = ob.value
        }
        callback(xconf);
    }
    getFromAPI(Config.configEndPoint, (data) => {
        filterResponse(data);
    })
}

