import React from 'react';
import {Root, snapshotAndCrashChecks} from "./common";
import App from '../App'
import Main from "../components/main";
import NoDataOrPage from "../components/nodata";
import DrawerNav from "../components/drawer/drawer";
import BetSlip from "../components/bets/betslip";
import BetSlipItem from "../components/bets/betSlipItem";
import EventList from "../components/events/eventList";
import Event from "../components/events/event";
import Market from "../components/events/market";
import Selection from "../components/events/selection";


const strSuffix = 'snapshot check'
describe("snapshot changes of components", () => {
    snapshotAndCrashChecks(`<app> ${strSuffix}`, <Root><App/></Root>);
    snapshotAndCrashChecks(`<main> ${strSuffix}`, <Root><Main/></Root>);
    snapshotAndCrashChecks(`<nodata> ${strSuffix}`, <NoDataOrPage/>);
    snapshotAndCrashChecks(`<bets> ${strSuffix}`, <BetSlip visible={false} handleBetWindow={jest.fn()}/>);
    snapshotAndCrashChecks(`<betsSlipItems> ${strSuffix}`, <Root><BetSlipItem betItem={{id: 'sel_1', name: 'test', price: 0}}/></Root>);
    snapshotAndCrashChecks(`<drawer> ${strSuffix}`, <DrawerNav placement='right' visible={false} onClose={jest.fn()}/>);

    snapshotAndCrashChecks(`<event-list> ${strSuffix}`, <Root><EventList/></Root>);
    snapshotAndCrashChecks(`<events> ${strSuffix}`, <Event event={{markets: []}}/>);
    snapshotAndCrashChecks(`<market> ${strSuffix}`, <Market data={{selections: []}}/>);
    snapshotAndCrashChecks(`<selection> ${strSuffix}`, <Root><Selection data={{id: 'sel_1', name: 'test', price: 0}} marketName={'test'}/></Root>);
});
