import React, { useState } from 'react';
import './SignInForm.scss';
import { Redirect } from 'react-router-dom'

const SignInForm = ({ authenticated, signin, location }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleClick = () => {
    fetch('/api/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: email, pwd: password })
    }).then(res => res.json())
      .then(res => {
        debugger;
        console.log('res', res)
      });
    // try {
    //   signin({ email, password });
    // } catch (e) {
    //   alert('Failed to signin');
    //   setEmail('');
    //   setPassword('');
    // }
    // await fetch('/api/leader', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(insertedMember),
    // }).then(res => {
    //   onToggleModal({});
    //   return res.json();
    // }).then(async leader => {
    //   if (!isAddNetwork) {
    //     window.location.href = window.location.href;
    //   }
    // });
  };

  // const { from } = location.state || { from: { pathname: "/" } };
  // if (authenticated) return <Redirect to={from} />;

  return (
    <form className="signin-box" onSubmit={handleClick}>
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
      <button type="submit">로그인</button>
    </form>
  );
}

export default SignInForm;