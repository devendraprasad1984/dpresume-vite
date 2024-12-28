import React, {useEffect} from 'react'
import {NavigationContainer} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'

import Home from './Home'
import {Enum} from "./common/Config";
import Splash from "./Splash";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {getSetConfig} from "./redux/actionCreators";
import Support from "./support/Support";
import TopAppName from "./common/topAppName";
import Catalogue from "./agentView/Catalogue";
import FillOrder from "./agentView/FillOrder";
import OrderScanner from "./agentView/OrderScanner";
import Offers from "./agentView/Offers";
import UserProfile from "./profile/UserProfile";
import HelpSplash from "./help/splashHelp";
import MoreOptions from "./More/MoreOptions";
import Cart from "./orders/Cart";
import DeliverOrder from "./agentView/DeliverOrder";

const Stack = createStackNavigator()
const screenOptions = {
    gestureEnabled: true,
    headerStyle: {
        backgroundColor: '#7c15c6'
    },
    headerTitleStyle: {
        fontWeight: 'bold'
    },
    headerTintColor: 'white',
    headerBackTitleVisible: false
}


const MainNav = props => {
    const {getSetConfig} = props;
    useEffect(() => {
        getSetConfig();
    }, []);

    return <NavigationContainer>
        <Stack.Navigator initialRouteName={Enum.screenName.splash} screenOptions={screenOptions} headerMode='false'>
            <Stack.Screen name={Enum.screenName.splash} component={Splash}/>
            <Stack.Screen name={Enum.screenName.home} component={Home}/>
            <Stack.Screen name={Enum.screenName.support} component={Support}/>
            <Stack.Screen name={Enum.screenName.topAppname} component={TopAppName}/>
            <Stack.Screen name={Enum.screenName.catalogue} component={Catalogue}/>
            <Stack.Screen name={Enum.screenName.fillorder} component={FillOrder}/>
            <Stack.Screen name={Enum.screenName.orderscanner} component={OrderScanner}/>
            <Stack.Screen name={Enum.screenName.offers} component={Offers}/>
            <Stack.Screen name={Enum.screenName.userProfile} component={UserProfile}/>
            <Stack.Screen name={Enum.screenName.helpSplash} component={HelpSplash}/>
            <Stack.Screen name={Enum.screenName.moreOptions} component={MoreOptions}/>
            <Stack.Screen name={Enum.screenName.cart} component={Cart}/>
            <Stack.Screen name={Enum.screenName.deliverOrder} component={DeliverOrder}/>
        </Stack.Navigator>
    </NavigationContainer>
}


//mapStateToProps
const mapx = (state) => {
    return {
        config: state.config.config,
        color: state.config.color
    }
}
//mapDispatchToProps
const mapd = (dispatch) => {
    return {
        ...bindActionCreators({getSetConfig}, dispatch)
    }
}

export default connect(mapx, mapd)(MainNav);
