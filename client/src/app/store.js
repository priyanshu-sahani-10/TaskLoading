import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import rootRedcuer from "./rootReducer";
import { authApi } from "@/features/api/authApi";
import { issueApi } from "@/features/api/issueApi";

const appStore = configureStore({
  reducer:rootRedcuer,
  middleware:(defaultMiddleware) => defaultMiddleware().concat(authApi.middleware, issueApi.middleware)
});

export default appStore;