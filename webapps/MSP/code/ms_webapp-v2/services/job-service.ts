import mockApi from "./mock-api";
import { Job, JobProfile } from "../@types/Job";

const jobService = {
  fetchJob: (
    id,
    params?,
    config?
  ): Promise<{
    data: JobProfile;
  }> => mockApi.get(`/api/jobs/${id}`, { params, ...config }),
  fetchJobs: (
    params?,
    config?
  ): Promise<{
    data: {
      result: {
        data: Job[];
        totalCount: number;
        currentPage: number;
        lastPage: number;
      };
    };
  }> => mockApi.get("/api/jobs", { params, ...config }),
};

export default jobService;
