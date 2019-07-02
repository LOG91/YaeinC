import React, { Fragment } from 'react';
import './style.scss';
import { Home, Extra, Posts } from './pages';
import { Route } from 'react-router-dom';
import Tab from './components/Tab';

const Root = () => {
  return (
    <div>
      <h3 className="title">Yaein Church</h3>
      <div className="container">
        <Tab />
        <Route exact path="/" component={Home} />
        <Route path="/israel/1" component={Home} />
        <Route path="/posts" component={Posts} />
      </div>
    </div>
  )
}

export default Root;