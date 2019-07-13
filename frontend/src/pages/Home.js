import React from 'react';
import CellTable from '../components/CellTable/CellTable';
// import Tab from '../components/Tab';

const Home = ({ match }) => {
  return (
    <div>
        <CellTable to={match.path} />
    </div>
  )
}

export default Home;