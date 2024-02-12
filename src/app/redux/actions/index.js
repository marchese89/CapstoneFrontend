export const LOGIN = "LOGIN";
export const LOGOUT = "LOGOUT";
export const ADD_PAYMENTS_DATA = "ADD_PAYMENTS_DATA";
export const ADD_CLIENT_SECRET = "ADD_CLIENT_SECRET";
export const REMOVE_PAYMENT_DATA = "REMOVE_PAYMENT_DATA";

export const addPaymentData = (solId, reqId, p) => {
  return {
    type: ADD_PAYMENTS_DATA,
    payload: {
      solutionId: solId,
      requestId: reqId,
      price: p,
    },
  };
};

export const removePaymentData = () => {
  return {
    type: REMOVE_PAYMENT_DATA,
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
