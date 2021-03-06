import update from 'immutability-helper';

const CHANGE_CURRENT_INFO = 'checker/CHANGE_CURRENT_INFO';
const DND_CHANGE = 'checker/DND_CHANGE';
const INSERT_NETWORKCELL = 'checker/INSERT_NETWORKCELL';

const CHANGE_LEADER_NAME = 'checker/CHANGE_LEADER_NAME';
const CHANGE_MEMBER_NAME = 'checker/CHANGE_MEMBER_NAME';
const REMOVE_LEADER = 'checker/REMOVE_READER';
const REMOVE_MEMBER = 'checker/REMOVE_MEMBER';
const CHECK_WORSHIP = 'checker/CHECK_WORSHIP';
const CHECK_MEMBER_WORSHIP = 'checker/CHECK_MEMBER_WORSHIP';
const COUNT_CONTENT = 'checker/COUNT_CONTENT';
const CHECK_YOUTH = 'checker/CHECK_YOUTH';
const CHECK_MEMBER_YOUTH = 'checker/CHECK_MEMBER_YOUTH';
export const CHANGE_CHURCH_NAME = 'checker/CHANGE_CHURCH_NAME';

const INIT_MEMBER_DATA = 'checker/INIT_MEMBER_DATA';
const INSERT_MEMBER_DATA = 'checker/INSERT_MEMBER_DATA';
const INSERT_CELL_MEMBER = 'checker/INSERT_CELL_MEMBER';
const REMOVE_CELL_MEMBER = 'checker/REMOVE_CELL_MEMBER';

const SEQUENCE_CHURCH = 'checker/SEQUENCE_CHURCH';
const REMOVE_CHURCH = 'checker/REMOVE_CHURCH';
const REMOVE_SHEET = 'checker/REMOVE_SHEET';
const SEQUENCE_SHEET = 'checker/SEQUENCE_SHEET';

export const changeCurrentInfo = (left, right) => ({ type: CHANGE_CURRENT_INFO, left, right });
export const dndChange = (dragIndex, hoverIndex) => ({ type: DND_CHANGE, dragIndex, hoverIndex });
export const insertNetworkCell = (addedNetworkCell) => ({ type: INSERT_NETWORKCELL, addedNetworkCell });

export const changeLeaderName = (sectionIdx, leaderIdx, changedName) => ({ type: CHANGE_LEADER_NAME, sectionIdx, leaderIdx, changedName });
export const changeMemberName = (sectionIdx, leaderIdx, memberIdx, changedName) => ({ type: CHANGE_MEMBER_NAME, sectionIdx, leaderIdx, memberIdx, changedName });
export const removeLeader = (sectionIdx, leaderIdx) => ({ type: REMOVE_LEADER, sectionIdx, leaderIdx });
export const removeMember = (sectionIdx, leaderIdx, memberIdx) => ({ type: REMOVE_MEMBER, sectionIdx, leaderIdx, memberIdx });
export const checkWorship = (id, sectionIdx, left) => ({ type: CHECK_WORSHIP, id, sectionIdx, left });
export const checkMemberWorship = (leaderId, id, sec, sectionIdx, left) => ({ type: CHECK_MEMBER_WORSHIP, leaderId, id, sec, sectionIdx, left });
export const countContent = (id, sectionIdx, left, count) => ({ type: COUNT_CONTENT, id, sectionIdx, left, count });
export const checkYouth = (sectionIdx, leaderIdx, leaderId, date) => ({ type: CHECK_YOUTH, leaderId, sectionIdx, leaderIdx, date });
export const checkMemberYouth = ({ sectionIdx, leaderIdx, leaderId, date, memberIdx }) => ({ type: CHECK_MEMBER_YOUTH, leaderId, sectionIdx, leaderIdx, date, memberIdx });

export const initMemberData = () => ({ type: INIT_MEMBER_DATA });
export const insertMemberData = (left, value) => ({ type: INSERT_MEMBER_DATA, left, value });
export const insertCellMember = (left, right, idx) => ({ type: INSERT_CELL_MEMBER, left, right, idx });
export const removeCellMember = (idx) => ({ type: REMOVE_CELL_MEMBER, idx });

export const sequenceChurch = (idx, seq) => ({ type: SEQUENCE_CHURCH, idx, seq });
export const removeChurch = (idx) => ({ type: REMOVE_CHURCH, idx });
export const removeSheet = (idx) => ({ type: REMOVE_SHEET, idx });
export const sequenceSheet = (idx, seq) => ({ type: SEQUENCE_SHEET, idx, seq });

const initialState = {
  attached: '',
  church: '',
  section: '',
  sheets: [],
  currentSheetInfo: null,
  networkCells: [],
  churches: [],
  currentSection: [],
  currentModal: null,
  modalOpend: null,
  authenticated: false
};

export default function checker(state = initialState, action) {
  switch (action.type) {
    case CHANGE_CURRENT_INFO:
      return {
        ...state,
        [action.left]: action.right
      };

    case DND_CHANGE:
      return {
        ...state,
        currentSection:
          update(state.currentSection, {
            $splice: [
              [action.dragIndex, 1],
              [action.hoverIndex, 0, state.currentSection[action.dragIndex]],
            ],
          })
      };
    case INSERT_NETWORKCELL:
      return {
        ...state,
        networkCells: [...state.networkCells, action.addedNetworkCell]
      };
    case CHANGE_LEADER_NAME:
      return {
        ...state,
        currentSection: [...state.currentSection.slice(0, action.sectionIdx),
        {
          ...state.currentSection[action.sectionIdx],
          leaders: [...state.currentSection[action.sectionIdx].leaders.slice(0, action.leaderIdx),
          { ...state.currentSection[action.sectionIdx].leaders[action.leaderIdx], name: action.changedName },
          ...state.currentSection[action.sectionIdx].leaders.slice(action.leaderIdx + 1, state.currentSection[action.sectionIdx].length)
          ]
        },
        ...state.currentSection.slice(action.sectionIdx + 1, state.currentSection.length)
        ]
      };
    case CHANGE_MEMBER_NAME:
      return {
        ...state,
        currentSection: [
          ...state.currentSection.slice(0, action.sectionIdx),
          {
            ...state.currentSection[action.sectionIdx],
            leaders: [
              ...state.currentSection[action.sectionIdx].leaders.slice(0, action.leaderIdx),
              {
                ...state.currentSection[action.sectionIdx].leaders[action.leaderIdx],
                members: [
                  ...state.currentSection[action.sectionIdx].leaders[action.leaderIdx].members.slice(0, action.memberIdx),
                  { ...state.currentSection[action.sectionIdx].leaders[action.leaderIdx].members[action.memberIdx], name: action.changedName },
                  ...state.currentSection[action.sectionIdx].leaders[action.leaderIdx].members.slice(action.memberIdx + 1, state.currentSection[action.sectionIdx].leaders[action.leaderIdx].members.length)
                ]
              },
              ...state.currentSection[action.sectionIdx].leaders.slice(action.leaderIdx + 1, state.currentSection[action.sectionIdx].length)
            ]
          },
          ...state.currentSection.slice(action.sectionIdx + 1, state.currentSection.length)
        ]
      };
    case REMOVE_LEADER:
      return {
        ...state,
        currentSection: [...state.currentSection.slice(0, action.sectionIdx),
        {
          ...state.currentSection[action.sectionIdx],
          leaders: [...state.currentSection[action.sectionIdx].leaders.slice(0, action.leaderIdx),
          ...state.currentSection[action.sectionIdx].leaders.slice(action.leaderIdx + 1, state.currentSection[action.sectionIdx].length)
          ],
        },
        ...state.currentSection.slice(action.sectionIdx + 1, state.currentSection.length)
        ]
      };
    case REMOVE_MEMBER:
      return {
        ...state,
        currentSection: [...state.currentSection.slice(0, action.sectionIdx),
        {
          ...state.currentSection[action.sectionIdx],
          leaders:
            [...state.currentSection[action.sectionIdx].leaders.slice(0, action.leaderIdx),
            {
              ...state.currentSection[action.sectionIdx].leaders[action.leaderIdx],
              members: state.currentSection[action.sectionIdx].leaders[action.leaderIdx].members.filter((val, idx) => idx !== action.memberIdx)
            },
            ...state.currentSection[action.sectionIdx].leaders.slice(action.leaderIdx + 1, state.currentSection[action.sectionIdx].length)
            ],
        },
        ...state.currentSection.slice(action.sectionIdx + 1, state.currentSection.length)
        ]
      };
    case CHECK_WORSHIP:
      return {
        ...state,
        currentSection: [
          ...state.currentSection.slice(0, action.sectionIdx),
          {
            ...state.currentSection[action.sectionIdx],
            leaders: state.currentSection[action.sectionIdx].leaders.map(member => {
              if (member._id === action.id) {
                return { ...member, [action.left]: !member[action.left] };
              }
              return member;
            })
          },
          ...state.currentSection.slice(action.sectionIdx + 1, state.currentSection.length)
        ],
      };
    case CHECK_MEMBER_WORSHIP:
      return {
        ...state,
        currentSection: [
          ...state.currentSection.slice(0, action.sectionIdx),
          {
            ...state.currentSection[action.sectionIdx], leaders: state.currentSection[action.sectionIdx].leaders.map(member => {
              if (member._id === action.leaderId) {
                return {
                  ...member,
                  members: [...member.members.slice(0, action.sec),
                  { ...member.members[action.sec], [action.left]: !member.members[action.sec][action.left] },
                  ...member.members.slice(action.sec + 1, member.members.length)]
                };
              }
              return member;
            }),
          },
          ...state.currentSection.slice(action.sectionIdx + 1, state.currentSection.length)
        ],
      };
    case COUNT_CONTENT:
      return {
        ...state,
        currentSection: [
          ...state.currentSection.slice(0, action.sectionIdx),
          {
            ...state.currentSection[action.sectionIdx],
            leaders: state.currentSection[action.sectionIdx].leaders.map(member => {
              if (member._id === action.id) {
                return { ...member, [action.left]: action.count };
              }
              return member;
            }),
          },
          ...state.currentSection.slice(action.sectionIdx + 1, state.currentSection.length)
        ],
      };
    case CHECK_YOUTH:
      return {
        ...state,
        currentSection: [
          ...state.currentSection.slice(0, action.sectionIdx),
          {
            ...state.currentSection[action.sectionIdx],
            leaders: state.currentSection[action.sectionIdx].leaders.map(leader => {
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
                };
              }
              return leader;
            }),
          },
          ...state.currentSection.slice(action.sectionIdx + 1, state.currentSection.length)
        ]
      };
    case CHECK_MEMBER_YOUTH:
      return {
        ...state,
        currentSection: [
          ...state.currentSection.slice(0, action.sectionIdx),
          {
            ...state.currentSection[action.sectionIdx],
            leaders:
              [
                ...state.currentSection[action.sectionIdx].leaders.slice(0, action.leaderIdx),
                {
                  ...state.currentSection[action.sectionIdx].leaders[action.leaderIdx],
                  members: [
                    ...state.currentSection[action.sectionIdx].leaders[action.leaderIdx].members.slice(0, action.memberIdx),
                    {
                      ...state.currentSection[action.sectionIdx].leaders[action.leaderIdx].members[action.memberIdx],
                      youth: {
                        ...state.currentSection[action.sectionIdx].leaders[action.leaderIdx].members[action.memberIdx].youth,
                        att: {
                          ...state.currentSection[action.sectionIdx].leaders[action.leaderIdx].members[action.memberIdx].youth.att,
                          [action.date]: !state.currentSection[action.sectionIdx].leaders[action.leaderIdx].members[action.memberIdx].youth.att[action.date]
                        }
                      }
                    },
                    ...state.currentSection[action.sectionIdx].leaders[action.leaderIdx].members.slice(action.memberIdx + 1, state.currentSection[action.sectionIdx].leaders[action.leaderIdx].members.length)
                  ]
                },
                ...state.currentSection[action.sectionIdx].leaders.slice(action.leaderIdx + 1, state.currentSection[action.sectionIdx].length)
              ],
          },
          ...state.currentSection.slice(action.sectionIdx + 1, state.currentSection.length)
        ]
      };
    //////////////////////
    case CHANGE_CHURCH_NAME:
      return {
        ...state,
        churches: [
          ...state.churches.slice(0, action.idx),
          { ...state.churches[action.idx], name: action.name },
          ...state.churches.slice(action.idx + 1, state.churches.length),
        ]
      };
    ////////////
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
      };
    case INSERT_MEMBER_DATA:
      return {
        ...state,
        insertedMember: {
          ...state.insertedMember,
          [action.left]: action.value
        }
      };
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
      };
    case REMOVE_CELL_MEMBER:
      return {
        ...state,
        insertedMember: {
          ...state.insertedMember,
          members: state.insertedMember.members.filter((v, idx) => idx !== action.idx)
        }
      };

    case SEQUENCE_CHURCH:
      return {
        ...state,
        churches: [
          ...state.churches.slice(0, action.idx),
          { ...state.churches[action.idx], seq: action.seq },
          ...state.churches.slice(action.idx + 1, state.churches.length)
        ]
      };
    case REMOVE_CHURCH:
      return {
        ...state,
        churches: [
          ...state.churches.slice(0, action.idx),
          ...state.churches.slice(action.idx + 1, state.churches.length)
        ]
      };
    case REMOVE_SHEET:
      return {
        ...state,
        sheets: [
          ...state.sheets.slice(0, action.idx),
          ...state.sheets.slice(action.idx + 1, state.sheets.length)
        ]
      };
    case SEQUENCE_SHEET:
      return {
        ...state,
        sheets: [
          ...state.sheets.slice(0, action.idx),
          { ...state.sheets[action.idx], seq: action.seq },
          ...state.sheets.slice(action.idx + 1, state.sheets.length)
        ]
      };
    default:
      return state;
  }
}