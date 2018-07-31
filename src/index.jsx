import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, hashHistory, IndexRoute, Link} from 'react-router';
import App from './components/App';
import Stage1 from './components/Stage1';

const AppSystem = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/littleAntNoteSystem/AppSystem').default)
    }, 'AppSystem')
};

//文章列表
const articleList = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/article/js/articleList').default)
    }, 'AppSystem')
};

//文章详情
const articleDetail = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/article/js/articleDetail').default)
    }, 'AppSystem')
}

const LoginScanner = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/LoginScanner').default)
    }, 'LoginScanner')
};

const Login = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/littleAntNoteSystem/Login').default)
    }, 'Login')
};

import './index.less';

class Index extends React.Component {

    render() {
        return (
            <div className="body">
                <h1>Stages list</h1>
                <ul role="nav">
                    <li><Link to="/s1">ListView + Carousel</Link></li>
                    <li><Link to="/AppSystem"
                    style={{fontSize: '24px'}}>AppSystem</Link></li>
                    <li><Link to="/articleList?userId=1"
                              style={{fontSize: '24px'}}>文章列表</Link></li>
                    <li><Link to="/articleDetail"
                              style={{fontSize: '24px'}}>文章详情</Link></li>
                    <li><Link to="/LoginScanner"
                    style={{fontSize: '24px'}}>扫一扫登录中间页LoginScanner</Link></li>
                    <li><Link to="/Login"
                    style={{fontSize: '24px'}}>二维码登录页</Link></li>
                </ul>
            </div>
        );
    }
}

ReactDOM.render(
    <Router history={hashHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={Index}/>
            <Route path="s1" component={Stage1}/>
            <Route path="AppSystem" getComponent={AppSystem}/>
            <Route path="articleList" getComponent={articleList}/>
            <Route path="articleDetail" getComponent={articleDetail}/>
            <Route path="LoginScanner" getComponent={LoginScanner}/>
            <Route path="Login" getComponent={Login}/>
        </Route>
    </Router>
    ,
    document.getElementById('example'));

