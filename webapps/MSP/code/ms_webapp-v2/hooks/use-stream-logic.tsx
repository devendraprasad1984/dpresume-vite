import { useCallback } from "react";

import streamService from "../services/stream-service";
import client from "../services/stream-client";
import messageService from "../services/message-service";
import useAppStores from "../stores/app-context";

const useStreamLogic = () => {
  const { appStore } = useAppStores();

  const connectStream = useCallback(async () => {
    if (client.user) return;
    try {
      const res = await messageService.fetchToken();
      const streamToken = res?.data?.result;

      await client.connectUser({ id: appStore?.user?.user?.ref }, streamToken);
    } catch (error) {
      console.error(error);
    }
  }, [streamService]);

  return {
    connectStream,
  };
};

export default useStreamLogic;
