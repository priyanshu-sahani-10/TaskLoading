import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const ISSUE_API = "http://localhost:5000/api/v1/issue";

export const issueApi = createApi({
  reducerPath: "issueApi",
  baseQuery: fetchBaseQuery({
    baseUrl: ISSUE_API,
    credentials: "include", // for cookies
  }),

  endpoints: (builder) => ({
    createUserIssue: builder.mutation({
      query: (issueData) => ({
        url: "postIssue",
        method: "POST",
        body: issueData,
      }),
    }),

    getAllIssue: builder.query({
      query: () => ({
        url: "getIssue",
        method: "GET",
        credentials: "include",
      }),
    }),

    toggleUpvote: builder.mutation({
      query: (issueId) => ({
        url: `upvoteIssue/${issueId}`,
        method: "PUT",
        body: { issueId },
        credentials: "include",
      }),
    }),

    getUserIssues: builder.query({
      query: (status) => ({
        url: status ? `my-issues?status=${status}` : "my-issues",
        method: "GET",
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useCreateUserIssueMutation,
  useGetAllIssueQuery,
  useToggleUpvoteMutation,
  useGetUserIssuesQuery
} = issueApi;
