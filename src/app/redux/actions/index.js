export const LOGIN = "LOGIN";
export const LOGOUT = "LOGOUT";
export const ADD_PAYMENTS_DATA = "ADD_PAYMENTS_DATA";
export const ADD_CLIENT_SECRET = "ADD_CLIENT_SECRET";

export const addPaymentData = (solId, p) => {
  return {
    type: ADD_PAYMENTS_DATA,
    payload: {
      solutionId: solId,
      price: p,
    },
  };
};

export const addClientSecret = (secret) => {
  return {
    type: ADD_CLIENT_SECRET,
    payload: {
      clientSecret: secret,
    },
  };
};

export const loginAction = (userType) => {
  return {
    type: LOGIN,
    payload: userType,
  };
};

export const logoutAction = () => {
  return {
    type: LOGOUT,
  };
};
