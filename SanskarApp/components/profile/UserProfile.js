import React, {useState} from 'react';
import {SafeAreaView, ScrollView, Text, View} from 'react-native';
import {CSS} from "../common/gcss";
import AppButton from "../common/AppButton";
import {Config, Enum} from "../common/Config";
import AppIcon from "../common/AppIcon";
import {Heading} from "../common/Heading";
import CustomInput from "../common/customInput";
import Accordian from "../common/Accordian";
import TopAppName from "../common/topAppName";
import {connect} from "react-redux";
import getFromAPI from "../common/getFromAPI";
import OrderCards from "../orders/OrderCards";

const UserProfile = props => {
    const {params} = props.route;
    const {config, agent} = props;
    let btnWidth = 120;
    let saveBtnWidth = 60;
    const [text1, setText1] = useState('Choose an Option');
    const [curbg, setCurbg] = useState('#fdeb93');
    const [xview, setXview] = useState(null);
    const [addr, setAddr] = useState([]);
    const {address, city, country, pincode, landmark} = agent.info
    const [curAdr, setCurAdr] = useState({addr: {address, city, country, pin: pincode, landmark}})

    React.useEffect(() => {
        let id = agent.info.id
        getFromAPI(Config.addressEndpoint + '?id=' + id, (data) => {
            setAddr(data)
        })
    }, [])


    const handleSignout = () => {
        props.navigation.navigate(Enum.screenName.splash, {signout: 1, params})
    }
    const dummy = () => {
        alert('in progress');
    }

    const pullMultipleAddress = () => {
        return addr.map((x, i) => {
            let {address, city, country, pin, landmark} = x
            return <Heading key={'addr' + i}
                            val={address + ', ' + city + ', ' + country + ', ' + pin + ', ' + landmark}
                            click={() => handleAddress({addr: {address, city, country, pin, landmark}})}/>
        })
    }

    const handleAddress = (curAd) => {
        setText1('Default Address');
        setCurbg(Enum.lightBlue);
        let handleThis = () => {
            alert('saved address');
        }
        let elem = null;
        let {address, city, country, pin, landmark} = curAd.addr
        elem = <View>
            <CustomInput placeholder={'address: ' + address} icon='address-card'/>
            <CustomInput placeholder={'city: ' + city} icon='city' mat={true}/>
            <CustomInput placeholder={'country: ' + country} icon='zip-box' mat={true}/>
            <CustomInput placeholder={'pin: ' + pin} icon='map-pin'/>
            <CustomInput placeholder={'landmark: ' + landmark} icon='map-marker'/>
            <AppButton title='Save' onPress={handleThis}/>
            <ScrollView>{pullMultipleAddress()}</ScrollView>
        </View>;
        setXview(elem);
    }
    const handlePassword = () => {
        setText1('Password Management');
        setCurbg(Enum.lightCoral);
        let handleThis = () => {
            alert('saved password');
        }
        let elem = null;
        elem = <View>
            <CustomInput type='password' placeholder='password' icon='key'/>
            <CustomInput type='password' placeholder='confirm password' icon='keyboard-o'/>
            <AppButton title='Save' onPress={handleThis}/>
        </View>;
        setXview(elem);
    }
    const handleContacts = () => {
        setText1('Phone and Contacts');
        setCurbg(Enum.lightCyan);
        let handleThis = () => {
            alert('saved contact');
        }
        let elem = null;
        let {name, email, mobile} = agent.info
        elem = <View>
            <CustomInput placeholder={'Name:' + name} icon='key'/>
            <CustomInput placeholder={'Email:' + email} icon='email' mat={true}/>
            <CustomInput placeholder={'mobile:' + mobile} icon='cellphone' mat={true}/>
            <AppButton title='Save' width={saveBtnWidth} onPress={handleThis}/>
        </View>;
        setXview(elem);
    }
    const handleBills = () => {
        setText1('Billing Info');
        setCurbg(Enum.lightGray);
        let elem = null;
        elem = <ScrollView>
            <Text style={CSS.scrollText}>information about the bills that you have been generated...</Text>
        </ScrollView>;
        setXview(elem);
    }
    const handlePolicies = () => {
        setText1('Policies');
        setCurbg(Enum.lightGreen);
        let elem = null;
        elem = <ScrollView>
            <Text style={CSS.scrollText}>company policy information for using the app</Text>
        </ScrollView>;
        setXview(elem);
    }
    const handleLicence = () => {
        setText1('Licences');
        setCurbg(Enum.lightSalmon);
        let elem = null;
        elem = <ScrollView>
            <Text style={CSS.scrollText}>your personal contract as agreed by you and the company</Text>
        </ScrollView>;
        setXview(elem);
    }
    const handleHelp = () => {
        let helpData = [{title: 'title1', content: 'content1', link: 'https://google.com'}, {
            title: 'title2',
            content: 'content2',
            link: 'https://dpresume.com'
        }, {title: 'title3', content: 'content3', link: ''}];
        let displayAccordianHelp = () => {
            return helpData.map((x, i) => {
                return <Accordian key={'helpAccordKey' + i} title={x.title} data={x.content} link={x.link}/>
            });
        }
        setText1('Help');
        setCurbg(Enum.lightSeaGreen);

        let elem = null;
        elem = <ScrollView>
            <Text style={CSS.scrollText}>some faq about using the app, for anything else, please get in touch...</Text>
            {displayAccordianHelp()}
        </ScrollView>;
        setXview(elem);
    }

    const handleGetHandoverCode = () => {
        setText1('Your Parcel HandOver Code');
        setCurbg(Enum.lightSteelBlue);
        let elem = null;
        let {id} = agent.info
        let suf = '?agentid=' + id + '&type=handovercode'
        getFromAPI(Config.getOrderEndpoint + suf, data => {
            elem = <ScrollView>
                <OrderCards data={data} code={true}/>
            </ScrollView>;
            setXview(elem);
        })
    }

    return <SafeAreaView style={[CSS.xview, {backgroundColor: curbg}]}>
        <TopAppName {...props}/>
        <View style={[CSS.inrow]}>
            <AppIcon name={'face'} mat={true} size={60}/>
        </View>
        <View style={[CSS.inrow]}>
            <AppButton width={btnWidth} onPress={() => handleAddress(curAdr)} title='Address' icon='fort-awesome'/>
            <AppButton width={btnWidth} onPress={handleContacts} title='Contacts' icon='deskphone' mat={true}/>
            <AppButton width={btnWidth} onPress={handlePassword} title='Password' icon='key'/>
            <AppButton width={btnWidth} onPress={handleBills} title='Bills' icon='currency-inr' mat={true}/>
            <AppButton width={btnWidth} onPress={handlePolicies} title='Policies' icon='poll' mat={true}/>
            <AppButton width={btnWidth} onPress={handleLicence} title='Licencing' icon='license' mat={true}/>
            <AppButton width={btnWidth} onPress={handleHelp} title='Help?' icon='timeline-help' mat={true}/>
            <AppButton width={btnWidth} onPress={handleGetHandoverCode} title='Codes' icon='barcode'/>
            <AppButton width={btnWidth} icon={'sign-out'} title='logoff' onPress={handleSignout}/>
        </View>

        <ScrollView style={CSS.xmargin}>
            <Heading val={text1}/>
            {xview}
        </ScrollView>
    </SafeAreaView>
}

const mapx = state => {
    return {
        agent: state.agent.agent,
        config: state.config.config,
        color: state.config.color
    }
}
export default connect(mapx)(UserProfile);
