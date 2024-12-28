import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";

import AppStateProvider from "../../../twilio/state";
import useAppStores from "../../../stores/app-context";
import withLogin from "../../../components/core/WithLogin";
import Meet from "../../../components/meet/Meet";
import MeetWrapper from "../../../components/meet/MeetWrapper";
import meetService from "../../../services/meet-service";

const Page = observer(() => {
  const { meetStore } = useAppStores();

  const router = useRouter();
  const { roomId } = router.query;

  useEffect(() => {
    const fetchRoom = async (roomId: string) => {
      try {
        const res = await meetService.fetchRoom(roomId);
        meetStore.setRoom(res?.data?.result);
      } catch (error) {
        console.error(error);
      }
    };

    meetStore.setRoomId(roomId as string);
    fetchRoom(roomId as string);
  }, [roomId, meetStore]);

  return (
    <AppStateProvider>
      <MeetWrapper>
        <Meet />
      </MeetWrapper>
    </AppStateProvider>
  );
});

export default withLogin(Page);
