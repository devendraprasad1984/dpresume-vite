import mockApi from "./mock-api";
import { Conversation } from "../@types/Conversation";
import api from "./api";
import appEnvConstants from "./app-env-constants";
const apiSubPath =
  appEnvConstants?.api?.baseUrl + appEnvConstants?.api?.message;

const messageService = {
  fetchToken: (): Promise<{
    data: {
      result: string;
    };
  }> => api.post(`${apiSubPath}/user/token`),
  fetchConversations: (
    params?,
    config?
  ): Promise<{
    data: {
      result: {
        data: Conversation[];
        totalCount: number;
        currentPage: number;
        lastPage: number;
      };
    };
  }> => mockApi.get(`${apiSubPath}/conversations`, { params, ...config }),
  archiveChannel: (id): Promise<any> =>
    api.post(`${apiSubPath}/channel/archive/${id}`),
  //TODO: added just in case we need 1-1 chat to be deleted
  deleteChatChannel: (id): Promise<any> =>
    api.delete(`${apiSubPath}/channel/${id}`),
  createChannel: (body: { members: string[]; name?: string }): Promise<any> =>
    api.post(`${apiSubPath}/channel`, body),
  inviteToChannel: (body: {
    channelRef: string;
    members: string[];
  }): Promise<any> => api.post(`${apiSubPath}/channel/invite`, body),
  removeFromChannel: (body: {
    channelRef: string;
    members: string[];
  }): Promise<any> => api.post(`${apiSubPath}/channel/leave`, body),
};

export default messageService;
