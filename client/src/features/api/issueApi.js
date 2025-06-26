// features/api/issueApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = "http://localhost:5000/api/v1/";


export const issueApi = createApi({
  reducerPath: "issueApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: "include", // for cookies
  }),
  endpoints: (builder) => ({
    createIssue: builder.mutation({
      query: (issueData) => ({
        url: "issues",
        method: "POST",
        body: issueData,
      }),
    }),
  }),
});

export const { useCreateIssueMutation } = issueApi;
export default issueApi.reducer;