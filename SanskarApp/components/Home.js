import React from 'react'
import {SafeAreaView, ScrollView, View} from 'react-native'
import {CSS} from "./common/gcss";
import TopHeaderBanner from "./banner/topHeaderBanner";
import MainAgentView from "./agentView/mainAgentView";
import ActionBar from "./header/actions/actionBar";
import {connect} from "react-redux";
import {Enum} from "./common/Config";

function Home(props) {
    const {navigation, route, agent} = props
    const {xtype} = agent.info

    const renderViews = () => {
        switch (xtype) {
            default:
                return <MainAgentView navigation={navigation} agent={agent}/>
        }
    }
    return (
        <SafeAreaView style={[CSS.safeAreaContainer]}>
            <ScrollView style={[CSS.xview]}>
                <View><ActionBar navigation={navigation} agent={agent}/></View>
                {xtype === Enum.viewType.agent && <View><TopHeaderBanner navigation={navigation} agent={agent}/></View>}
                <View>{renderViews()}</View>
            </ScrollView>
        </SafeAreaView>
    )
}

const mapx = state => {
    return {
        agent: state.agent.agent,
    }
}
export default connect(mapx)(Home)
