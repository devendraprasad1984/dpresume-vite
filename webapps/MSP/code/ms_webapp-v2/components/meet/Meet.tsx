import React from "react";
import { observer } from "mobx-react-lite";

import PreJoin from "../../components/meet/PreJoin";
import useRoomState from "../../twilio/hooks/useRoomState";
import Session from "./Session";

const Meet = observer(() => {
  const roomState = useRoomState();

  return <>{roomState === "disconnected" ? <PreJoin /> : <Session />}</>;
});

export default Meet;
