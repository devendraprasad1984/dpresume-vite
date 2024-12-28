import React, {useState, useEffect} from 'react'
import {ScrollView, View, Text} from "react-native";
import {Heading} from "../common/Heading";
import Loading from "../common/Loading";
import NoDataFound from "../common/noDataFound";
import getFromAPI from "../common/getFromAPI";
import {Config, Enum} from "../common/Config";
import {CSS} from "../common/gcss";

const SupportResponse = props => {
    const {name, id} = props.agent.info || {name: '', id: -1}
    const [queries, setQueries] = useState([])
    const [supportIds, setSupportIds] = useState([])
    const [load, setLoad] = useState(false)

    useEffect(() => {
        getFromAPI(Config.getSupportQueriesEndpoint + '?agentid=' + id, data => {
            let arr = data.map(x => x.supportid)
            let uniqArr = [...new Set(arr)]
            let supp = uniqArr.map(x => {
                return {
                    id: x
                }
            })
            // console.log('support', supp)
            setSupportIds(supp)
            setQueries(data)
        })
    }, [])
    const display = () => {
        let elem = undefined
        return supportIds.map((s, i) => {
            let suppQur = queries.filter(t => t.supportid === s.id)
            let qur=suppQur.length===0 ? {query:'?',createdon:'',repliedOn:'',id:-1}: suppQur[0]
            elem=<View key={'KeySupportRes' + i} style={CSS.card}>
            <View style={CSS.cardInfo}>
                <View style={CSS.inrow}>
                    <Heading val={qur.repliedOn === null ? 'Not yet replied' : qur.id}/>
                    <Heading sub={true} val={qur.createdon}/>
                </View>
                <Text style={{color: Enum.orangered}}>Query: {qur.query}</Text>
                {suppQur.map((x, i) => <View key={'suppresK'+i} style={CSS.inrow}>
                    <Text style={{color: Enum.seaGreen}}>Reply: {x.reply}</Text>
                    <Text style={{color: Enum.gray, fontSize: 10}}>{x.repliedOn}</Text>
                </View>)}
            </View></View>
            return elem
        }) //outer map
    }


    const nodata = () => queries.length === 0 || supportIds.length === 0 ? <NoDataFound/> : null
    if (load) return <Loading/>
    return <ScrollView>
        <Heading val={'Discussions...'}/>
        {nodata()}
        {display()}
    </ScrollView>
}

export default SupportResponse
