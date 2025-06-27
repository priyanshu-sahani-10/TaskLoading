// features/api/issueApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const ISSUE_API="http://localhost:5000/api/v1/user";


export const issueApi = createApi({
  reducerPath: "issueApi",
  baseQuery: fetchBaseQuery({
    baseUrl: ISSUE_API,
    credentials: "include", // for cookies
  }),
  endpoints: (builder) => ({
    createUserIssue: builder.mutation({
      query: (issueData) => ({
        url: "issue",
        method: "POST",
        body: issueData,
      }),
    }),
  }),
});

export const { useCreateUserIssueMutation } = issueApi;