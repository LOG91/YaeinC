const AUTH_LOGIN = 'AUTH_LOGIN';
const AUTH_LOGIN_SUCCESS = 'AUTH_LOGIN_SUCCESS';
const AUTH_LOGIN_FAILURE = 'AUTH_LOGIN_FAILURE';

export const login = () => ({ type: AUTH_LOGIN });
export const loginSuccess = (username) => ({ type: AUTH_LOGIN_SUCCESS, username });
export const loginFailure = () => ({ type: AUTH_LOGIN_FAILURE });

export const loginRequest = (username, password) => {
  return (dispatch) => {
    dispatch(login());

    return fetch('/api/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password })
    }).then(res => {
      console.log(res, '알이에스', username);
      dispatch(loginSuccess(username));
    }).catch(error => {
      dispatch(loginFailure());
    });
  };
};
const initialState = {
  login: { status: null },
  status: null
};

export default function signin(state = initialState, action) {
  switch (action.type) {
    case AUTH_LOGIN:
      return {
        ...state,
        login: {
          status: 'WAITING'
        }
      };
    case AUTH_LOGIN_SUCCESS:
      return {
        ...state,
        login: {
          status: 'SUCCESS'
        },
        status: {
          ...state.status,
          isLoggedIn: true,
          currentUser: action.username
        }
      };
    case AUTH_LOGIN_FAILURE:
      return {
        ...state,
        login: {
          status: "FAILURE"
        }
      };
    default:
      return state;
  }
}