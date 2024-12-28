import {SafeAreaView, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {CSS} from "../common/gcss";
import TopAppName from "../common/topAppName";
import Loading from "../common/Loading";
import CustomInput from "../common/customInput";
import AppButton from "../common/AppButton";
import {connect} from 'react-redux'
import postToAPI from "../common/postToAPI";
import {Config, Enum} from "../common/Config";
import getFromAPI from "../common/getFromAPI";
import OrderCards from "../orders/OrderCards";
import {toastr} from "../common/Toast";
import {Heading} from "../common/Heading";

function FillOrder(props) {
    const {color} = props
    const {params} = props.route;
    const {item, bg, config} = params;
    const [loading, setLoading] = useState(false);
    const {category} = item;
    const [orders, setOrders] = useState('')
    const [remarks, setRemarks] = useState('')
    const [orders3m, setOrders3M] = useState([])

    const pullOrders = () => {
        setLoading(true)
        let id = props.agent.info.id
        let suf = '?agentid=' + id + '&type=3m'
        getFromAPI(Config.getOrderEndpoint + suf, data => {
            setOrders3M(data)
            setLoading(false)
        })
    }
    useEffect(() => {
        pullOrders()
    }, [])

    const handleSubmit = () => {
        if (orders === '' || remarks === '') {
            alert('please fill the form, no blank plz')
            return;
        }
        let {id, addr} = props.agent.info
        let payload = {id, orders, remarks, type: 'misc', address: addr};
        // console.log(payload);
        setLoading(true);
        postToAPI(Config.orderSaveEndpoint, payload, (data) => {
            let {status} = data;
            handleClear()
            setLoading(false);
            if (status === Enum.successMsg) {
                alert(Enum.reorderSuccessMsg);
            } else {
                alert('not saved, plz contact Admin');
            }
        });
    }

    const handleClear = () => {
        setOrders('')
        setRemarks('')
    }

    const isLoading = () => {
        if (loading) return <Loading/>;
    }

    const reorderProcess = (order) => {
        let actionReorderOk = () => {
            setOrders(order.orderItems)
            setRemarks(order.remarks)
        }
        let actionReorderCancel = () => {
            toastr.alert('sure you place same order again', () => {
                let payload = {
                    id: order.agentid,
                    orders: order.orderItems,
                    remarks: order.remarks + '-Reordered'
                }
                postToAPI(Config.getOrderEndpoint, payload, (data) => {
                    let {status} = data;
                    alert(status)
                });
            })
        }
        let actionCancelOk = () => {
            let payload = {
                cancel: 1,
                type: 'misc',
                id: order.id,
                agentid: order.agentid
            }
            // console.log('trying=', Config.cancelOrderEndpoint, payload)
            postToAPI(Config.cancelOrderEndpoint, payload, (data) => {
                // console.log(data)
                let {status} = data;
                alert(status)
            });
        }
        let handleOrderPayment = () => {
            alert('passing thru to payment')
        }
        let handleReOrder = () => toastr.alert('do you wish to add additional item for orderid ' + order.id + '?', actionReorderOk, actionReorderCancel)
        let handleOrderCancel = () => toastr.alert('sure to cancel order ' + order.id + '?', actionCancelOk)
        // console.log('order', order.isdelivered)
        if (order.isdelivered === "1") return null
        return <View style={[CSS.inrow, CSS.right]}>
            {order.state !== Enum.orderState.cancelled && order.ispaid === '0' ?
                <AppButton title='pay' onPress={handleOrderPayment}/> : null}
            <AppButton title='reorder' onPress={handleReOrder}/>
            {order.state !== Enum.orderState.cancelled ? <AppButton title='cancel' onPress={handleOrderCancel}/> : null}
        </View>
    }

    const handleSpeak = () => {

    }

    const {name, agentid} = props.agent.info
    return <SafeAreaView style={CSS.xview}>
        <TopAppName {...params} {...props}/>
        <Heading val={category}/>
        <Heading sub={true} val={props.agent.info.addr}/>
        <View>
            <CustomInput placeholder='Your order' multiline={true} value={orders} onChange={v => setOrders(v)}/>
            <CustomInput placeholder='remarks' value={remarks} onChange={v => setRemarks(v)}/>
            <View style={CSS.inrow}>
                <AppButton onPress={handleSpeak} icon='volume-high' ion={true}/>
                <AppButton onPress={handleSubmit} title='save'/>
                <AppButton onPress={handleClear} title='clear'/>
                <AppButton onPress={pullOrders} title='refresh'/>
            </View>
        </View>
        <View>{isLoading()}</View>
        <Heading val='Your Orders....'/>
        <OrderCards data={orders3m} reorder={true} reorderCallback={reorderProcess}/>
    </SafeAreaView>
}

const mapx = state => {
    return {
        agent: state.agent.agent
        , color: state.config.color
    }
}
export default connect(mapx)(FillOrder)
