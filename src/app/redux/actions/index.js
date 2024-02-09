export const LOGIN = "LOGIN";
export const LOGOUT = "LOGOUT";

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
