import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice"; 
import { authApi } from "@/features/api/authApi";
import { issueApi } from "@/features/api/issueApi";

const rootRedcuer = combineReducers({
    [authApi.reducerPath]:authApi.reducer,
    [issueApi.reducerPath]:issueApi.reducer,
    auth:authReducer, 
});
export default rootRedcuer;