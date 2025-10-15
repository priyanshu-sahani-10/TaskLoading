import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const ISSUE_API = "http://localhost:5000/api/v1/issue/";

export const issueApi = createApi({
  reducerPath: "issueApi",
  baseQuery: fetchBaseQuery({
    baseUrl: ISSUE_API,
    credentials: "include", // for cookies
  }),

  // 👇 enable tag-based cache invalidation
  tagTypes: ["Issue", "UserIssues", "AllIssues"],

  endpoints: (builder) => ({
    // 🟢 Create Issue
    createUserIssue: builder.mutation({
      query: (issueData) => ({
        url: "postIssue",
        method: "POST",
        body: issueData,
      }),
      invalidatesTags: ["AllIssues", "UserIssues"], // re-fetch issue lists
    }),

    // 🟣 Get all issues (community board)
    getAllIssue: builder.query({
      query: () => ({
        url: "getIssue",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["AllIssues"],
    }),

    // 💙 Toggle upvote
    toggleUpvote: builder.mutation({
      query: (issueId) => ({
        url: `upvoteIssue/${issueId}`,
        method: "PUT",
        body: { issueId },
        credentials: "include",
      }),
      async onQueryStarted(issueId, { dispatch, queryFulfilled }) {
        // Optimistically update single issue
        const patchResult = dispatch(
          issueApi.util.updateQueryData("getSingleIssue", issueId, (draft) => {
            if (draft?.data) {
              const userId = "currentUserId"; // You can dynamically replace this if available in auth
              const alreadyUpvoted = draft.data.upvotes.includes(userId);
              if (alreadyUpvoted) {
                draft.data.upvotes = draft.data.upvotes.filter(
                  (id) => id !== userId
                );
              } else {
                draft.data.upvotes.push(userId);
              }
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: (result, error, issueId) => [
        { type: "Issue", id: issueId },
        "AllIssues",
        "UserIssues",
      ],
    }),

    // 🧍‍♂️ Get all issues of the logged-in user
    getUserIssues: builder.query({
      query: (status) => ({
        url:
          status && status !== "All"
            ? `my-issues?status=${status}`
            : "my-issues",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["UserIssues"],
    }),

    // ⚙️ Admin: update issue status
    updateIssueStatus: builder.mutation({
      query: ({ issueId, status }) => ({
        url: `/admin/updateIssues/${issueId}`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["AllIssues", "UserIssues"],
    }),

    // 🔍 Get a single issue (for details or update)
    getSingleIssue: builder.query({
      query: (issueId) => ({
        url: `/getIssue/${issueId}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: (result, error, issueId) => [
        { type: "Issue", id: issueId },
      ],
    }),

    // ✏️ Update user’s own issue
    updateUserIssue: builder.mutation({
      query: ({ issueId, issueData }) => ({
        url: `updateIssue/${issueId}`,
        method: "PUT",
        body: issueData,
      }),
      invalidatesTags: (result, error, { issueId }) => [
        { type: "Issue", id: issueId },
        "UserIssues",
        "AllIssues",
      ],
    }),

    // ❌ Delete user’s own issue
    deleteUserIssue: builder.mutation({
      query: (issueId) => ({
        url: `deleteIssue/${issueId}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["UserIssues", "AllIssues"],
    }),
  }),
});

export const {
  useCreateUserIssueMutation,
  useGetAllIssueQuery,
  useToggleUpvoteMutation,
  useGetUserIssuesQuery,
  useUpdateIssueStatusMutation,
  useGetSingleIssueQuery,
  useDeleteUserIssueMutation,
  useUpdateUserIssueMutation,
} = issueApi;
