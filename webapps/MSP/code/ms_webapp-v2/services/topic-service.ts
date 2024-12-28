import mockApi from "./mock-api";
import { Topic, TopicProfile } from "../@types/Topic";
import { ITopicCreate, ITopic } from "ms-npm/topic-models";

import api from "./api";
import appEnvConstants from "./app-env-constants";
const apiSubPath =
  appEnvConstants?.api?.baseUrl + appEnvConstants?.api?.message;

const topicService = {
  addTopic: (
    body: ITopicCreate
  ): Promise<{
    data: {
      result: ITopic;
    };
  }> => {
    return api.post(`${apiSubPath}/topic`, body);
  },
  updateTopic: (
    id: string,
    body: Partial<ITopic>
  ): Promise<{
    data: {
      result: ITopic;
    };
  }> => api.patch(`${apiSubPath}/topic/${id}`, body),
  fetchTopic: (
    id,
    params?,
    config?
  ): Promise<{
    data: TopicProfile;
  }> => mockApi.get(`/api/topics/${id}`, { params, ...config }),
  fetchTopics: (
    params?,
    config?
  ): Promise<{
    data: {
      result: {
        data: Topic[];
        totalCount: number;
        currentPage: number;
        lastPage: number;
      };
    };
  }> => mockApi.get("/api/topics", { params, ...config }),
};

export default topicService;
