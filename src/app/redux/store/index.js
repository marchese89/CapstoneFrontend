import { configureStore, combineReducers } from "@reduxjs/toolkit";
import loginReducer from "../reducers/login-reducer";
import paymentReducer from "../reducers/payment-reducer";

const bigReducer = combineReducers({
  login: loginReducer,
  payment: paymentReducer,
});

const store = configureStore({
  reducer: bigReducer,
});

export default store;
