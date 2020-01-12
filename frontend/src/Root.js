import React from 'react';
import { Home, Youth, Admin, Main }from './pages';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

const Root = () => {
  return (
    <div>
      <div className="container">
      <h3 className="title"><a href="/">Yaein 출석부</a></h3>
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={Main} />
            <Route exact path="/admin" component={Main} />
            <Route path="/admin/:attached/youth_m" component={Youth} />
            <Route path="/admin/:attached/youth_w" component={Youth} />
            <Route path="/admin/:attached/:name" component={Home} />
            <Route exact path="/:attached" component={Home} />
            <Route exact path="/admin/:attached" component={Home} />
            <Route path="/:attached/youth_m" component={Youth} />
            <Route path="/:attached/youth_w" component={Youth} />
            <Route path="/:attached/:name" component={Home} />
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