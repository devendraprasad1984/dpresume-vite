import {Modal, View} from "react-native";
import React from "react";
import {Heading} from "./Heading";
import {CSS} from "./gcss";
import AppButton from "./AppButton";
import {Enum} from "./Config";


class PopupToast extends React.Component {
    constructor(props) {
        super(props)
        this.opac = 0.9
        this.state = {
            modal: false
            , header: ''
            , content: ''
            , autohide: false
            , modalStyle: {backgroundColor: Enum.darkGreen, opacity: this.opac}
        }
    }

    show = (header, content = '', type = Enum.colorTypes.default, autohide = true) => {
        let bgcolor = type === Enum.colorTypes.success ? Enum.forestGreen : type === Enum.colorTypes.danger ? Enum.orangered : type === Enum.colorTypes.warning ? Enum.orange : Enum.darkGray
        this.setState({
            modal: true,
            header,
            content,
            autohide,
            modalStyle: {backgroundColor: bgcolor, opacity: this.opac}
        })
        if (autohide === true) setTimeout(() => this.hide(), 700)
    }
    hide = () => this.setState({modal: false})

    render() {
        return <Modal transparent={true} visible={this.state.modal} animationType={'slide'}>
            <View style={CSS.modalContainer}>
                <View style={[CSS.modalViewCenter, this.state.modalStyle]}>
                    <Heading val={this.state.header} click={this.hide} stylex={{color: Enum.white}}/>
                    <Heading sub={true} val={this.state.content} stylex={{color: Enum.white}}/>
                    <AppButton onPress={this.hide} icon={this.state.autohide ? 'check' : 'close'}/>
                </View>
            </View>
        </Modal>
    }
}

export default PopupToast
