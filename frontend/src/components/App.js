import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Root from '../Root';

class App extends Component {
  state = {
    response: '',
    post: '',
    responseToPost: '',
  };
  
  componentDidMount() {
  }
  

  handleSubmit = async e => {
    e.preventDefault();
    const response = await fetch('/api/world', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ post: this.state.post }),
    });
    const body = await response.text();
    const todos = await fetch('/todos')
                  .then(res => res.json())
                  .then(res => {
                    this.setState({ response: res[4].todo_responsible })
                  });
    
  };

  render() {
    return (
      <BrowserRouter>
        <Root />
      </BrowserRouter>
    )
  }
}

export default App;