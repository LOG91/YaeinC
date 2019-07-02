import React from 'react';
import queryString from 'query-string';

const Extra = ({ location, match }) => {
  const query = queryString.parse(location.search);
  const { color } = query;

  return (
    <h2 style={{ color }}>Hello Yaein {match.params.name}</h2>
  )
}

export default Extra;