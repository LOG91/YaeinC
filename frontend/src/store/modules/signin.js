const AUTH_LOGIN = 'AUTH_LOGIN';
const AUTH_LOGIN_SUCCESS = 'AUTH_LOGIN_SUCCESS';
const AUTH_LOGIN_FAILURE = 'AUTH_LOGIN_FAILURE';

const AUTH_GET_STATUS = 'AUTH_GET_STATUS';
const AUTH_GET_STATUS_SUCCESS = 'AUTH_GET_STATUS_SUCCESS';
const AUTH_GET_STATUS_FAILURE = 'AUTH_GET_STATUS_FAILURE';

export const login = () => ({ type: AUTH_LOGIN });
export const loginSuccess = (username) => ({ type: AUTH_LOGIN_SUCCESS, username });
export const loginFailure = () => ({ type: AUTH_LOGIN_FAILURE });

export const getStatus = () => ({ type: AUTH_GET_STATUS });
export const getStatusSuccess = (username) => ({ type: AUTH_GET_STATUS_SUCCESS, username });
export const getStatusFailure = () => ({ type: AUTH_GET_STATUS_FAILURE });


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
export const getStatusRequest = () => {
  return (dispatch) => {
    dispatch(getStatus());

    return fetch('/api/getinfo')
      .then((res) => {
        dispatch(getStatusSuccess(res.data.info.username));
      })
      .catch((err) => {
        dispatch(getStatusFailure());
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
    case AUTH_GET_STATUS:
      return {
        ...state,
        status: {
          ...state.status,
          isLoggedIn: true
        }
      };
    case AUTH_GET_STATUS_SUCCESS:
      return {
        ...state,
        status: {
          ...state.status,
          valid: true,
          currentUser: action.username
        }
      };
    case AUTH_GET_STATUS_FAILURE:
      return {
        ...state,
        status: {
          ...state.status,
          valid: false,
          isLoggedIn: false
        }
      };
    default:
      return state;
  }
}