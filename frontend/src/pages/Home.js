import React from 'react';
import { CellTable } from '../components/CellTable';
import Tab from '../components/Tab/Tab';

const Home = ({ match }) => {
  return (
    <div className="printArea">
        <Tab isAdmin={match.path === '/admin' ? true : null}/>
        <CellTable current={match.params.name} />
    </div>
  )
}

export default Home;