import React, { useState } from 'react';
import './SignInForm.scss';
import { Redirect } from 'react-router-dom'

const SignInForm = ({ authenticated, signin, location }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleClick = () => {
    try {
      signin({ email, password });
    } catch (e) {
      alert('Failed to signin');
      setEmail('');
      setPassword('');
    }
  };

  const { from } = location.state || { from: { pathname: "/" } };
  if (authenticated) return <Redirect to={from} />;

  return (
    <div className="signin-box">
      <h1 className="signin-box__heading">로그인</h1>
      <div>아이디: yaein<br />비번: 1234</div>
      <input
        value={email}
        onChange={({ target: { value } }) => setEmail(value)}
        type="text"
        placeholder="email"
      />
      <input
        value={password}
        onChange={({ target: { value } }) => setPassword(value)}
        type="password"
        placeholder="password"
      />
      <button onClick={handleClick}>로그인</button>
    </div>
  );
}

export default SignInForm;