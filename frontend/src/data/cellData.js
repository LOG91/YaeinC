const mapCellName = {
  israel_1: ['israel_ga', 'israel_na', 'israel_da'],
  israel_2: ['jerusalem_ga', 'palestine', 'israel', 'jerusalem'],
  arab_1: ['syria_ga', 'syria_na', 'syria'],
  arab_2: ['jordan', 'egypt'],
  russia: ['russia_m', 'russia_w'],
  turkey: ['antioch', 'turkey', 'istanbul'],
}

export const cellData = [
  { en_name: 'israel_1', cells: mapCellName['israel_1'], name: '이스라엘군1', to: '/israel_1', activeStyle: true, clsName: 'index'},
  { en_name: 'israel_2', cells: mapCellName['israel_2'], name: '이스라엘군2', to: '/israel_2', activeStyle: true, clsName: 'index'},
  { en_name: 'arab_1', cells: mapCellName['arab_1'], name: '아랍군1', to: '/arab_1', activeStyle: true, clsName: 'index'},
  { en_name: 'arab_2', cells: mapCellName['arab_2'], name: '아랍군2', to: '/arab_2', activeStyle: true, clsName: 'index'},
  { en_name: 'turkey', cells: mapCellName['turkey'], name: '터키군', to: '/turkey', activeStyle: true, clsName: 'index'},
  { en_name: 'russia', cells: mapCellName['russia'], name: '연해주', to: '/russia', activeStyle: true, clsName: 'index'},
  { en_name: 'youth_m', name: '청년예배(남)', cells: [], to: '/youth_man', activeStyle: true, clsName: 'index'},
  { en_name: 'youth_w', name: '청년예배(여)', cells: [], to: '/posts', activeStyle: true, clsName: 'index'}
];