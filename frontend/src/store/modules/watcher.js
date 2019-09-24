const INDEXING = 'watcher/INDEXING';
const CHANGE_CURRENT_SECTION = 'watcher/CHANGE_CURRENT_SECTION';

export const indexing = idx => ({ type: INDEXING, idx });
export const changeCurrentSection = (section, enName) => ({ type: CHANGE_CURRENT_SECTION, section, enName });

const initialState = {
  idx: '',
  insertedMember: {
    name: '',
    age: '',
    gender: '',
    section: '',
    cellName: '',
    cellNameKr: '',
    members: []
  },
  currentSection: []
}

export default function watcher(state = initialState, action) {
  switch (action.type) {
    case INDEXING:
      return {
        ...state,
        idx: action.idx
      }
    case CHANGE_CURRENT_SECTION:
      return {
        ...state,
        currentSection: action.section
      }
    default:
      return state;
  }
}