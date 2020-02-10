const INIT_MEMBER_DATA = 'inserted/INIT_MEMBER_DATA';
const INSERT_MEMBER_DATA = 'inserted/INSERT_MEMBER_DATA';
const INSERT_CELL_MEMBER = 'inserted/INSERT_CELL_MEMBER';
const REMOVE_CELL_MEMBER = 'inserted/REMOVE_CELL_MEMBER';

export const initMemberData = () => ({ type: INIT_MEMBER_DATA });
export const insertMemberData = (left, value) => ({ type: INSERT_MEMBER_DATA, left, value });
export const insertCellMember = (left, right, idx) => ({ type: INSERT_CELL_MEMBER, left, right, idx });
export const removeCellMember = (idx) => ({ type: REMOVE_CELL_MEMBER, idx });

const initialState = {
  insertedMember: {
    name: '',
    age: '',
    gender: '',
    section: '',
    cellName: '',
    cellNameKr: '',
    members: []
  },
}

export default function inserted(state = initialState, action) {
  switch (action.type) {
    case INIT_MEMBER_DATA:
      return {
        ...state,
        insertedMember: {
          name: '',
          age: '',
          gender: '',
          section: '',
          cellName: '',
          cellNameKr: '',
          members: []
        }
      }
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
            { ...state.insertedMember.members[action.idx], [action.left]: action.right },
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
