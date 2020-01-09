import React from 'react';
import { Home, Youth, Admin, Main }from './pages';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

const Root = () => {
  return (
    <div>
      <h3 className="title"><a href="/">Yaein Church</a></h3>
      <div className="container">
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={Main} />
            <Route exact path="/admin" component={Admin} />
            <Route path="/admin/:attached/youth_m" component={Youth} />
            <Route path="/admin/:attached/youth_w" component={Youth} />
            <Route path="/admin/:attached/:name" component={Home} />
            <Route exact path="/holy" component={Home} />
            <Route exact path="/bethel" component={Home} />
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