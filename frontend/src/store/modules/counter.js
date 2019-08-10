const INCREMENT = 'counter/INCREMENT';
const INDEXING = 'counter/INDEXING';
const INSERT_MEMBER = 'counter/INSERT_MEMBER';
const INSERT_CELL_MEMBER = 'counter/INSERT_CELL_MEMBER';
const REMOVE_CELL_MEMBER = 'counter/REMOVE_CELL_MEMBER';
const CHANGE_CURRENT_SECTION = 'counter/CHANGE_CURRENT_SECTION';
const CHECK_WORSHIP = 'counter/CHECK_WORSHIP';
const CHECK_MEMBER_WORSHIP = 'counter/CHECK_MEMBER_WORSHIP';
const COUNT_CONTENT = 'counter/COUNT_CONTENT';
const CHECK_YOUTH = 'counter/CHECK_YOUTH';
const CHECK_MEMBER_YOUTH = 'counter/CHECK_MEMBER_YOUTH';

export const increment = () => ({ type: INCREMENT });
export const indexing = idx => ({ type: INDEXING, idx });
export const insertMember = (left, value) => ({ type: INSERT_MEMBER, left, value });
export const insertCellMember = (member, idx) => ({ type: INSERT_CELL_MEMBER, member, idx });
export const removeCellMember = (idx) => ({ type: REMOVE_CELL_MEMBER, idx });
export const chageCurrentSection = (section, enName) => ({ type: CHANGE_CURRENT_SECTION, section, enName });
export const checkWorship = (id, sectionIdx, left) => ({ type: CHECK_WORSHIP, id, sectionIdx, left });
export const checkMemberWorship = (leaderId, id, sec, sectionIdx, left) => ({ type: CHECK_MEMBER_WORSHIP, leaderId, id, sec, sectionIdx, left });
export const countContent = (id, sectionIdx, left, count) => ({ type: COUNT_CONTENT, id, sectionIdx, left, count });
export const checkYouth = (sectionIdx, leaderIdx, leaderId, date) => ({ type: CHECK_YOUTH, leaderId, sectionIdx, leaderIdx, date });
export const checkMemberYouth = ({ sectionIdx, leaderIdx, leaderId, date, memberIdx }) => ({ type: CHECK_MEMBER_YOUTH, leaderId, sectionIdx, leaderIdx, date, memberIdx });

const initialState = {
  number: 0,
  idx: '',
  insertedMember: { name: '', age: '', gender: '', section: '', cellName: '', cellNameKr: '', members: [] },
  currentSection: []
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

    case CHANGE_CURRENT_SECTION:
      return {
        ...state,
        currentSection: action.section
      }

    case CHECK_WORSHIP:
      return {
        ...state,
        currentSection: [
          ...state.currentSection.slice(0, action.sectionIdx),
          state.currentSection[action.sectionIdx].map(member => {
            if (member._id === action.id) {
              return { ...member, [action.left]: !member[action.left] }
            }
            return member;
          }),
          ...state.currentSection.slice(action.sectionIdx + 1, state.currentSection.length)
        ],
      }

    case CHECK_MEMBER_WORSHIP:
      return {
        ...state,
        currentSection: [
          ...state.currentSection.slice(0, action.sectionIdx),
          state.currentSection[action.sectionIdx].map(member => {
            if (member._id === action.leaderId) {
              return {
                ...member,
                members: [...member.members.slice(0, action.sec),
                { ...member.members[action.sec], [action.left]: !member.members[action.sec][action.left] },
                ...member.members.slice(action.sec + 1, member.members.length)]
              }
            }
            return member;
          }),
          ...state.currentSection.slice(action.sectionIdx + 1, state.currentSection.length)
        ],
      }

    case COUNT_CONTENT:
      return {
        ...state,
        currentSection: [
          ...state.currentSection.slice(0, action.sectionIdx),
          state.currentSection[action.sectionIdx].map(member => {
            if (member._id === action.id) {
              return { ...member, [action.left]: action.count }
            }
            return member;
          }),
          ...state.currentSection.slice(action.sectionIdx + 1, state.currentSection.length)
        ],
      }

    case CHECK_YOUTH:
      return {
        ...state,
        currentSection: [
          ...state.currentSection.slice(0, action.sectionIdx),
          state.currentSection[action.sectionIdx].map(leader => {
            if (leader._id === action.leaderId) {
              return {
                ...leader,
                youth: {
                  ...leader.youth,
                  att: {
                    ...leader.youth.att,
                    [action.date]: !leader.youth.att[action.date]
                  }
                }
              }
            }
            return leader;
          }),
          ...state.currentSection.slice(action.sectionIdx + 1, state.currentSection.length)
        ]
      }
    case CHECK_MEMBER_YOUTH:
      return {
        ...state,
        currentSection: [
          ...state.currentSection.slice(0, action.sectionIdx),
          [
            ...state.currentSection[action.sectionIdx].slice(0, action.leaderIdx),
            {
              ...state.currentSection[action.sectionIdx][action.leaderIdx],
              members: [
                ...state.currentSection[action.sectionIdx][action.leaderIdx].members.slice(0, action.memberIdx),
                {
                  ...state.currentSection[action.sectionIdx][action.leaderIdx].members[action.memberIdx],
                  youth: {
                    ...state.currentSection[action.sectionIdx][action.leaderIdx].members[action.memberIdx].youth,
                    att: {
                      ...state.currentSection[action.sectionIdx][action.leaderIdx].members[action.memberIdx].youth.att,
                      [action.date]: !state.currentSection[action.sectionIdx][action.leaderIdx].members[action.memberIdx].youth.att[action.date]
                    }
                  }
                },
                ...state.currentSection[action.sectionIdx][action.leaderIdx].members.slice(action.memberIdx + 1, state.currentSection[action.sectionIdx][action.leaderIdx].members.length)
              ]
            },
            ...state.currentSection[action.sectionIdx].slice(action.leaderIdx + 1, state.currentSection[action.sectionIdx].length)
          ],
          ...state.currentSection.slice(action.sectionIdx + 1, state.currentSection.length)
        ]
      }
    default:
      return state;
  }
}