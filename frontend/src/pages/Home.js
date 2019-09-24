import React from 'react';
import { CellTable } from '../components/CellTable';
import Tab from '../components/Tab/Tab';

const Home = ({ match }) => {
  return (
    <div>
      <Tab isAdmin={match.path === '/admin' ? true : null} />
      {match.path !== '/' ?
        <CellTable current={match.params.name} /> : <h2>예인교회 출석부</h2>}
    </div>
  )
}

export default Home;