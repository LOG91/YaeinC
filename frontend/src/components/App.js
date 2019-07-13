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
    this.callApi()
      .then(res => {
        return this.setState({ response: res[0].name })
      })
      .catch(err => console.log(err));
  }
  
  callApi = async () => {
    const response = await fetch('/todos/api/leaders');
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    
    return body;
  };
  callListApi = async () => {
    const response = await fetch('/todos');
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
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