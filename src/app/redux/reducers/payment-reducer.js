import {
  ADD_PAYMENTS_DATA,
  ADD_CLIENT_SECRET,
  REMOVE_PAYMENT_DATA,
} from "../actions";

const initialState = {
  solutionId: -1,
  requestId: -1,
  price: 0,
  clientSecret: "",
};

export default function paymentReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_PAYMENTS_DATA:
      return {
        ...state,
        solutionId: action.payload.solutionId,
        price: action.payload.price,
        requestId: action.payload.requestId,
      };

    case ADD_CLIENT_SECRET:
      return {
        ...state,
        clientSecret: action.payload.clientSecret,
      };
    case REMOVE_PAYMENT_DATA:
      return {
        ...state,
        solutionId: -1,
        price: 0,
        clientSecret: "",
      };

    default:
      return state;
  }
}
