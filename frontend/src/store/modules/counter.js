import members from '../../member';

const INCREMENT = 'counter/INCREMENT';
const INDEXING = 'counter/INDEXING';
const CHECK = 'counter/CHECK';
const INSERT_MEMBER = 'counter/INSERT_MEMBER';
const INSERT_CELL_MEMBER = 'counter/INSERT_CELL_MEMBER';

export const increment = () => ({ type: INCREMENT});
export const indexing = idx => ({ type: INDEXING, idx });
export const check = (high, low, checkType, currentCellName) => ({ type: CHECK, high, low, checkType, currentCellName });
export const insertMember = (left, value) => ({ type: INSERT_MEMBER, left, value });
export const insertCellMember = (member, idx) => ({ type: INSERT_CELL_MEMBER, member, idx });

const initialState = {
  number: 0,
  idx: 0,
  members,
  insertedMember: { members: [""] },
}

export default function counter(state = initialState, action) {
  let checkType = '';
  let currentCell = '';
  let cName = '';
  if(action.type === CHECK){
    checkType = action.checkType;
    currentCell = action.currentCellName;
    cName = state.members[currentCell];
  }
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
    case CHECK:
      return {
        ...state,
        members: {
          ...state.members,
          [currentCell]: [...cName.slice(0, action.high), 
          [...cName[action.high].slice(0, action.low),
            { ...cName[action.high][action.low], [checkType]: !cName[action.high][action.low][checkType] },
          ...cName[action.high].slice(action.low + 1, cName[action.high][action.low].length)
          ],
          ...cName.slice(action.high + 1, cName.length)
        ]
      }
      }
    case INSERT_MEMBER:
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
          members :
            [...state.insertedMember.members.slice(0, action.idx),
            action.member,
            ...state.insertedMember.members.slice(action.idx + 1, state.insertedMember.members.length)]
        }
      }
      default:
        return state;
  }
}