import React, { Component } from 'react';
import Root from '../Root';
// import { changeCurrentSection, indexing } from '../store/modules/checker';
// import { connect } from 'react-redux';


class App extends Component {
  
  // handleSubmit = async e => {
  //   e.preventDefault();
  //   const response = await fetch('/api/world', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({ post: this.state.post }),
  //   });
    
  // };

  render() {
    return (
        <Root />
    )
  }
}

// const mapStateToProps = state => ({
//   insertedMember: state.insertedMember
// })

// const mapDispatchToProps = dispatch => ({
//   indexing: idx => dispatch(indexing(idx)),
//   changeCurrentSection: section => dispatch(changeCurrentSection(section))
// })

export default App;
// export default connect(mapStateToProps, mapDispatchToProps)(App);