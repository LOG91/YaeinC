import React from 'react';
import { Home, Youth, Admin } from './pages';
import { BrowserRouter, Route } from 'react-router-dom';

const Root = () => {
  return (
    <div>
      <h3 className="title"><a href="/">Yaein Church</a></h3>
      <div className="container">
        <BrowserRouter>
          <Route exact path="/" component={Home} />
          <Route path="/cell/:name" component={Home} />
          <Route path="/youth_m" component={Youth} />
          <Route path="/youth_w" component={Youth} />
          <Route exact path="/admin" component={Admin} />
          <Route path="/admin/cell/:name" component={Home} />
          <Route path="/admin/youth_m" component={Youth} />
          <Route path="/admin/youth_w" component={Youth} />
        </BrowserRouter>
      </div>
    </div>
  )
}

export default Root;