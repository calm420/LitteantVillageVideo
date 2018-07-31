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
        </Route>
    </Router>
    ,
    document.getElementById('example'));

