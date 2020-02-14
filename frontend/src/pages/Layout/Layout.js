import React from 'react';
import { withRouter } from 'react-router-dom';

const Layout = (props) => {
  const { children, Footer, Header } = props;
  console.log(location.pathname);
  return (
    <>
      <Header />
      <div className="main-container">
        {children}
      </div>
      <Footer />
    </>
  )
}


export default withRouter(Layout);