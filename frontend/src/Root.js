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
          <Route path="/israel_1" component={Home} />
          <Route path="/israel_2" component={Home} />
          <Route path="/arab_1" component={Home} />
          <Route path="/arab_2" component={Home} />
          <Route path="/turkey" component={Home} />
          <Route path="/russia" component={Home} />
          <Route path="/youth_m" component={Youth} />
          <Route path="/youth_w" component={Youth} />
          <Route path="/admin" component={Home} />
          <Route path="/jjp" component={Extra} />
        </BrowserRouter>
      </div>
    </div>
  )
}

export default Root;