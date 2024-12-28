import axios from "axios";

import api from "./api";
import appEnvConstants from "./app-env-constants";
import { IRoom } from "ms-npm/meet-models";
import { IScheduleVideoCallBody } from "../@types/Conversation";

const apiSubPath = appEnvConstants?.api?.baseUrl + appEnvConstants?.api?.meet;

const meetService = {
  ping: () => api.get(`${apiSubPath}/ping`),
  createRoom: (
    channelRef,
    body?
  ): Promise<{
    data: {
      result: string;
    };
  }> => api.post(`${apiSubPath}/room/${channelRef}`, body),
  fetchRoom: (
    roomId: string
  ): Promise<{
    data: {
      result: IRoom;
    };
  }> => api.get(`${apiSubPath}/room/${roomId}`),
  fetchToken: (
    userRef
  ): Promise<{
    data: {
      result: string;
    };
  }> => api.post(`${apiSubPath}/user/token/${userRef}`),
  record: (
    body
  ): Promise<{
    data: {
      ok: string;
      error: {
        code: string;
        message: string;
      };
    };
  }> =>
    axios.post(`https://video-app-8904-5634-dev.twil.io/recordingrules`, body),
  schedule: (
    body: IScheduleVideoCallBody
  ): Promise<{
    data: {
      result: string;
    };
  }> => api.post(`${apiSubPath}/room/schedule`, body),
};

export default meetService;
