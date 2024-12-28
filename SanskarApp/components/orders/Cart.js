import React, {useEffect, useState} from 'react';
import {SafeAreaView, ScrollView, View} from 'react-native';
import {CSS} from "../common/gcss";
import TopAppName from "../common/topAppName";
import {Heading} from "../common/Heading";
import {connect} from "react-redux";
import {Config, Enum} from "../common/Config";
import NoDataFound from "../common/noDataFound";
import Loading from "../common/Loading";
import AppButton from "../common/AppButton";
import postToAPI from "../common/postToAPI";
import CustomInput from "../common/customInput";
import {bindActionCreators} from "redux";
import {getSetCart} from "../redux/actionCreators";

const Cart = props => {
    const {navigation, route, agent, cart} = props
    // let {cart} = route.params
    const [cartObj, setCartObj] = useState({})
    const [loading, setLoading] = useState(false)
    const [remarks, setRemarks] = useState('')

    const {id} = agent.info
    const isempty = (cart === undefined || Object.keys(cart).length === 0 || Object.keys(cartObj).length === 0)

    useEffect(() => {
        // console.log('cart from redux', cart)
        setCartObj(cart)
    }, [])

    const removeFromCart = (id) => {
        let tmp = {}
        for (let i in cartObj) {
            if (i !== id) tmp[i] = cart[i]
        }
        props.getSetCart({...tmp})
        setCartObj({...tmp})
    }
    const displayCart = () => {
        if (isempty) return <NoDataFound val='cart empty'/>
        let whatsIn = Object.values(cartObj)
        return whatsIn.map((x, i) => {
            return <View key={'cart' + i} style={[CSS.card]}><View style={[CSS.cardInfo]}>
                <Heading val={`${x.name}, qty: ${x.qty}`}/>
                <Heading sub={true} val={x.xline}/>
                <View style={[CSS.inrow, CSS.right]}><AppButton icon='trash'
                                                                onPress={() => removeFromCart(x.id)}/></View>
            </View></View>
        })
    }

    const getTotalAmount = () => {
        let amt = 0
        if (isempty) return amt
        amt = Object.values(cartObj).map(x => x.amount).reduce((p, v) => p + v, 0)
        return amt
    }

    const handleSaveOrder = (success) => {
        if (isempty) return
        let cartAmount = getTotalAmount()
        let {id, addr} = props.agent.info
        let payload = {cartAmount, id, orders: Object.values(cartObj), type: 'order', remarks,address: addr}
        setLoading(true)
        postToAPI(Config.orderSaveEndpoint, payload, (data) => {
            console.log('from server',data)
            let {status} = data
            setLoading(false)
            if (status === Enum.successMsg)
                success()
            else
                alert(Enum.failedMsg);
        })
    }

    const reset=()=>{
        props.getSetCart({})
        setCartObj({})
        setRemarks('')
    }
    const handlePayNow = () => {
        handleSaveOrder(() => {
            reset()
            alert('initiating payment')
        })
    }
    const handlePayLater = () => {
        handleSaveOrder(() => {
            reset()
            alert(Enum.reorderSuccessMsg);
        })
    }

    const load=()=> loading ? <Loading/> : null
    return <SafeAreaView style={CSS.xview}>
        {props.notop === undefined ? <TopAppName {...props}/> : null}
        <Heading val={'Cart'}/>
        <Heading sub={true} val={props.agent.info.addr}/>
        <ScrollView>{displayCart()}</ScrollView>
        {load()}
        <View style={[CSS.inrow, CSS.right, CSS.bottom]}>
            <CustomInput placeholder='remarks' icon='sticky-note-o' onChange={(v)=>setRemarks(v)} value={remarks}/>
            <AppButton title={`${getTotalAmount()}`} icon='money' onPress={handlePayNow}/>
            <AppButton icon='save' onPress={handlePayLater}/>
        </View>
    </SafeAreaView>
}

const mapx = state => {
    return {
        agent: state.agent.agent
        ,cart: state.cart.cart
        , color: state.config.color
    }
}
const mapd=dispatch=>{
    return {
        ...bindActionCreators({getSetCart}, dispatch)
    }
}
export default connect(mapx,mapd)(Cart);
