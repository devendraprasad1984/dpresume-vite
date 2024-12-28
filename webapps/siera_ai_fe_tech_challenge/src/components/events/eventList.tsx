import React, {useMemo} from 'react'
import {useSelector} from "react-redux";
import {RootState} from "../../_redux/store";
import {EventType, ResponseType} from "../../config/app-data-types";
import Event from "./event";

type Props = {}
const displayEventCards = (eventData: any) => {
    //logical flow=>events->markets->selections->selection
    return eventData.map((event: EventType) => <Event key={event.id} event={event}/>)
}


const EventList: React.FC<Props> = (props): JSX.Element => {
    const {} = props
    const eventData: ResponseType = useSelector((_: RootState) => _.mockdata)
    const displayEventFromCache = useMemo(() => displayEventCards(eventData), [eventData])
    return <>{displayEventFromCache}</>
}
export default React.memo(EventList)