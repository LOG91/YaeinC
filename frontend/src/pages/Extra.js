import React from 'react';
import queryString from 'query-string';

const Extra = ({ location, match }) => {
  const query = queryString.parse(location.search);
  const { color } = query;

  return (
    <div>
    <h2 style={{ color }}>Hello Yaein {match.params.name}</h2>
    <img src="https://post-phinf.pstatic.net/MjAxODAxMzBfMjI1/MDAxNTE3MjY5MzA3NTgz.V6faZ0lf5APcXPXCLchR5XUHOdzz5MQRNOA5Y7dL-iog.COU5qG5ACVgPJNgV3PpXr-oVVmpCxqbrYSzaRDtbnoYg.JPEG/2.jpg?type=w1200"></img>
    </div>
  )
}

export default Extra;