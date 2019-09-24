import React from 'react';
import './style.scss';
import { Home, Extra, Youth, Admin } from './pages';
import { BrowserRouter, Route } from 'react-router-dom';

const Root = () => {
  return (
    <div>
      <h3 className="title">Yaein Church</h3>
      <div className="container">
        <BrowserRouter>
          <Route exact path="/" component={Home} />
          <Route path="/cell/:name" component={Home} />
          <Route path="/youth_m" component={Youth} />
          <Route path="/youth_w" component={Youth} />
          <Route path="/admin" component={Admin} />
          <Route path="/jjp" component={Extra} />
        </BrowserRouter>
      </div>
    </div>
  )
}

export default Root;