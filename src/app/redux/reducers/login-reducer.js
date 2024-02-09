import { LOGIN, LOGOUT } from "../actions";

const initialState = {
  isLogged: false,
  userType: "",
};

export default function loginReducer(state = initialState, action) {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        isLogged: true,
        userType: action.payload,
      };
    case LOGOUT:
      return {
        ...state,
        isLogged: false,
      };

    default:
      return state;
  }
}
