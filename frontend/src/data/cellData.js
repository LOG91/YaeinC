const mapCellName = {
  israel_1: ['이스라엘(가)', '이스라엘', '이스라엘(다)'],
  arab_1: ['시리아(가)', '시리아(나)'],
  arab_2: ['요르단', '이집트', '안디옥'],
  asia: ['연해주', '대한민국', '중국', '북한'],
};


export const cellData = [
  { path: 'israel_1', en_name: 'israel_1', cells: mapCellName['israel_1'], name: '이스라엘군1', to: '/israel_1', activeStyle: true, clsName: 'index'},
  { path: 'arab_1', en_name: 'arab_1', cells: mapCellName['arab_1'], name: '아랍군1', to: '/arab_1', activeStyle: true, clsName: 'index'},
  { path: 'arab_2', en_name: 'arab_2', cells: mapCellName['arab_2'], name: '아랍군2', to: '/arab_2', activeStyle: true, clsName: 'index'},
  { path: 'asia', en_name: 'asia', cells: mapCellName['asia'], name: '아시아군', to: '/asia', activeStyle: true, clsName: 'index'},
  { path: 'youth_m', en_name: 'youth_m', name: '청년예배(남)', cells: mapCellName['이스라엘(가)', '연해주', '안디옥'], to: '/youth_man', activeStyle: true, clsName: 'index'},
  { path: 'youth_w', en_name: 'youth_w', name: '청년예배(여)', cells: [], to: '/posts', activeStyle: true, clsName: 'index'}
];