import React from 'react'
import AppCamera from "./common/Camera";
import {SafeAreaView, Text} from 'react-native'

const TestCamera=props=>{
    return <SafeAreaView style={{flex:1}}>
        <Text>Testing Capture of Images Saving....</Text>
        <AppCamera style={{flex:1}}/>
    </SafeAreaView>
}

export default TestCamera
