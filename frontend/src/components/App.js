import React, { Component } from 'react';
import Root from '../Root';


class App extends Component {
  componentDidMount() {
    setTimeout(() => { console.log('This is setTimeout'); }, 0);
  }
  render() {
    return (
      <Root />
    );
  }
}

export default App;