import React from "react";
import EventList from "./events/eventList";

type Props = {}
const Home: React.FC<Props> = (props): JSX.Element => {
    return <EventList/>
}
export default React.memo(Home)