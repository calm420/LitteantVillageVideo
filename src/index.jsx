import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory, IndexRoute, Link } from 'react-router';
import App from './components/App';
import Stage1 from './components/Stage1';
import "./helpers/webServiceUtil";

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

const alreadyLookThough = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/lookThrough/js/alreadyLookThough').default)
    }, 'alreadyLookThough')
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
const updateVideo = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/uploadVideo/js/updateVideo').default)
    }, 'updateVideo')
};
/*
* 我的收藏
* */
const myCollection = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/collection/js/myCollecton').default)
    }, 'uploadvideoList')

}
const powerList = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/powerList/js/powerList').default)
    }, 'powerList')
};

/**
 * 搜索
 */
const searchHistory = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/search/js/searchHistory').default)
    }, 'searchHistory')
};
const serachResult = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/search/js/serachResult').default)
    }, 'serachResult')
};
const powerAdministrate = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/powerAdministrate/js/powerAdministrate').default)
    }, 'powerAdministrate')
};
const authorityManagement = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/authorityManagement/js/authorityManagement').default)
    }, 'authorityManagement')
};

const userAdministration = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/powerAdministrate/js/userAdministration').default)
    }, 'userAdministration')
};

const accessManagement = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/powerAdministrate/js/authorityManagement').default)
    }, 'accessManagement')
};


//播放视频
const playVideo = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/playVideo/playVideo').default)
    }, 'playVideo')
};


//手机编辑器
const mobileEditor = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/mobileEditor/js/mobileEditor').default)
    }, 'mobileEditor')
};




//发布主题页面
const themeTask = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/themeTask/js/themeTask').default)
    }, 'themeTask')
};

//主题详情页面
const themeTaskDetail = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/article/js/themeTaskDetail').default)
    }, 'themeTaskDetail')
};

//选择部分可见页面
const selectedPeople = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/themeTask/js/selectedPeople').default)
    }, 'selectedPeople')
};

const myThemeTask = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/article/js/myThemeTask').default)
    }, 'myThemeTask')
};



// 微信登录
const wxLogin = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/wxLogin/wxLogin').default)
    }, 'wxLogin')
};

const welcome = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/welcome/welcome').default)
    })
};

//后台管理系统
const villageCardSystemLogin =  (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/VillageCardSystem/js/villageCardSystemLogin.jsx').default)
    })
};
const VillageCardSystemHome =  (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/VillageCardSystem/js/VillageCardSystemHome.jsx').default)
    })
};


//村民注册页面跳转
const villageReg = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/villageReg/js/villageReg').default)
    })
};

import './index.less';

class Index extends React.Component {

    render () {
        return (
            <div className="body">
                {/* <h1>Stages list</h1> */}
                <ul role="nav">
                    {/*<li><Link to="/s1">ListView + Carousel</Link></li>*/}
                    <li><Link to="/AppSystem"
                        style={{ fontSize: '24px' }}>AppSystem</Link></li>
                    <li><Link to="/articleList?userId=53&machineType=ios&version=100"
                        style={{ fontSize: '24px' }}>ios文章列表</Link></li>
                    <li><Link to="/articleList?userId=53"
                        style={{ fontSize: '24px' }}>文章列表</Link></li>
                    <li><Link to="/themeTask?userId=53"
                        style={{ fontSize: '24px' }}>发布主题</Link></li>
                    <li><Link to="/myThemeTask?userId=53&targetId=1"
                        style={{ fontSize: '24px' }}>我的主题列表</Link></li>
                    <li><Link to="/myArticleList?userId=53"
                              style={{fontSize: '24px'}}>我的文章列表</Link></li>
                    <li><Link to="/LoginScanner"
                              style={{fontSize: '24px'}}>扫一扫登录中间页LoginScanner</Link></li>
                    <li><Link to="/Login"
                    style={{fontSize: '24px'}}>二维码登录页</Link></li>
                    <li><Link to="/EditorDemo"
                    style={{fontSize: '24px'}}>editorDemo</Link></li>
                    <li><Link to="/lookThrough?auditorId=3"
                              style={{fontSize: '24px'}}>审核列表</Link></li>
                    <li><Link to="/wxLogin?lookThrough"
                              style={{fontSize: '24px'}}>审核列表(微信)</Link></li>
                    <li><Link to="/uploadMusicList?ident=23836"
                    style={{fontSize: '24px'}}>uploadMusicList</Link></li>
                    <li>
                        <Link
                            to="/weArrPayment?ident=3" style={{fontSize: '24px'}}>充值</Link>
                    </li>
                    <li>
                        <Link
                            to="/uploadvideoList?ident=8&accsess_user=23836" style={{fontSize: '24px'}}>上传视频</Link>
                    </li>


                    <li>
                        <Link
                            to="/myCollection?userId=6" style={{ fontSize: '24px' }}>我的收藏</Link>
                    </li>
                    <li>
                        <Link
                            to="/powerList?ident=6" style={{ fontSize: '24px' }}>系统权限</Link>
                    </li>
                    <li>
                        <Link
                            to="/searchHistory?uid=5" style={{ fontSize: '24px' }}>搜索</Link>
                    </li>
                    <li>
                        <Link
                            to="/powerAdministrate" style={{ fontSize: '24px' }}>角色管理</Link>
                    </li>
                    <li>
                        <Link
                            to="/authorityManagement" style={{ fontSize: '24px' }}>权限管理</Link>
                    </li>
                    <li>
                        <Link
                            to="/playVideo?videoId=126"
                            style={{ fontSize: '24px' }}>播放视频</Link>
                    </li>
                    <li>
                        <Link
                            to="/mobileEditor?userId=31"
                            style={{ fontSize: '24px' }}>手机编辑器</Link>
                    </li>
                    <li>
                        <Link
                            to="/villageCardSystemLogin?userId=31"
                            style={{ fontSize: '24px' }}>登录</Link>
                    </li>
                    <li>
                        <Link
                            to="/villageReg?userId=31"
                            style={{ fontSize: '24px' }}>村民注册跳转</Link>
                    </li>
                </ul>
            </div>
        );
    }
}

ReactDOM.render(
    <Router history={hashHistory}>
        <Route path="/" component={App}>
            {
                isSafeDebug ?
                    <IndexRoute component={Index} />
                    :
                    <IndexRoute getComponent={welcome} />
            }
           
            <Route path="s1" component={Stage1} />
            <Route path="AppSystem" getComponent={AppSystem} />
            <Route path="articleList" getComponent={articleList} />
            <Route path="articleDetail" getComponent={articleDetail} />
            <Route path="LoginScanner" getComponent={LoginScanner} />
            <Route path="Login" getComponent={Login} />
            <Route path="EditorDemo" getComponent={EditorDemo} />
            <Route path="lookThrough" getComponent={lookThrough} />
            <Route path="WaitlookThroughDetail" getComponent={WaitlookThroughDetail} />
            <Route path="alreadyLookThough" getComponent={alreadyLookThough} />
            <Route path="AlreadylookThroughDetail" getComponent={AlreadylookThroughDetail} />
            <Route path="uploadMusicList" getComponent={uploadMusicList} />
            <Route path="addUploadMusic" getComponent={addUploadMusic} />
            <Route path="weArrPayment" getComponent={weArrPayment} />
            <Route path="addUploadVideo" getComponent={addUploadVideo} />
            <Route path="updateVideo" getComponent={updateVideo} />
            <Route path="uploadvideoList" getComponent={uploadvideoList} />
            <Route path="myArticleList" getComponent={myArticleList} />
            <Route path="myCollection" getComponent={myCollection} />
            <Route path="powerList" getComponent={powerList} />
            <Route path="searchHistory" getComponent={searchHistory} />
            <Route path="serachResult" getComponent={serachResult} />
            <Route path="myArticleList" getComponent={myArticleList} />
            <Route path="myCollection" getComponent={myCollection} />
            <Route path="powerList" getComponent={powerList} />
            <Route path="powerAdministrate" getComponent={powerAdministrate} />
            <Route path="authorityManagement" getComponent={authorityManagement} />
            <Route path="userAdministration" getComponent={userAdministration} />
            <Route path="accessManagement" getComponent={accessManagement} />
            <Route path="playVideo" getComponent={playVideo} />
            <Route path="mobileEditor" getComponent={mobileEditor} />
            <Route path="themeTask" getComponent={themeTask} />
            <Route path="themeTaskDetail" getComponent={themeTaskDetail} />
            <Route path="selectedPeople" getComponent={selectedPeople} />
            <Route path="myThemeTask" getComponent={myThemeTask} />
            <Route path="VillageCardSystemHome" getComponent={VillageCardSystemHome} />
            <Route path="villageCardSystemLogin" getComponent={villageCardSystemLogin} />
            <Route path="villageReg" getComponent={villageReg} />
            <Route path="wxLogin" getComponent={wxLogin} />
            <Route path="welcome" getComponent={welcome} />
        </Route>
    </Router>
    ,
    document.getElementById('example'));

