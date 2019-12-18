import React, { Component } from 'react';
import Root from '../Root';


class App extends Component {
  componentDidMount() {
    document.querySelector('#root').addEventListener('click', (e) => {
      console.log(e.target);
    })
    
  }
  render() {
    return (
      <Root />
    )
  }
}

export default App;