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

//我的文章列表
const myArticleList = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/article/js/myArticleList').default)
    }, 'myArticleList')
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




/**
 * 审核列表
 */
const lookThrough = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/lookThrough/js/lookThrough').default)
    }, 'EditorDemo')
};


 /**
  * 未审核详情
  */
 const WaitlookThroughDetail = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/lookThrough/js/WaitlookThroughDetail').default)
    }, 'WaitlookThroughDetail')
};

 /**
  * 已审核详情
  */
 const AlreadylookThroughDetail = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/lookThrough/js/AlreadylookThroughDetail').default)
    }, 'AlreadylookThroughDetail')
 };
 
const uploadMusicList = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/uploadMusic/js/uploadMusicList').default)
    }, 'uploadMusicList')
};

const addUploadMusic = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/uploadMusic/js/addUploadMusic').default)
    }, 'addUploadMusic')
};

const weArrPayment = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/weArrPayment/js/weArrPayment').default)
    }, 'weArrPayment')
};


/**
 *上传视频
 */
const addUploadVideo = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/uploadVideo/js/addUploadVideo').default)
    }, 'addUploadVideo')
};
const uploadvideoList = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/uploadVideo/js/uploadvideoList').default)
    }, 'uploadvideoList')
};

/*
* 我的收藏
* */
const myCollection = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/collection/js/myCollection').default)
    }, 'myCollection')
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
                    <li><Link to="/articleList?userId=3"
                              style={{fontSize: '24px'}}>文章列表</Link></li>
                    <li><Link to="/myArticleList?userId=3"
                              style={{fontSize: '24px'}}>我的文章列表</Link></li>
                    <li><Link to="/LoginScanner"
                              style={{fontSize: '24px'}}>扫一扫登录中间页LoginScanner</Link></li>
                    <li><Link to="/Login"
                              style={{fontSize: '24px'}}>二维码登录页</Link></li>
                    <li><Link to="/EditorDemo"
                              style={{fontSize: '24px'}}>editorDemo</Link></li>
                    <li><Link to="/lookThrough?auditorId=3"
                              style={{fontSize: '24px'}}>审核列表</Link></li>
                    <li><Link to="/uploadMusicList?ident=23836"
                              style={{fontSize: '24px'}}>uploadMusicList</Link></li>
                    <li>
                        <Link
                            to="/weArrPayment?ident=3" style={{fontSize: '24px'}}>充值</Link>
                    </li>
                    <li>
                        <Link
                            to="/uploadvideoList?" style={{fontSize: '24px'}}>上传视频</Link>
                    </li>
                    <li>
                        <Link
                            to="/myCollection?userId=1" style={{fontSize: '24px'}}>我的收藏</Link>
                    </li>
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
            <Route path="lookThrough" getComponent={lookThrough}/>
            <Route path="WaitlookThroughDetail" getComponent={WaitlookThroughDetail}/>
            <Route path="AlreadylookThroughDetail" getComponent={AlreadylookThroughDetail}/>
            <Route path="uploadMusicList" getComponent={uploadMusicList}/>
            <Route path="addUploadMusic" getComponent={addUploadMusic}/>
            <Route path="weArrPayment" getComponent={weArrPayment}/>
            <Route path="addUploadVideo" getComponent={addUploadVideo}/>
            <Route path="uploadvideoList" getComponent={uploadvideoList}/>
            <Route path="myArticleList" getComponent={myArticleList} />
            <Route path="myCollection" getComponent={myCollection} />

        </Route>
    </Router>
    ,
    document.getElementById('example'));

