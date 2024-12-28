import {SafeAreaView, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {CSS} from "../common/gcss";
import TopAppName from "../common/topAppName";
import {Heading} from "../common/Heading";
import Loading from "../common/Loading";
import {connect} from 'react-redux'
import {Config} from "../common/Config";
import getFromAPI from "../common/getFromAPI";
import OrderCards from "../orders/OrderCards";
import AppButton from "../common/AppButton";
import CustomInput from "../common/customInput";
import postToAPI from "../common/postToAPI";

function DeliverOrder(props) {
    const {params} = props.route;
    const {item} = params;
    const [loading, setLoading] = useState(false);
    const {category} = item;
    const [orderForDelivery, setOrderForDelivery] = useState([])
    const [orderCount, setOrderCount] = useState(0)
    const {id, deliveryboyid} = props.agent.info
    const [codes,setCodes]=useState({})

    const pullOrders = () => {
        setLoading(true)
        let suf = '?agentid=' + id + '&type=delivery&boy=' + deliveryboyid
        getFromAPI(Config.getOrderEndpoint + suf, data => {
            setOrderForDelivery(data)
            setOrderCount((data.misc.length + data.orders.length)||0)
            setLoading(false)
        })
    }
    useEffect(() => {
        pullOrders()
    }, [])

    const handleSubmit = () => {
        let payload = {id, type: 'delivery'};
        setLoading(true);
    }

    const isLoading = () => {
        if (loading) return <Loading/>;
    }
    const deliverOrder=(ord)=>{
        let {id,prefix}=ord
        let code=codes[id]||''
        if(code==='') {
            alert('please enter handover code')
            return
        }
        let payload={id,prefix,code}
        postToAPI(Config.deliverOrderEndpoint,payload,data=>{
            alert(data.status)
            pullOrders()
        })
    }

    const handleDeliveryProcess = (order) => {
        let {id}=order
        let tmp={}
        return <View style={[CSS.inrow, CSS.right]}>
            <CustomInput placeholder='handover code' width={120} onChange={v=>{tmp[id]=v; setCodes({...codes,...tmp})}} value={codes[id]}/>
            <AppButton title='deliver' onPress={()=>deliverOrder(order)}/>
        </View>
    }

    return <SafeAreaView style={CSS.xview}>
        <TopAppName {...props}/>
        <Heading val={`${category}`}/>
        <View>{isLoading()}</View>
        <Heading val={`Your Order(s) for Delivery - (${orderCount})`}/>
        <AppButton title='Refresh' onPress={pullOrders}/>
        <OrderCards data={orderForDelivery} delivery={true} deliveryCallback={handleDeliveryProcess}/>
    </SafeAreaView>
}

const mapx = state => {
    return {
        agent: state.agent.agent
        , color: state.config.color
    }
}
export default connect(mapx)(DeliverOrder)
