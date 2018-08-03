import React from "react";

import { Tabs, WhiteSpace } from 'antd-mobile';
import '../css/lookThrough.less';

var calm;
export default class lookThrough extends React.Component {
    constructor(props) {
        super(props);
        calm = this;
        this.state = {
            waitLookThroughData: [],
            alreadyLookThroudhData: [],
        }
    }
    componentDidMount() {
        document.title = "审核列表"
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var auditorId = searchArray[0].split('=')[1];
        calm.setState({
            auditorId
        })
        calm.getArticleAndLittleVideoIsNo();
        calm.getArticleAndLittleVideo();

        window.addEventListener('scroll', calm.scrollHandle);
    }
    componentWillMount() {
        window.addEventListener('scroll', calm.scrollHandle);

    }
    scrollHandler() {
        console.log("出发了滚动事件")
        console.log(window.pageYOffset)
    }

    /**
     * 未审核列表
     */
    getArticleAndLittleVideoIsNo() {
        var param = {
            "method": 'getArticleAndLittleVideoIsNo',
            "pageNo": -1,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                console.log(result, "带审核");

                if (result.success) {
                    calm.setState({
                        waitLookThroughData: result.response
                    })

                }
            },
            onError: function (error) {
                // Toast.fail(error, 1); 
            }
        });
    }

    /**
     * 获取已审核列表
     */
    getArticleAndLittleVideo() {
        var param = {
            "method": 'getArticleAndLittleVideo',
            "pageNo": -1,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                console.log(result, "一审核");
                if (result.success) {
                    calm.setState({
                        alreadyLookThroudhData: result.response
                    })
                }
            },
            onError: function (error) {
                // Toast.fail(error, 1); 
            }
        });
    }

    /**
    * 跳转未审核页面
    */
    toWaitLookThrough(id, type) {
        var url = encodeURI(WebServiceUtil.mobileServiceURL + "WaitlookThroughDetail?id=" + id + "&type=" + type + "&auditorId=" + calm.state.auditorId);
        var data = {
            method: 'openNewPage',
            url: url
        };
        Bridge.callHandler(data, null, function (error) {
            window.location.href = url;
        });
    }
    /**
     * 跳转已审核页面
     */
    toAlreadyLookThrough(id, type, auditId) {
        var url = encodeURI(WebServiceUtil.mobileServiceURL + "AlreadylookThroughDetail?id=" + id + "&type=" + type + "&auditId=" + auditId);
        var data = {
            method: 'openNewPage',
            url: url
        };
        Bridge.callHandler(data, null, function (error) {
            window.location.href = url;
        });
    }
    render() {

        var _this = this;
        const tabs = [
            { title: '待审核' },
            { title: '已审核' },
        ];
        return (
            <div id="lookThrough" style={{
                height: document.body.clientHeight
            }}>
                <Tabs tabs={tabs} initialPage={0} animated={false} useOnPan={false} >
                    <div style={{
                        height: document.documentElement.clientHeight - 43.5,
                        backgroundColor: '#f4f4f4'
                    }}>

                    {/* 未审核 */}
                    {
                        calm.state.waitLookThroughData.map((v, i) => {
                            return (
                                <div>
                                    {
                                        v.littleVideoInfo ?
                                            <div className="item my_flex" onClick={_this.toWaitLookThrough.bind(this, v.littleVideoInfoID, v.type)}>
                                                <img className='photo' src={v.littleVideoInfo ? v.littleVideoInfo.userInfo.avatar : ""} alt=""/>
                                                <div className='right'>
                                                    <span className='author'>{v.littleVideoInfo.userInfo.userName}</span>
                                                    <span className="type">{/*类型：短视频*/} <img src={require("../img/icon_video.png")}/></span>
                                                    <div className='time'>{WebServiceUtil.formatYMD(v.littleVideoInfo.createTime)}</div>
                                                </div>
                                            </div>
                                            :
                                            v.articleInfo ?
                                                <div className="item my_flex" onClick={_this.toWaitLookThrough.bind(this, v.articleInfoId, v.type)}>
                                                    <img className='photo' src={v.articleInfo.userInfo ? v.articleInfo.userInfo.avatar : ""} alt=""/>
                                                    <div className='right'>
                                                        <span className='author'>{v.articleInfo.userInfo ? v.articleInfo.userInfo.userName : ""}</span>
                                                        <span className="type">{/*类型：自媒体文章*/}<img src={require("../img/icon_media.png")}/></span>
                                                        <div className='title'>{v.articleInfo.articleTitle}</div>
                                                        <div className='time'>{WebServiceUtil.formatYMD(v.articleInfo.createTime)}</div>

                                                    </div>

                                                </div>
                                                :
                                                    v.discussInfo ?
                                                    <div className="item my_flex" onClick={_this.toWaitLookThrough.bind(this, v.discussInfoId, v.type)}>
                                                        <img className='photo' src={v.discussInfo.discussUser ? v.discussInfo.discussUser.avatar : ""} alt="" />
                                                        <div className='right'>
                                                            <span className='author'>{v.discussInfo.discussUser ? v.discussInfo.discussUser.userName : ""}</span>
                                                            <span className="type">{/*类型：评论*/}<img src={require("../img/icon_comment.png")}/></span>
                                                            <div className='title'>{v.discussInfo.discussContent}</div>
                                                            <div className='time'>{WebServiceUtil.formatYMD(v.discussInfo.createTime)}</div>
                                                        </div>
                                                    </div>:
                                                    ""
                                        }
                                    </div>

                                )
                            })
                        }
                    </div>
                    {/* 已经审核 */}
                    <div style={{
                        height: document.documentElement.clientHeight - 43.5,
                        backgroundColor: '#f4f4f4'
                    }}>

                    {
                        calm.state.alreadyLookThroudhData.map((v, i) => {
                            return (
                                <div>
                                    {
                                        v.littleVideoInfo ?
                                            <div className="item my_flex" onClick={_this.toAlreadyLookThrough.bind(this, v.littleVideoInfoID, v.type, v.auditId)}>
                                                <img className='photo' src={v.littleVideoInfo ? v.littleVideoInfo.userInfo.avatar : ""} alt=""/>
                                                <div className="right">
                                                    <span className='author'>{v.littleVideoInfo.userInfo.userName}</span>
                                                    <span className='type'>{/*类型：短视频*/}<img src={require("../img/icon_video.png")}/></span>
                                                    <div className='time'>{WebServiceUtil.formatYMD(v.littleVideoInfo.createTime)}</div>
                                                </div>

                                            </div>
                                            :
                                            v.articleInfo ?
                                                <div className="item my_flex" onClick={_this.toAlreadyLookThrough.bind(this, v.articleInfoId,v.type, v.auditId)}>
                                                    <img className='photo' src={v.articleInfo ? v.articleInfo.userInfo.avatar : ""} alt=""/>
                                                    <div className="right">
                                                        <span className='author'>{v.articleInfo.userInfo ? v.articleInfo.userInfo.userName : ""}</span>
                                                        <span  className='type'>{/*类型：自媒体文章*/}<img src={require("../img/icon_media.png")}/></span>
                                                        <div className='title'>{v.articleInfo.articleTitle}</div>
                                                        <div className='time'>上传时间：{WebServiceUtil.formatYMD(v.articleInfo.createTime)}</div>

                                                    </div>
                                                </div>
                                                :
                                                    v.discussInfo ?
                                                    <div className="item my_flex" onClick={_this.toAlreadyLookThrough.bind(this, v.discussInfoId, v.type, v.auditId)}>
                                                        <img className='photo' src={v.discussInfo.discussUser ? v.discussInfo.discussUser.avatar : ""} alt="" />
                                                        <div className='right'>
                                                            <span className='author'>{v.discussInfo.discussUser ? v.discussInfo.discussUser.userName : ""}</span>
                                                            <span className="type">{/*类型：评论*/}<img src={require("../img/icon_comment.png")}/></span>
                                                            <div className='title'>{v.discussInfo.discussContent}</div>
                                                            <div className='time'>{WebServiceUtil.formatYMD(v.discussInfo.createTime)}</div>
                                                        </div>
                                                    </div>:
                                                    ""
                                        }
                                    </div>
                                )
                            })
                        }
                    </div>
                </Tabs>
            </div>
        )
    }
}