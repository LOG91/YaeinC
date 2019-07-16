import React from 'react';
import './style.scss';
import { Home, Extra, Posts, Admin } from './pages';
import { Route } from 'react-router-dom';
import Tab from './components/Tab/Tab';

const Root = () => {
  return (
    <div>
      <h3 className="title">Yaein Church</h3>
      <div className="container">
        <Tab />
        <Route exact path="/" component={Home} />
        <Route path="/admin" component={Admin} />
        <Route path="/jjp" component={Extra} />
      </div>
    </div>
  )
}

export default Root;