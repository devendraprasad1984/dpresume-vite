import React from 'react';
import {Config} from '../common/Config';
import Loading from "../common/Loading";
import getFromAPI from "../common/getFromAPI";
import CustomBanner from "./CustomBanner";

export default function TopHeaderBanner(props) {
    const [loading, setLoading] = React.useState(true);
    const [data, setData] = React.useState([]);

    React.useEffect(() => {
        getFromAPI(Config.bannerEndpoint, (data) => {
            setData(data);
            setLoading(false);
        });
    }, []);

    if (loading) return <Loading/>;
    return <CustomBanner data={data} horizontal={true} {...props}/>
}
