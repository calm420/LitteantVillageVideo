import React from "react";
import { List, Radio, TextareaItem, Toast, Modal, Button, Icon } from 'antd-mobile';
import "../css/WaitlookThroughDetail.less"
const RadioItem = Radio.RadioItem;
const alert = Modal.alert;
var calm;

export default class WaitlookThroughDetail extends React.Component {
    constructor(props) {
        super(props);
        calm = this;
        this.state = {
            // isPass: 0,
            // isRec: 0,
            // isTop: 0,
            data: {},
            clientHeight: document.body.clientHeight,
            textareaValue: "",
            showMark: true
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
        window.addEventListener('resize', calm.onWindowResize);
        /**
        * 防止软键盘挡住页面
        */
        var winHeight = $(window).height(); // 获取当前页面高度  
        $(window).resize(function () {
            var resizeHeight = $(this).height();
            if (winHeight - resizeHeight > 50) {
                // 软键盘弹出  
                $('body').css('height', winHeight + 'px');
            } else {
                //软键盘收起
                $('body').css('height', '100%');
            }
        });
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
                console.log(result)
                if (result.success) {
                    if (result.response.auditId > 0) {
                        calm.setState({
                            showStatus: true,
                            showMark: false
                        })
                    }
                    if (result.response.auditInfo.isPass == 1) {
                        calm.setState({
                            isShow: true,
                            isRec: result.response.isRecommend,
                            isTop: result.response.isTop
                        })
                    }
                    calm.setState({
                        data: result.response,
                        isPass: result.response.auditInfo.isPass,
                        auditUser: result.response.auditInfo.auditorUserName,
                        textareaValue: result.response.auditInfo.auditMark,
                        auditMark: result.response.auditInfo.auditMark,
                        auditingTime: result.response.auditInfo.auditingTime,
                        isRec: result.response.isRecommend,
                        isTop: result.response.isTop
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
                // alert(JSON.stringify(result));
                if (result.success) {
                    if (result.response.auditId > 0) {
                        calm.setState({
                            showStatus: true,
                            showMark: false
                        })
                    }
                    if (result.response.auditInfo.isPass == 1) {
                        calm.setState({
                            isShow: true,
                            isRec: result.response.isRecommend,
                            isTop: result.response.istop
                        })
                    }
                    calm.setState({
                        data: result.response,
                        isPass: result.response.auditInfo.isPass,
                        auditUser: result.response.auditInfo.auditorUserName,
                        auditMark: result.response.auditInfo.auditMark,
                        textareaValue: result.response.auditInfo.auditMark,
                        auditingTime: result.response.auditInfo.auditingTime,
                        isTop: result.response.istop,
                        isRec: result.response.isRecommend,

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
                    if (result.response.auditId > 0) {
                        calm.setState({
                            showStatus: true,
                            showMark: false
                        })
                    }
                    calm.setState({
                        isShow: true,
                        data: result.response,
                        isPass: result.response.auditInfo.isPass,
                        auditUser: result.response.auditInfo.auditorUserName,
                        auditMark: result.response.auditInfo.auditMark,
                        textareaValue: result.response.auditInfo.auditMark,
                        auditingTime: result.response.auditInfo.auditingTime,
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
        console.log(this.state.isPass, "isPass")
        console.log(value, "v")
        this.state.isPass = value;
        if (value == 1) {
            calm.setState({
                isShow: true,
                // isRec:-1,
                // isTop:-1
            })
        }
        if (value == 0) {
            calm.setState({
                isShow: false,
                // isRec:"",
                // isTop:""
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
        console.log(value, "rec")
        this.setState({
            isRec: value
        })
    }

    /**
     * 是否置顶
     */
    topChange = (value) => {
        console.log(value, "top")
        this.setState({
            isTop: value
        })
    }

    /**
     * 点击提交按钮
     */
    submit() {
        console.log(calm.state.type, "type")

        var param;
        //小视频
        if (calm.state.type == 0) {
            // if(calm.state.isPass == ""){
            //     Toast.info("1")
            //     return
            // }
            // if(calm.state.isPass == "" && calm.state.isTop == ""){
            //     Toast.info("2")
            //     return
            // }
            // if(calm.state.isPass == 1 && calm.state.isTop == ""){
            //     Toast.info("3")
            //     return
            // }
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
            // if(calm.state.isPass == ""){
            //     Toast.info("1111111")
            //     return
            // }
            // if(calm.state.isPass == "" && calm.state.isRec == ""){
            //     Toast.info("2222222")
            //     return
            // }
            // if(calm.state.isPass == 1 && calm.state.isRec == ""){
            //     Toast.info("333")
            //     return
            // }

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
            // if(calm.state.isPass == ""){
            //     Toast.info("bububu")
            //     return
            // }
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
                // alert(JSON.stringify(result))
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

    /**
     * 重新审核弹出框
     */
    showAlert = (event) => {
        event.stopPropagation()
        var phoneType = navigator.userAgent;
        var phone;
        if (phoneType.indexOf('iPhone') > -1 || phoneType.indexOf('iPad') > -1) {
            phone = 'ios'
        } else {
            phone = 'android'
        }
        var _this = this;
        const alertInstance = alert('您确定重新审核吗?', '', [
            { text: '取消', onPress: () => console.log('cancel'), style: 'default' },
            { text: '确定', onPress: () => calm.reLook() },

        ], phone);
    }
    reLook() {
        calm.setState({
            showMark: true
        })
    }

    render() {

        console.log(calm.state.showStatus, "isPass")

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
                            <div className="calm">
                                <div style={{ display: calm.state.showStatus ? "block" : "none" }} className="review">
                                    <div className='line_public'>
                                        <span className='title'>审核人：</span>{calm.state.auditUser}
                                        <span className='time'>{WebServiceUtil.formatYMD(calm.state.auditingTime)}</span>

                                    </div>
                                    <div className='line_public'>
                                        <span className='title'>审核说明：</span>
                                        <div className='reCont'>
                                            {calm.state.auditMark ? calm.state.auditMark : "无"}
                                        </div>
                                    </div>
                                    <div className='result'>
                                        <span className='title'>审核结果：</span>
                                        {calm.state.isPass == 1 ? <span className="pass">已通过</span> : <span>未通过</span>}
                                        {calm.state.isTop == 1 ? <span className="pass">已置顶</span> : <span>未置顶</span>}
                                        <div className="reBtn" onClick={calm.showAlert}>
                                            重新审核
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: calm.state.showMark ? "block" : "none" }}>
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

                            </div>

                            :
                            calm.state.type == 1 ?
                                <div className="calm">
                                    <div style={{ display: calm.state.showStatus ? "block" : "none" }} className="review">
                                        <div className='line_public'>
                                            <span className='title'>审核人：</span>{calm.state.auditUser}
                                            <span className='time'>{WebServiceUtil.formatYMD(calm.state.auditingTime)}</span>

                                        </div>
                                        <div className='line_public'>
                                            <span className='title'>审核说明：</span>
                                            <div className='reCont'>
                                                {calm.state.auditMark ? calm.state.auditMark : "无"}
                                            </div>
                                        </div>
                                        <div className='result'>
                                            <span className='title'>审核结果：</span>
                                            {calm.state.isPass == 1 ? <span className="pass">已通过</span> : <span>未通过</span>}
                                            {calm.state.isRec == 1 ? <span className="pass">已优先</span> : <span>未优先</span>}
                                            <div className="reBtn" onClick={calm.showAlert}>
                                                重新审核
                                            </div>
                                            <div>
                                            </div>

                                        </div>
                                    </div>
                                    <div style={{ display: calm.state.showMark ? "block" : "none" }}>
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
                                </div>
                                :
                                calm.state.type == 2 ?
                                    <div className="calm">
                                        <div style={{ display: calm.state.showStatus ? "block" : "none" }} className="review">
                                            <div className='line_public'>
                                                <span className='title'>审核人：</span>{calm.state.auditUser}
                                                <span className='time'>{WebServiceUtil.formatYMD(calm.state.auditingTime)}</span>

                                            </div>
                                            <div className='line_public'>
                                                <span className='title'>审核说明：</span>
                                                <div className='reCont'>
                                                    {calm.state.auditMark ? calm.state.auditMark : "无"}
                                                </div>
                                            </div>
                                            <div className='result'>
                                                <span className='title'>审核结果：</span>
                                                {calm.state.data.auditInfo.isPass == 1 ? <span className="pass">已通过</span> : <span>未通过</span>}
                                                <div className="reBtn" onClick={calm.showAlert}>
                                                    重新审核
                                                </div>
                                                <div>

                                                </div>
                                                <div style={{ display: calm.state.showMark ? "block" : "none" }}>
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
                                            </div>
                                        </div>
                                    </div>
                                    :
                                    ""
                    }
                    <div className="submitBtn noPosition" style={{ marginTop: 40 }}>
                        <Button type='warning' onClick={_this.submit}>提交</Button>
                    </div>
                </div>



            </div>

        )
    }
}
