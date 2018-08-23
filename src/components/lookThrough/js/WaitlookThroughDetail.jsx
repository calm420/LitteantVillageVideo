import React from "react";
import { List, Radio, TextareaItem, Toast, Button, Icon } from 'antd-mobile';
import "../css/WaitlookThroughDetail.less"
const RadioItem = Radio.RadioItem;
var calm;

export default class WaitlookThroughDetail extends React.Component {
    constructor(props) {
        super(props);
        calm = this;
        this.state = {
            isPass: 0,
            isRec: 0,
            isTop: 0,
            data: {},
            clientHeight: document.body.clientHeight,
            textareaValue: ""
        }
    }

    componentDidMount() {
        document.title = "待审核详情页";
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var id = searchArray[0].split('=')[1];
        var type = searchArray[1].split('=')[1];
        var auditorId = searchArray[2].split('=')[1];
        calm.setState({
            id, type, auditorId
        })
        if (type == 0) {
            calm.getArticleInfoById(id)

        } else if (type == 1) {
            calm.getLittleVideoById(id)
        } else if (type == 2) {
            calm.getDiscussInfoById(id)
        }
        window.addEventListener('resize', calm.onWindowResize)
    }


    //监听窗口改变时间
    onWindwoResize() {
        // this
        setTimeout(() => {
            calm.setState({
                clientHeight: document.body.clientHeight,
            })
        }, 100)
    }
    /**
     * 自媒体文章
     */
    getArticleInfoById(id) {
        var param = {
            "method": 'getArticleInfoById',
            "articleId": id,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                if (result.success) {
                    calm.setState({
                        data: result.response
                    })
                }
            },
            onError: function (error) {
                // Toast.fail(error, 1);
            }
        });
    }
    /**
     * 短时频数据
     */
    getLittleVideoById(id) {
        var param = {
            "method": 'getLittleVideoById',
            "videoId": id,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                if (result.success) {
                    calm.setState({
                        data: result.response
                    })
                }
            },
            onError: function (error) {
                // Toast.fail(error, 1);
            }
        });
    }

    /**
     * 获取评论数据
     */
    getDiscussInfoById(id) {
        var param = {
            "method": 'getDiscussInfoById',
            "discussId": id,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                if (result.success) {
                    calm.setState({
                        data: result.response
                    })
                }
            },
            onError: function (error) {
                // Toast.fail(error, 1);
            }
        });
    }
    /**
     * 单选按钮的改变
     */
    redioChange = (value) => {
        this.state.isPass = value;
        if (value == 1) {
            calm.setState({
                isShow: true
            })
        }
        if (value == 0) {
            calm.setState({
                isShow: false,
                isRec: 0,
                isTop: 0
            })
        }
        this.setState({
            isPass: value,
        });
    };

    /**
     * 是否推荐
     */
    recChange = (value) => {
        this.setState({
            isRec: value
        })
    }

    /**
     * 是否置顶
     */
    topChange = (value) => {
        this.setState({
            isTop: value
        })
    }

    /**
     * 点击提交按钮
     */
    submit() {
        var param;
        if (calm.state.type == 0) {
            param = {
                "method": 'saveAuditInfo',
                "auditInfoJson": {
                    targetId: calm.state.id,
                    targetType: calm.state.type,
                    isPass: calm.state.isPass,
                    auditMark: calm.state.textareaValue,
                    auditorId: calm.state.auditorId,
                    istop: calm.state.isTop,
                    // isRecommend: calm.state.isRec
                },
            };
        } else if (calm.state.type == 1) {
            param = {
                "method": 'saveAuditInfo',
                "auditInfoJson": {
                    targetId: calm.state.id,
                    targetType: calm.state.type,
                    isPass: calm.state.isPass,
                    auditMark: calm.state.textareaValue,
                    auditorId: calm.state.auditorId,
                    isRecommend: calm.state.isRec
                },
            };
        } else if (calm.state.type == 2) {
            param = {
                "method": 'saveAuditInfo',
                "auditInfoJson": {
                    targetId: calm.state.id,
                    targetType: calm.state.type,
                    isPass: calm.state.isPass,
                    auditMark: calm.state.textareaValue,
                    auditorId: calm.state.auditorId,
                },
            };
        }
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                alert(JSON.stringify(result))
                if (result.success) {
                    Toast.success('成功');
                    var data = {
                        method: 'finish',
                    };
                    Bridge.callHandler(data, null, function (error) {
                        console.log(error);
                    });
                }
            },
            onError: function (error) {
                // Toast.fail(error, 1);
            }
        });
    }


    render() {
        var _this = this;
        const data2 = [
            { value: 1, label: '通过' },
            { value: 0, label: '不通过' },
        ];
        const isRecData = [
            { value: 1, label: '是' },
            { value: 0, label: '否' },
        ];
        const isTopData = [
            { value: 1, label: '是' },
            { value: 0, label: '否' },
        ];
        const { isPass, isRec, isTop } = this.state;
        return (
            <div id="waitLookThrough">
                {/* <div className="goBack line_public"><Icon type="left" onClick={calm.goBack}/></div> */}
                <div className="fatherDiv">
                    <div className="content">
                        {
                            calm.state.type == 0 ?
                                <div className="sameBack">
                                    <div className='title'>{calm.state.data.articleTitle}</div>
                                    <div className='topMsg'>
                                        <img className="photo" src={calm.state.data.userInfo ? calm.state.data.userInfo.avatar : ""} alt="" />
                                        <span className='author'>{calm.state.data.userInfo ? calm.state.data.userInfo.userName : ""}</span>
                                        <span className='time'>{WebServiceUtil.formatYMD(calm.state.data.createTime)}</span>
                                        <span className="type">{/*类型：自媒体文章*/}<img src={require("../img/icon_media.png")} /></span>
                                    </div>
                                    <div className='textCont' dangerouslySetInnerHTML={{ __html: calm.state.data.articleContent }}></div>
                                </div>
                                :
                                calm.state.type == 1 ?
                                    <div className="sameBack">
                                        <div className='topMsg'>
                                            <img className="photo" src={calm.state.data.userInfo ? calm.state.data.userInfo.avatar : ""} alt="" />
                                            <span className='author'>{calm.state.data.userInfo ? calm.state.data.userInfo.userName : ""}</span>
                                            <span className='time'>{WebServiceUtil.formatYMD(calm.state.data.createTime)}</span>
                                            <span className="type">{/*类型：短视频*/}<img src={require("../img/icon_video.png")} /></span>
                                        </div>
                                        <div className="textCont">
                                            <div className='video_title'>{calm.state.data.videoContent}</div>
                                            <video
                                                controls="controls"
                                                preload="auto"
                                                poster={calm.state.data.coverPath}
                                                style={{ objectFit: "fill", width: "100%" }}
                                                src={calm.state.data.videoPath}>
                                            </video>
                                        </div>
                                    </div>
                                    :
                                    calm.state.type == 2 ?
                                        <div className="sameBack">
                                            <div className='topMsg'>
                                                <img className="photo" src={calm.state.data.userInfo ? calm.state.data.userInfo.avatar : ""} alt="" />
                                                <span className='author'>{calm.state.data.discussUser ? calm.state.data.discussUser.userName : ""}</span>
                                                <span className='time'>{WebServiceUtil.formatYMD(calm.state.data.createTime)}</span>
                                                <span className="type">{/*类型：评论*/}<img src={require("../img/icon_comment.png")} /></span>
                                            </div>
                                            <div className="textCont">
                                                {calm.state.data.discussContent}
                                            </div>
                                        </div>
                                        : ""
                        }
                        {
                            calm.state.type == 0 ?
                                <div>
                                    <div className="isDangerArea">
                                        <List renderHeader={() => '审核：'}>
                                            {data2.map(i => (
                                                <RadioItem key={i.value} checked={isPass === i.value} onChange={() => this.redioChange(i.value)}>
                                                    {i.label}
                                                    {/*<List.Item.Brief>{i.extra}</List.Item.Brief>*/}
                                                </RadioItem>
                                            ))}
                                        </List>
                                        <div style={{ display: calm.state.isShow ? "block" : "none" }}>
                                            {/* <List renderHeader={() => '推荐：'}>
                                            {isRecData.map(i => (
                                                <RadioItem key={i.value} checked={isRec === i.value} onChange={() => this.recChange(i.value)}>
                                                    {i.label}
                                                </RadioItem>
                                            ))}
                                        </List> */}
                                            <List className='toFirst' renderHeader={() => '置顶：'}>
                                                {isTopData.map(i => (
                                                    <RadioItem key={i.value} checked={isTop === i.value} onChange={() => this.topChange(i.value)}>
                                                        {i.label}
                                                        {/*<List.Item.Brief>{i.extra}</List.Item.Brief>*/}
                                                    </RadioItem>
                                                ))}
                                            </List>
                                        </div>

                                    </div>
                                    <div className="sameBack description">审核说明:
                            <List>
                                            <TextareaItem
                                                rows={3}
                                                placeholder="请在此处输入审核的说明／不通过的原因"
                                                onChange={v => _this.setState({
                                                    textareaValue: v
                                                })}
                                                count={30}
                                            />
                                        </List>
                                    </div>
                                </div>
                                :
                                calm.state.type == 1 ?
                                    <div>
                                        <div className="isDangerArea priority">
                                            <List renderHeader={() => '审核：'}>
                                                {data2.map(i => (
                                                    <RadioItem key={i.value} checked={isPass === i.value} onChange={() => this.redioChange(i.value)}>
                                                        {i.label}
                                                        {/*<List.Item.Brief>{i.extra}</List.Item.Brief>*/}
                                                    </RadioItem>
                                                ))}
                                            </List>
                                            <List className='toPriority' style={{ display: calm.state.isShow ? "block" : "none" }} renderHeader={() => '优先展示：'}>
                                                {isRecData.map(i => (
                                                    <RadioItem key={i.value} checked={isRec === i.value} onChange={() => this.recChange(i.value)}>
                                                        {i.label}
                                                        {/*<List.Item.Brief>{i.extra}</List.Item.Brief>*/}
                                                    </RadioItem>
                                                ))}
                                            </List>

                                        </div>
                                        <div className="sameBack description">审核说明:
                                        <List>
                                                <TextareaItem
                                                    rows={3}
                                                    placeholder="请在此处输入审核的说明／不通过的原因"
                                                    onChange={v => _this.setState({
                                                        textareaValue: v
                                                    })}
                                                    count={30}
                                                />
                                            </List>
                                        </div>
                                    </div>
                                    :
                                    calm.state.type == 2 ?
                                        <div>
                                            <div className="isDangerArea">
                                                <List renderHeader={() => '审核：'}>
                                                    {data2.map(i => (
                                                        <RadioItem key={i.value} checked={isPass === i.value} onChange={() => this.redioChange(i.value)}>
                                                            {i.label}
                                                            {/*<List.Item.Brief>{i.extra}</List.Item.Brief>*/}
                                                        </RadioItem>
                                                    ))}
                                                </List>
                                            </div>
                                            <div className="sameBack description">审核说明:
                                        <List>
                                                    <TextareaItem
                                                        rows={3}
                                                        placeholder="请在此处输入审核的说明／不通过的原因"
                                                        onChange={v => _this.setState({
                                                            textareaValue: v
                                                        })}
                                                        count={30}
                                                    />
                                                </List>
                                            </div>
                                        </div>
                                        :
                                        ""
                        }
                        <div className="submitBtn">
                            <Button type='warning' onClick={_this.submit}>提交</Button>
                        </div>
                    </div>

                </div>
            </div>

        )
    }
}
