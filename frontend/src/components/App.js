import React, { Component } from 'react';
import Root from '../Root';
import { chageCurrentSection, indexing } from '../store/modules/counter';
import { connect } from 'react-redux';

import { cellData } from '../data/cellData';


class App extends Component {
  
  handleSubmit = async e => {
    e.preventDefault();
    const response = await fetch('/api/world', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ post: this.state.post }),
    });
    
  };

  render() {
    return (
        <Root />
    )
  }
}

const mapStateToProps = state => ({
  insertedMember: state.insertedMember
})

const mapDispatchToProps = dispatch => ({
  indexing: idx => dispatch(indexing(idx)),
  chageCurrentSection: section => dispatch(chageCurrentSection(section))
})

export default connect(mapStateToProps, mapDispatchToProps)(App);