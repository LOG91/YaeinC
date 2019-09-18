import React from 'react';
import CellTable from '../components/CellTable/CellTable';
import Tab from '../components/Tab/Tab';

const Home = ({ match }) => {
  console.log(match.params.name, 'match');
  return (
    <div className="printArea">
        <Tab isAdmin={match.path === '/admin' ? true : null}/>
        <CellTable current={match.params.name} />
    </div>
  )
}

export default Home;