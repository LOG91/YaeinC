import React from 'react';

const Post = ({ match }) => {
  const liStyle = {
    display: 'flex'
  }
  const diStyle = {
    width: '200px'
  }
  const arr = ['7_10', '7_17', '7_24', '7_31'];
  const mem = [
    { name: 'seokki', obj: { '7_10': true }},
  ]
  const tpl = (arr, mem) => {
      const hh = mem.map(member => {
       return(
        <li style={liStyle}>
          <div>{member.name}</div>
          {arr.map(v => {
            return(<div style={diStyle}>{member.obj[v]? 'true' : 'false'}</div>)    
          })}
        </li>
      )
      });
      return hh;
    }
  return (
    <React.Fragment>
      <ul>
        <li style={liStyle}>
          {tpl(arr, mem)}
        </li>
      </ul>
    </React.Fragment>
  );
};

export default Post;