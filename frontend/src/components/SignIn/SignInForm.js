import React, { useState, Component } from 'react';
import { connect } from 'react-redux';
import './SignInForm.scss';
import { changeCurrentInfo } from '../../store/modules/checker';
import { loginRequest } from '../../store/modules/signin';

class SignInForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      password: ''
    };
  }

  handleClick = e => {
    const { authenticated, signin, location, changeCurrentInfo, history, loginRequest, status, login } = this.props;
    e.preventDefault();
    fetch('/api/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, pwd: password })
    }).then(res => res.json())
      .then(res => {
        if (res.ok) {
          changeCurrentInfo('authenticated', true);
          history.push('/admin');
        }
      });
  };
  handleKeyPress = (e) => {
    if (e.charCode == 13) {
      this.handleLogin(e);
    }
  }

  handleLogin = e => {
    const { authenticated, signin, location, changeCurrentInfo, history, loginRequest, status, login } = this.props;
    e.preventDefault();
    return loginRequest(this.state.id, this.state.password).then(
      () => {
        if (this.props.status === 'SUCCESS') {

          let loginData = {
            isLoggedIn: true,
            username: this.state.id
          };

          document.cookie = 'key=' + btoa(JSON.stringify(loginData));
          history.push('/admin');
          return true;
        } else {
          console.log('로그인 실패');
          return false;
        }
      }
    )
  }

  render() {
    return (
      <form className="signin-box" onSubmit={this.handleLogin}>
        <h1 className="signin-box__heading">로그인</h1>
        <div>아이디: yaein<br />비번: 1234</div>
        <input
          value={this.state.id}
          onChange={({ target: { value } }) => this.setState({ id: value })}
          type="text"
          placeholder="id"
        />
        <input
          value={this.state.password}
          onChange={({ target: { value } }) => this.setState({ password: value })}
          type="password"
          placeholder="password"
        />
        <button type="submit">로그인</button>
      </form>
    );
  }
};

const mapStateToProps = state => ({
  authenticated: state.checker.authenticated,
  status: state.signin.login.status,
});

const mapDispatchToProps = dispatch => ({
  changeCurrentInfo: (left, right) => dispatch(changeCurrentInfo(left, right)),
  loginRequest: (id, pw) => dispatch(loginRequest(id, pw))
});

export default connect(mapStateToProps, mapDispatchToProps)(SignInForm);