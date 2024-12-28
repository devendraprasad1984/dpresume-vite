import api from "./api";
import appEnvConstants from "./app-env-constants";
const apiSubPath =
  appEnvConstants?.api?.baseUrl + appEnvConstants?.api?.mediaFile;

const mediaService = {
  uploadUserProfilePhoto: (
    ref: string,
    body: FormData
  ): Promise<{
    data: {
      url: string;
    };
  }> => api.post(`${apiSubPath}/profile/${ref}`, body),
  uploadOrgProfilePhoto: (
    id: number,
    body: FormData
  ): Promise<{
    data: {
      url: string;
    };
  }> => api.post(`${apiSubPath}/company/${id}`, body),
  uploadTopicImage: (
    topicRef: string,
    body: FormData
  ): Promise<{
    data: {
      url: string;
    };
  }> => api.post(`${apiSubPath}/topic/${topicRef}`, body),
};

export default mediaService;
