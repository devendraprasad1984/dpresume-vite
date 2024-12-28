import React, {useCallback, useState} from "react";
import {BetItemType, SelectionType} from "../../config/app-data-types";
import {Button} from "antd";
import {useDispatch, useSelector} from "react-redux";
import Actions from "../../_redux/actions";
import {RootState} from "../../_redux/store";

type Props = {
    data: SelectionType,
    marketName: string,
    marketId: string
}

const getIfTeam2WinAndIsSelected = (marketData: any[], marketId: string) => {
    for (let marketArr of marketData) {
        for (let m of marketArr) {
            if (m.id !== marketId) continue
            if (m.id === marketId) {
                let {isTeamToWin, isSelected} = m
                return {isTeamToWin, isSelected}
            }
        }
    }
    return {isTeamToWin: false, isSelected: 0}
}

const Selection: React.FC<Props> = (props: any): JSX.Element => {
    const {data, marketName, marketId} = props
    const [dontAllowClick, setDontAllowClick] = useState(false)

    const dispatch = useDispatch()
    let btnStyle: any = {}

    const marketData: any[] = useSelector((_: RootState) => _.mockdata.map(x => x.markets))
    const betsPlacedByUser: BetItemType[] = useSelector((_: RootState) => _.bets)
    const selectionIdsInBets = betsPlacedByUser.map((_: BetItemType) => _.id)

    if (selectionIdsInBets.indexOf(data.id) !== -1) {
        btnStyle['backgroundColor'] = '#4edb4e'
    } else {
        btnStyle = {}
    }

    const payload: BetItemType = {
        id: data.id,
        name: data.name + ' ' + marketName,
        price: data.price
    }

    const handleAddToBet = useCallback(() => {
        const {isTeamToWin, isSelected} = getIfTeam2WinAndIsSelected(marketData, marketId)
        let dontAllow = (isTeamToWin && isSelected === 1)
        setDontAllowClick(p => dontAllow)
        if (dontAllow) return
        dispatch(Actions.mockActions.actionGetSetSelCount({selId: data.id, type: 'add'}))
        dispatch(Actions.betActions.BetItemAdd(payload))
    }, [])

    return <Button onClick={handleAddToBet} style={btnStyle}>
        <div className='col'>
            <span style={{fontWeight: 'bold'}}>{data.name}</span>
            <span style={{fontWeight: 'bold', fontSize: '12px'}}>{data.price}</span>
        </div>
    </Button>
}
export default React.memo(Selection)