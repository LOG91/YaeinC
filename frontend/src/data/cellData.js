const mapCellName = {
  israel_1: ['이스라엘(가)', '이스라엘', '이스라엘(다)'],
  arab_1: ['시리아(가)', '시리아(나)', 'syria'],
  arab_2: ['jordan', 'egypt'],
  russia: ['russia_m', 'russia_w'],
  turkey: ['antioch', 'turkey', 'istanbul'],
};

const section = [
  'israel', 'arab', 'asia'
];

const cellName = []



export const cellData = [
  { path: 'israel_1', en_name: 'israel_1', cells: mapCellName['israel_1'], name: '이스라엘군1', to: '/israel_1', activeStyle: true, clsName: 'index'},
  { path: 'arab_1', en_name: 'arab_1', cells: mapCellName['arab_1'], name: '아랍군1', to: '/arab_1', activeStyle: true, clsName: 'index'},
  { path: 'arab_2', en_name: 'arab_2', cells: mapCellName['arab_2'], name: '아랍군2', to: '/arab_2', activeStyle: true, clsName: 'index'},
  { path: 'russia', en_name: 'russia', cells: mapCellName['russia'], name: '아시아군', to: '/russia', activeStyle: true, clsName: 'index'},
  { path: 'youth_m', en_name: 'youth_m', name: '청년예배(남)', cells: [], to: '/youth_man', activeStyle: true, clsName: 'index'},
  { path: 'youth_w', en_name: 'youth_w', name: '청년예배(여)', cells: [], to: '/posts', activeStyle: true, clsName: 'index'}
];