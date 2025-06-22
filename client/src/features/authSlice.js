import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "authSlice",
  initialState,

  reducers:{

    userLoggenIn:(state,action)=>{
        state.user=action.payload.user;
        state.isAuthenticated=true;
    },

    userLogOut:(state)=>{
        state.user=null;
        state.isAuthenticated=false;
    }
  }
});