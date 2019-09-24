const INSERT_MEMBER_DATA = 'registerer/INSERT_MEMBER_DATA';
const INSERT_CELL_MEMBER = 'registerer/INSERT_CELL_MEMBER';
const REMOVE_CELL_MEMBER = 'registerer/REMOVE_CELL_MEMBER';

export const insertMemberData = (left, value) => ({ type: INSERT_MEMBER_DATA, left, value });
export const insertCellMember = (member, idx) => ({ type: INSERT_CELL_MEMBER, member, idx });
export const removeCellMember = (idx) => ({ type: REMOVE_CELL_MEMBER, idx });

const initialState = {
  // idx: '',
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

export default function registerer(state = initialState, action) {
  switch (action.type) {
    case INSERT_MEMBER_DATA:
      return {
        ...state,
        insertedMember: {
          ...state.insertedMember,
          [action.left]: action.value
        }
      }
    case INSERT_CELL_MEMBER:
      return {
        ...state,
        insertedMember: {
          ...state.insertedMember,
          members:
            [...state.insertedMember.members.slice(0, action.idx),
            action.member,
            ...state.insertedMember.members.slice(action.idx + 1, state.insertedMember.members.length)]
        }
      }
    case REMOVE_CELL_MEMBER:
      return {
        ...state,
        insertedMember: {
          ...state.insertedMember,
          members: state.insertedMember.members.filter((v, idx) => idx !== action.idx)
        }
      }
    default:
      return state;
  }
}