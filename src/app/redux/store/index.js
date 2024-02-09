import { configureStore, combineReducers } from "@reduxjs/toolkit";
import loginReducer from "../reducers/login-reducer";

const bigReducer = combineReducers({
  login: loginReducer,
});

const store = configureStore({
  reducer: bigReducer,
});

export default store;
