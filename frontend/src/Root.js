import React from 'react';
import { Home, Youth, Admin, Main } from './pages';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCross } from '@fortawesome/free-solid-svg-icons';

const Root = () => {
  return (
    <BrowserRouter>
      <Switch>
        {/* <Route exact path="/admin" component={Home}></Route> */}
        <div className="main-container">
          <nav className="nav-box">
            <h1 className="logo-box">
              <a href="/"><div className="logo-box__desc">Yaein Church</div></a><FontAwesomeIcon className="logo-box__logo" icon={faCross} />
            </h1>
            <ul className="nav-box__list">
              <li className="navbox__item">헬로</li>
              <li className="navbox__item">월드</li>
              <li className="navbox__item">석기</li>
            </ul>
            <div className="logo-box">
              <img href="#" src="https://yt3.ggpht.com/a/AGF-l7-5PXRbQItsYW-hUDO1d7S2H6YSmlSYD7C47Q=s288-c-k-c0xffffffff-no-rj-mo" className="logo-box__image" />
            </div>
          </nav>
          <div>
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
      </Switch>
    </BrowserRouter>
  )
}

export default Root;