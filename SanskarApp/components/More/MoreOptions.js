import React, {useState} from 'react';
import {SafeAreaView, ScrollView, View} from 'react-native';
import {CSS} from "../common/gcss";
import TopAppName from "../common/topAppName";
import {Heading} from "../common/Heading";
import {connect} from 'react-redux'
import AppButton from "../common/AppButton";
import OrderHistory from "../orders/OrderHistory";
import Cart from "../orders/Cart";
import {Enum} from "../common/Config";

const MoreOptions = props => {
    const {navigation, route, color, agent} = props
    let btnWidth = 120;
    let saveBtnWidth = 60;
    const [text1, setText1] = useState('');
    const [curbg, setCurbg] = useState('#d3faee');
    const [xview, setXview] = useState(null);

    const handleOrderHistory = () => {
        setCurbg('#d3faee')
        let handleThis = () => {
            alert('saved');
        }
        let elem = <OrderHistory notop={true}/>
        setXview(elem);
    }

    const handleCart = () => {
        setCurbg('#daf3fa');
        let handleThis = () => {
            alert('saved');
        }
        let elem = <Cart notop={true}/>
        setXview(elem);
    }

    const renderViews = () => {
        const agentView = <View style={[CSS.inrow]}>
            <AppButton onPress={handleOrderHistory} title='Orders' icon='first-order'/>
            <AppButton onPress={handleCart} title='Cart' icon='cart-arrow-down'/>
        </View>
        const deliveryView = <View style={[CSS.inrow]}>
            <AppButton onPress={()=>{}} title='some setup'/>
        </View>

        switch (agent.info.xtype) {
            case Enum.viewType.agent:
                return agentView
            case Enum.viewType.delivery:
                return deliveryView
            default:
                return agentView
        }
    }


    return <SafeAreaView style={[CSS.xview, {backgroundColor: curbg}]}>
        <TopAppName {...props}/>
        <Heading val={'More...'}/>
        {renderViews()}
        <ScrollView>
            <Heading val={text1}/>
            <View style={{flex: 1}}>{xview}</View>
        </ScrollView>
    </SafeAreaView>
}

const mapx = state => {
    return {
        agent: state.agent.agent
        , color: state.config.color
    }
}
export default connect(mapx)(MoreOptions);
