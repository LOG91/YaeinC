import React from 'react';
import CellTable from '../components/CellTable/CellTable';

const Home = ({ match }) => {
  console.log(match);
  return (
    <div>
        <CellTable current={match.path} />
    </div>
  )
}

export default Home;