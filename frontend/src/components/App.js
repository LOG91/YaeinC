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

      // this.callListApi().then(res => this.setState({ response: res }));
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
    
    // this.setState({ response: body });
  };

  render() {
    return (
      <BrowserRouter>
        <Root />
        <p>{this.state.response}</p>
        <form onSubmit={this.handleSubmit}>
          <p>
            <strong>Post to Server:</strong>
          </p>
          <input
            type="text"
            value={this.state.post}
            onChange={e => this.setState({ post: e.target.value })}
          />
          <button type="submit">Submit</button>
        </form>
      </BrowserRouter>
    )
  }
}

export default App;