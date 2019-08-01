import React from 'react';
import { Link, Route } from 'react-router-dom';

const Posts = ({ match }) => {
  return (
    <div>
      <h3>포스트 목록</h3>
      <ul>
        <li><Link to={`${match.url}/1`}>포스트 #1</Link></li>
        <li><Link to={`${match.url}/2`}>포스트 #2</Link></li>
        <li><Link to={`${match.url}/3`}>포스트 #3</Link></li>
      </ul>
    </div>
  )
}

export default Posts;