import React from 'react';
import { Home, Youth, Admin } from './pages';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

const Root = () => {
  return (
    <div>
      <h3 className="title"><a href="/">Yaein Church</a></h3>
      <div className="container">
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/cell/:attached/:name" component={Home} />
            <Route path="/youth/:attached/youth_m" component={Youth} />
            <Route path="/youth/:attached/youth_w" component={Youth} />
            <Route exact path="/admin" component={Admin} />
            <Route path="/admin/cell/:attached/:name" component={Home} />
            <Route path="/admin/youth/:attached/youth_m" component={Youth} />
            <Route path="/admin/youth/:attached/youth_w" component={Youth} />
            <Route>
              <div>404 Page</div>
            </Route>
          </Switch>
        </BrowserRouter>
      </div>
    </div>
  )
}

export default Root;