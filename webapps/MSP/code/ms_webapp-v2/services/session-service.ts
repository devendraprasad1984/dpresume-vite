import mockApi from "./mock-api";
import { Session, SessionProfile } from "../@types/Session";

const sessionService = {
  fetchSession: (
    id,
    params?,
    config?
  ): Promise<{
    data: SessionProfile;
  }> => mockApi.get(`/api/sessions/${id}`, { params, ...config }),
  fetchSessions: (
    params?,
    config?
  ): Promise<{
    data: {
      result: {
        data: Session[];
        totalCount: number;
        currentPage: number;
        lastPage: number;
      };
    };
  }> => mockApi.get("/api/sessions", { params, ...config }),
};

export default sessionService;
