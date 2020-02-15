const users = [
  { email: 'yaein', password: '1234', name: 'Oh' },
  { email: 'lee@test.com', password: '456', name: 'Lee' },
  { email: 'park@test.com', password: '789', name: 'Park' }
]

export const signIn = ({ email, password }) => {
  const user = users.find(user => user.email === email && user.password === password);
  if (user === undefined) throw new Error();
  return user;
}