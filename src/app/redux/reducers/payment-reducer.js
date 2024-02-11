import { ADD_PAYMENTS_DATA, ADD_CLIENT_SECRET } from "../actions";

const initialState = {
  solutionId: -1,
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
      };

    case ADD_CLIENT_SECRET:
      return {
        ...state,
        clientSecret: action.payload.clientSecret,
      };

    default:
      return state;
  }
}
