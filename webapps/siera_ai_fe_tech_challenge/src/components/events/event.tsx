import React, {useMemo} from "react";
import {EventType, MarketType} from "../../config/app-data-types";
import Market from "./market";
import {Card} from "antd";

type Props = {
    event: EventType
}

const display = (event: any): JSX.Element[] => {
    return event.markets.map((market: MarketType) => <Market key={market.id} data={market}/>)
}

const Event: React.FC<Props> = (props): JSX.Element => {
    const {event} = props
    const displayEventFromCache = useMemo(() => display(event), [event])
    const title = <h2>{event.name}</h2>
    return <Card title={title} bordered={true}>
        {displayEventFromCache}
    </Card>
}
export default React.memo(Event)