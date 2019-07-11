import members from '../../member';

const INCREMENT = 'counter/INCREMENT';
const INDEXING = 'counter/INDEXING';
const CHECK = 'counter/CHECK';

export const increment = () => ({ type: INCREMENT});
export const indexing = idx => ({ type: INDEXING, idx });
export const check = (high, low, checkType, currentCellName) => ({ type: CHECK, high, low, checkType, currentCellName });

const initialState = {
  number: 0,
  idx: 0,
  members
}
// { name: '송준민', age: 29, cc: false, mc: false, yc: true, members: [], clsName: 'i2', cellName: '이스라엘(가)'}
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
      default:
        return state;
  }
}