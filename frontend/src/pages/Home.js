import React from 'react';
import { Link } from 'react-router-dom';
import CellTable from '../components/CellTable';
import Tab from '../components/Tab';

const Home = ({ match }) => {
  return (
    <div>
        <CellTable to={match.path} />
    </div>
  )
}

export default Home;