import React from 'react';

const RegisterForm = () => {
  return (
    <>
      <h1>Register Page</h1>
      <form action="/api/signin/register" method="POST">
        <input type="text" placeholder="ID" id="id" name="user_id" />
        <br />
        <input type="text" placeholder="Password" id="pwd" name="password" />
        <button type="submit">회원가입</button>
      </form>
    </>
  );
};

export default RegisterForm;