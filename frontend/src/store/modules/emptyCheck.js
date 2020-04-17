export const CHURCH_FORM_NAME_EMPTY = 'emptyCheck/CHURCH_FORM_NAME_EMPTY';

const initialState = {
  churchForm: {
    isEmptyName: false,
  }
};

export default function emptyCheck(state = initialState, action) {
  switch (action.type) {
    case CHURCH_FORM_NAME_EMPTY:
      return {
        ...state,
        churchForm: { isEmptyName: action.right }
      };
    default:
      return state;
  }
}