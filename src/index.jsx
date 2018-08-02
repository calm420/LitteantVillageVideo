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
    }, 'articleList')
};

//文章详情
const articleDetail = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/article/js/articleDetail').default)
    }, 'articleDetail')
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

const EditorDemo = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/editorDemo/EditorDemo').default)
    }, 'EditorDemo')
};

const uploadMusic = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/uploadMusic/js/uploadMusic').default)
    }, 'uploadMusic')
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
                    <li><Link to="/EditorDemo"
                              style={{fontSize: '24px'}}>editorDemo</Link></li>
                    <li><Link to="/uploadMusic"
                              style={{fontSize: '24px'}}>uploadMusic</Link></li>
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
            <Route path="EditorDemo" getComponent={EditorDemo}/>
            <Route path="uploadMusic" getComponent={uploadMusic}/>
        </Route>
    </Router>
    ,
    document.getElementById('example'));

