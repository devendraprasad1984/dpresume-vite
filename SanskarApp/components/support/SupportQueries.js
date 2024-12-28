import React, {Component} from 'react';
import {View} from 'react-native';
import {Config, Enum} from '../common/Config';
import CustomInput from "../common/customInput";
import {CSS} from "../common/gcss";
import postToAPI from "../common/postToAPI";
import Loading from "../common/Loading";
import AppButton from "../common/AppButton";
import {toastr} from "../common/Toast";

export default class SupportQueries extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        }
    }

    handleSubmit = () => {
        if(this.name==='' || this.mobile==='' || this.email==='' || this.query===''||this.name===undefined || this.mobile===undefined || this.email===undefined || this.query===undefined){
            toastr.showToast('please fill form completely')
            return
        }
        let payload = {
            name: this.name
            , mobile: this.mobile
            , email: this.email
            , query: this.query
            ,agentid: this.props.agent.info.id || -1
        }
        this.setState({loading: true});
        postToAPI(Config.saveSupportQueryEndpoint, payload, (data) => {
            let {status} = data;
            if (status === Enum.success) {
                this.setState({loading: false});
                toastr.showToast('Data has been saved');
                // this.props.navigation.goBack();
            } else {
                this.setState({loading: false});
                toastr.showToast('not saved, plz contact BDF Admin');
                // this.props.navigation.goBack();
            }
        })
    }
    isLoading = () => {
        if (this.state.loading) return <Loading/>
    }

    render() {
        return <View style={[CSS.center]}>
            <CustomInput placeholder='Name' onChange={(val) => this.name = val}/>
            <CustomInput placeholder='Mobile' onChange={(val) => this.mobile = val}/>
            <CustomInput placeholder='Email' onChange={(val) => this.email = val}/>
            <CustomInput placeholder='Your Query' onChange={(val) => this.query = val} multiline={true}/>
            <AppButton title='Submit' onPress={this.handleSubmit}/>
            {this.isLoading()}
        </View>
    }
}
