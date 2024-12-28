import React, {useState} from "react";
import {Route, Routes} from 'react-router-dom'
import Home from "./home";
import NoDataOrPage from "./nodata";
import BetSlip from "./bets/betslip";
import ENUMS from "../config/enum";
import {Layout} from 'antd';
import {MenuOutlined} from "@ant-design/icons";
import styles from "../config/styles";

const {Header, Footer, Content} = Layout;

type Props = {}
const Main: React.FC<Props> = (props): JSX.Element => {
    const [betSlipVisible, setBetSlipVisible] = useState(false)

    const prepareRoutes = () => {
        return <>
            <Route path={ENUMS.routes.names.home} element={<Home/>}/>
            <Route element={<NoDataOrPage/>}/>
        </>
    }
    const handleBetWindow = (mode: boolean) => {
        setBetSlipVisible(mode)
    }
    return (
        <Layout>
            <div className='right-flex'>
                <MenuOutlined onClick={() => handleBetWindow(!betSlipVisible)} style={styles.fontSize30}/>
            </div>
            <BetSlip visible={betSlipVisible} handleBetWindow={handleBetWindow}/>
            <Content>
                <Routes>{prepareRoutes()}</Routes>
            </Content>
            <Footer>footer goes here</Footer>
        </Layout>
    )
}

export default React.memo(Main)