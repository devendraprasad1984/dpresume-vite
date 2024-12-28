import React from 'react'
import {Config, Enum, getdate} from "../common/Config";
import NoDataFound from "../common/noDataFound";
import {ScrollView, Text, View} from "react-native";
import {CSS} from "../common/gcss";
import {Heading} from "../common/Heading";
import {connect} from 'react-redux'
import GetQRCode from "../common/QRCodeGen";
import Popup from "../common/popup";
import AppButton from "../common/AppButton";
import getFromAPI from "../common/getFromAPI";

const OrderCards = props => {
    const txtst = {fontSize: 11, color: Enum.darkSlateGray}
    let tref = React.createRef()

    const renderOrders = () => {
        const getStateColor = (st) => {
            let colorName = Enum.red
            if (st.toLowerCase() === Enum.orderState.success) colorName = Enum.green
            else if (st.toLowerCase() === Enum.orderState.pending) colorName = Enum.gray
            else if (st.toLowerCase() === Enum.orderState.transit) colorName = Enum.purple
            else if (st.toLowerCase() === Enum.orderState.hold) colorName = Enum.orangered
            else if (st.toLowerCase() === Enum.orderState.shipped) colorName = Enum.navy
            else if (st.toLowerCase() === Enum.orderState.delivered) colorName = Enum.seaGreen
            return colorName
        }

        const handleOrderImages = (prefix, id) => {
            getFromAPI(Config.orderImagesEndpoint + '?id=' + id, (data) => {
                tref.show('Your Order Id: ' + prefix + id, data, true)
            })
        }

        const renderOrderItem = (order) => {
            const {id, shippedon, tax, prefix, orderItems, address, icnt, remarks, shippedby, expectedby, deliveryboy, ordervalue, gst, paymentmode, payremarks, ispaid, extrainfo} = order
            return <View>
                <Heading val='Tracking Info' stylex={{fontSize: 11, color: Enum.rebeccaPurple}}/>
                {shippedon !== null ? <View style={[CSS.inrow]}>
                    <Heading sub={true} val={'shipped: ' + getdate(shippedon)} stylex={txtst}/>
                    <Heading sub={true} val={'by: ' + shippedby} stylex={txtst}/>
                </View> : <NoDataFound val='No Shipping Info Yet' stylex={txtst}/>}
                {ordervalue !== "0" ? <View style={[CSS.inrow]}>
                    <Heading sub={true} val={'value: ' + ordervalue} stylex={txtst}/>
                    <Heading sub={true} val={'mode: ' + paymentmode} stylex={txtst}/>
                    <Heading sub={true} val={'payremarks: ' + payremarks} stylex={txtst}/>
                </View> : <NoDataFound val='No payment info yet' stylex={txtst}/>
                }
                <Heading sub={true} stylex={txtst}
                         val={`arriving on/before ${getdate(expectedby)} with ${deliveryboy} ${extrainfo}`}/>
                <Heading sub={true} val={'note: ' + remarks} stylex={{color: Enum.purple}}/>
                {icnt === "0" || icnt === undefined
                    ? <Heading sub={true} stylex={txtst} val={displayOrderItems(order)}/>
                    : <Heading sub={true} stylex={txtst} val={displayOrderItems(order)} click={() => handleOrderImages(prefix, id)}/>
                }
                <Heading sub={true} val={address!==''?'delivery address: ' + address:''} stylex={{color: Enum.lightSalmon}}/>
            </View>
        }

        const displayOrderItems = (order) => {
            let {prefix, orderItems, icnt} = order
            let item = orderItems
            if (prefix === 'A') {
                let xi = item
                xi = xi.split('~').join('\n')
                return xi
            } else if (prefix === 'M') {
                return item
            } else if (prefix === 'X') {
                return icnt + ' ' + item
            }
        }

        const displayHanoverCode = (item) => {
            const {handovercode} = item
            return <View style={[{width: '100%'}]}>
                <Heading val={`Code: ${handovercode}`}/>
                <GetQRCode val={handovercode} logo={true}/>
            </View>
        }

        if (props.data.length === 0) return <NoDataFound val='No Orders'/>
        const {misc, orders} = props.data
        const ordersData = [...misc, ...orders]
        const isCode = props.code === true
        return ordersData.map((x, i) => {
            let stateColor = getStateColor(x.state)
            let cl = x.prefix === 'M' ? Enum.darkSlateBlue : x.prefix === 'X' ? Enum.orangered : Enum.darkGreen
            return <View key={'orders' + i} style={[CSS.card]}>
                <Popup ref={(t) => tref = t}/>
                <View style={[CSS.cardInfo]}>
                    <View style={[CSS.inrow]}>
                        <Heading val={x.prefix + x.id} stylex={{fontSize: 13, color: cl}}/>
                        <Heading val={'' + x.state} stylex={{color: stateColor}}/>
                        <Heading sub={true} val={x.date}/>
                    </View>
                    <View style={[CSS.inrow]}>
                        <View style={isCode ? {width: '70%'} : {width: '100%'}}>{renderOrderItem(x)}</View>
                        <View>{isCode ? displayHanoverCode(x) : null}</View>
                    </View>
                    <View>{props.reorder === true ? props.reorderCallback(x) : null}</View>
                    <View>{props.delivery === true ? props.deliveryCallback(x) : null}</View>
                </View>
            </View>
        })
    }

    return <ScrollView>{renderOrders()}</ScrollView>

}
const mapx = state => {
    return {
        agent: state.agent.agent,
        color: state.config.color
    }
}
export default connect(mapx)(OrderCards)
