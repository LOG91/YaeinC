import React, { useEffect } from 'react';
import { BrowserRouter, Switch, Route, withRouter } from 'react-router-dom';

import { Layout } from '../pages/Layout';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { Home } from '../pages';
import { ChurchList } from '../components/ChurchList';


const Main = () => {
  
  return (
    <>
      <BrowserRouter>
        <Layout Header={Header} Footer={Footer}>
          <div className="main-container">
            <Switch>
              <Route exact path="/" component={ChurchList} />
              <Route exact path="/:attached" component={Home} />
              <Route path="/:attached/:name" component={Home} />
            </Switch>
          </div>
        </Layout>
      </BrowserRouter>
    </>
  );
};


export default Main;