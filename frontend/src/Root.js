import React, { Fragment } from 'react';
import './style.scss';
import { Home, Extra, Posts, Admin } from './pages';
import { Route } from 'react-router-dom';
import Tab from './components/Tab';

const Root = () => {
  return (
    <div>
      <h3 className="title">Yaein Church</h3>
      <div className="container">
        <Tab />
        <Route exact path="/" component={Home} />
        <Route path="/israel_1" component={Home} />
        <Route path="/israel_2" component={Home} />
        <Route path="/arab_1" component={Home} />
        <Route path="/arab_2" component={Home} />
        <Route path="/turkey" component={Home} />
        <Route path="/russia" component={Home} />
        <Route path="/posts" component={Posts} />
        <Route path="/admin" component={Admin} />
      </div>
    </div>
  )
}

export default Root;