import React, {useEffect, useState} from 'react';
import {SafeAreaView, ScrollView, Text, View} from 'react-native';
import {CSS} from "../common/gcss";
import TopAppName from "../common/topAppName";
import {Heading} from "../common/Heading";
import {connect} from "react-redux";
import getFromAPI from "../common/getFromAPI";
import {Config, Enum} from "../common/Config";
import NoDataFound from "../common/noDataFound";
import Loading from "../common/Loading";
import OrderCards from "./OrderCards";

const OrderHistory = props => {
    const {navigation, route} = props
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true)
        let id = props.agent.info.id
        let suf='?agentid=' + id+'&type=history'
        getFromAPI(Config.getOrderEndpoint + suf, data => {
            setOrders(data)
            setLoading(false)
        })
    }, [])

    if (loading) return <Loading/>;
    return <SafeAreaView>
        {props.notop===undefined ? <TopAppName {...props}/>:null}
        <Heading val={'Order History'}/>
        <OrderCards data={orders}/>
        {/*<OrderCards data={orders} orderPrefix='FX'/>*/}
    </SafeAreaView>
}

const mapx = state => {
    return {
        agent: state.agent.agent
        , color: state.config.color
    }
}
export default connect(mapx)(OrderHistory);
