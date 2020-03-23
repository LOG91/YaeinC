import React, { useEffect, memo } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import { Layout } from '../pages/Layout';
import { Footer } from '../components/Footer';
import { AdminHeader } from '../components/Header';
import { Home } from '../pages';
import { ChurchList } from '../components/ChurchList';
import { MemberList } from '../components/MemberList';


const AdminMain = (props) => {
  console.log('어드민메인');
  return (
    <>
      <BrowserRouter>
        <Layout Header={AdminHeader} Footer={Footer}>
          <div className="main-container">
            <Switch>
              <Route exact path="/admin" component={ChurchList} />
              <Route exact path="/admin/members" component={MemberList}/>
              <Route exact path="/admin/:attached" component={Home} />
              <Route path="/admin/:attached/:name" component={Home} />
            </Switch>
          </div>
        </Layout>
      </BrowserRouter>
    </>
  );
};


export default AdminMain;