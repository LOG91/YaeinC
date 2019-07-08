const INCREMENT = 'counter/INCREMENT';
const INDEXING = 'counter/INDEXING';

export const increment = () => ({ type: INCREMENT});
export const indexing = idx => ({ type: INDEXING, idx })

const initialState = {
  number: 0,
  idx: 0
}

export default function counter(state = initialState, action) {
  switch (action.type) {
    case INCREMENT:
      return {
        ...state,
        number: state.number + 1
      }
    case INDEXING:
      return {
        ...state,
        idx: action.idx
      }
      default:
        return state;
  }
}