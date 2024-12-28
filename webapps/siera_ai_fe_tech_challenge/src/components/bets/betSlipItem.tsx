import React from 'react'
import {Button} from "antd";
import {BetItemType} from "../../config/app-data-types";
import {useDispatch} from "react-redux";
import Actions from "../../_redux/actions";

type Props = {
    betItem: BetItemType
}
const BetSlipItem: React.FC<Props> = (props): JSX.Element => {
    const {betItem} = props
    const dispatch=useDispatch()

    const payload: BetItemType={
        id: betItem.id
    }
    const handleRemoveBetItem=()=>{
        dispatch(Actions.betActions.BetItemRemove(payload))
        dispatch(Actions.mockActions.actionGetSetSelCount({selId: payload.id, type: 'remove'}))
    }
    return <div style={{textAlign: 'center'}}>
        <h2>{betItem.name}</h2>
        <div><b>{betItem.price}</b></div>
        <div>
            <Button danger onClick={handleRemoveBetItem}>Remove</Button>
        </div>
    </div>
}

export default React.memo(BetSlipItem)