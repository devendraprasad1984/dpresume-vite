import mockApi from "./mock-api";

const streamService = {
  fetchToken: (params?, config?) =>
    mockApi.get(`/api/stream`, { params, ...config }),
};

export default streamService;
