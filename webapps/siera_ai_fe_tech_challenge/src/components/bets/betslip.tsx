import React from "react";
import Logger from "../../hoc/logger";
import DrawerNav from "../drawer/drawer";
import {CloseSquareOutlined} from "@ant-design/icons";
import styles from "../../config/styles";
import {useSelector} from "react-redux";
import {RootState} from "../../_redux/store";
import {BetItemType, BetSlipItemsType} from "../../config/app-data-types";
import BetSlipItem from "./betSlipItem";

type Props = {
    visible: boolean,
    handleBetWindow: (mode: boolean) => void
}
const BetSlip: React.FC<Props> = (props): JSX.Element => {
    const {visible, handleBetWindow} = props
    const betSlipItems: BetSlipItemsType = useSelector((_: RootState) => _.bets)

    const handleClose = () => {
        handleBetWindow(!visible)
    }
    const displayBetSlipItem = () => {
        if (betSlipItems.length === 0) return null
        return betSlipItems.map((betSlip: BetItemType) => {
            return <BetSlipItem key={'item-'+betSlip.id} betItem={betSlip}/>
        })
    }
    return <DrawerNav
        placement='right'
        visible={visible}
        onClose={handleClose}
    >
        <div>
            <div className='right-flex'>
                <CloseSquareOutlined style={styles.fontSize30} onClick={handleClose}/>
            </div>
            <h1>Bets Chosen By User</h1>
            <div>{displayBetSlipItem()}</div>
        </div>
    </DrawerNav>
}
export default React.memo(Logger(BetSlip))