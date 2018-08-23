import React from "react";
import { List, Radio, TextareaItem, Toast, Modal, Button, Icon, Result } from 'antd-mobile';
import "../css/AlreadylookThroughDetail.less"

const RadioItem = Radio.RadioItem;
const alert = Modal.alert;
var calm;
export default class AlreadylookThroughDetail extends React.Component {
    constructor(props) {
        super(props);
        calm = this;
        this.state = {
            data: {},
            flag: 0,
            textareaValue: "",
            isRec: "",
            isTop: ""
        }
    }
    componentDidMount() {
        document.title = "已审核详情页"
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var id = searchArray[0].split('=')[1];
        var type = searchArray[1].split('=')[1];
        var auditId = searchArray[2].split('=')[1];
        calm.setState({
            id, type, auditId
        })
        calm.getUnionByAId(id, auditId, type)
    }

    /**
      * 单选按钮的改变
      */
    radioChange = (value) => {

        if (value == 1) {
            calm.setState({
                isShow: true
            })
        }
        if (value == 0) {
            calm.setState({
                isShow: false,
                isRec: "",
                isTop: ""
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

    /**
     * 重新审核
     */
    reLook() {
        calm.setState({
            flag: 1
        })
    }
    /**
     * 点击提交按钮
     */
    submit() {
      
        var param;
        if (calm.state.type == 0) {
            param = {
                "method": 'updateAUditInfo',
                "auditInfoJson": {
                    auditId: calm.state.auditId,
                    targetId: calm.state.id,
                    targetType: calm.state.type,
                    isPass: calm.state.isPass,
                    auditMark: calm.state.textareaValue,
                    auditorId: 3,
                    istop: calm.state.isTop,
                    isRecommend: calm.state.isRec
                },
            }
        } else if (calm.state.type == 1) {
            param = {
                "method": 'updateAUditInfo',
                "auditInfoJson": {
                    auditId: calm.state.auditId,
                    targetId: calm.state.id,
                    targetType: calm.state.type,
                    isPass: calm.state.isPass,
                    auditMark: calm.state.textareaValue,
                    auditorId: 3,
                    isRecommend: calm.state.isRec
                },
            }
        } else if (calm.state.type == 2) {
            param = {
                "method": 'updateAUditInfo',
                "auditInfoJson": {
                    auditId: calm.state.auditId,
                    targetId: calm.state.id,
                    targetType: calm.state.type,
                    isPass: calm.state.isPass,
                    auditMark: calm.state.textareaValue,
                    auditorId: 3,
                },
            }

        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                if (result.success) {
                    Toast.success('成功');
                    //关闭当前窗口，并刷新上一个页面
                    var data = {
                        method: 'finishForRefresh',
                    };
                    Bridge.callHandler(data, null, function (error) {
                        console.log(error);
                    });
                }

            },
            onError: function (error) {
                Toast.fail(error, 1);
            }
        });
    }


    /**
     * 获取已经修改的数据
     */
    getUnionByAId(id, auditId, type) {
        var param = {
            "method": 'getUnionByAId',
            "Id": id,
            "auditId": auditId,
            "type": type
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                if (result.success) {
                    calm.setState({
                        data: result.response,
                        textareaValue: result.response.auditInfo ? result.response.auditInfo.auditMark : "",
                        isPass: result.response.auditInfo.isPass,
                        isTop: result.response.auditInfo.istop,
                        isRec: result.response.auditInfo.isRecommend,
                        isShow: result.response.auditInfo.isPass == 1 ? true : false
                    })
                }
            },
            onError: function (error) {
                Toast.fail(error, 1);
            }
        });
    }


    render() {
        var _this = this;
        const passData = [
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
            <div id="alreadyLookThrough" style={{
                height: document.body.clientHeight
            }}>
                {/* <div className="goBack line_public"><Icon type="left" onClick={calm.goBack}/></div> */}
                <div className="content" style={{ height: calm.state.flag == 1 ? "" : "100%" }}>
                    {
                        // 自媒体文章
                        calm.state.type == 0 ?
                            <div>
                                {
                                    calm.state.data.articleInfo ?
                                        <div>
                                            <div className='sameBack'>
                                                <div className='title'>{calm.state.data.articleInfo.articleTitle}</div>
                                                <div className='topMsg'>
                                                    <img className="photo" src={calm.state.data.articleInfo.userInfo ? calm.state.data.articleInfo.userInfo.avatar : ""} alt="" />
                                                    <span className='author'>{calm.state.data.articleInfo.userInfo ? calm.state.data.articleInfo.userInfo.userName : ""}</span>
                                                    <span className='time'>{calm.state.data.articleInfo.createTime ? WebServiceUtil.formatAllTime(calm.state.data.articleInfo.createTime) : ""}</span>
                                                    <span className='type'>{/*类型：自媒体文章*/}<img src={require("../img/icon_media.png")} /></span>
                                                </div>
                                                <div className='textCont' dangerouslySetInnerHTML={{ __html: calm.state.data.articleInfo.articleContent }}></div>
                                            </div>
                                            <div className='review'>
                                                <div className='line_public'>
                                                    <span className='title'>审核人：</span>
                                                    {calm.state.data.auditInfo.auditorUser ? calm.state.data.auditInfo.auditorUser.userName : ""}
                                                    <span className='time'>{calm.state.data.auditInfo.auditingTime ? WebServiceUtil.formatAllTime(calm.state.data.auditInfo.auditingTime) : ""}</span></div>
                                                <div className='line_public'>
                                                    <span className='title'>审核说明：</span>
                                                    <div className='reCont'>
                                                        {calm.state.data.auditInfo.auditMark ? calm.state.data.auditInfo.auditMark : "无"}
                                                    </div>
                                                </div>
                                                <div>
                                                    <span className='title'>审核结果：</span>
                                                    {calm.state.data.auditInfo.isPass == 1 ? <span className="pass">已通过</span> : <span>未通过</span>}
                                                    {calm.state.data.auditInfo.istop == 1 ? <span className="pass">已置顶</span> : <span>未置顶</span>}
                                                    {calm.state.data.auditInfo.isRecommend == 1 ? <span className="pass">已推荐</span> : <span>未推荐</span>}
                                                    <div className="reBtn" onClick={calm.showAlert} style={{ display: calm.state.flag == 0 ? "block" : "none" }}>
                                                        重新审核
                                                </div>
                                                </div>
                                            </div>
                                        </div>
                                        :
                                        ""
                                }
                            </div>
                            :
                            // 短视频
                            calm.state.type == 1 ?
                                <div>
                                    {
                                        calm.state.data.littleVideoInfo ?
                                            <div>
                                                <div className='sameBack'>
                                                    <div className='topMsg'>
                                                        <img className="photo" src={calm.state.data.littleVideoInfo.userInfo.avatar} alt="" />
                                                        <span className='author'>{calm.state.data.littleVideoInfo.userInfo.userName}</span>
                                                        <span className='time'>{calm.state.data.littleVideoInfo.createTime ? WebServiceUtil.formatAllTime(calm.state.data.littleVideoInfo.createTime) : ""}</span>
                                                        <span className="type">{/*类型：短视频*/}<img src={require("../img/icon_video.png")} /></span>
                                                    </div>
                                                    <div className='textCont'>
                                                        <video
                                                            style={{ width: "100%" }}
                                                            controls="controls"
                                                            preload="load"
                                                            src={calm.state.data.littleVideoInfo.videoPath}
                                                            autoPlay>
                                                        </video>
                                                    </div>
                                                </div>
                                                <div className='review'>
                                                    <div className='line_public'>
                                                        <span className='title'>审核人：</span>
                                                        {calm.state.data.auditInfo.auditorUser ? calm.state.data.auditInfo.auditorUser.userName : ""}
                                                        <span className='time'>{calm.state.data.auditInfo.auditingTime ? WebServiceUtil.formatAllTime(calm.state.data.auditInfo.auditingTime) : ""}</span></div>
                                                    <div className='line_public'>
                                                        <span className='title'>审核说明：</span>
                                                        <div className='reCont'>
                                                            {calm.state.data.auditInfo.auditMark ? calm.state.data.auditInfo.auditMark : "无"}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <span className='title'>审核结果：</span>
                                                        {calm.state.data.auditInfo.isPass == 1 ? <span className="pass">已通过</span> : <span>未通过</span>}
                                                        {calm.state.data.auditInfo.isRecommend == 1 ? <span className="pass">已推荐</span> : <span>未推荐</span>}
                                                        <div className="reBtn" onClick={calm.showAlert} style={{ display: calm.state.flag == 0 ? "block" : "none" }}>
                                                            重新审核
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            :
                                            ""

                                    }

                                </div>
                                :
                                calm.state.type == 2 ?
                                    <div>
                                        {
                                            calm.state.data.discussInfo ?
                                                <div>
                                                    <div className="sameBack">
                                                        <div className='topMsg'>
                                                            <img className="photo" src={calm.state.data.discussInfo.discussUser ? calm.state.data.discussInfo.discussUser.avatar : ""} alt="" />
                                                            <span className='author'>{calm.state.data.discussInfo.discussUser ? calm.state.data.discussInfo.discussUser.userName : ""}</span>
                                                            <span className='time'>{WebServiceUtil.formatYMD(calm.state.data.discussInfo.createTime)}</span>
                                                            <span className="type">{/*类型：评论*/}<img src={require("../img/icon_comment.png")} /></span>
                                                        </div>
                                                        <div className='textCont'>
                                                            {calm.state.data.discussInfo.discussContent}
                                                        </div>
                                                    </div>
                                                    <div className='review'>
                                                        <div className='line_public'>
                                                            <span className='title'>审核人：</span>
                                                            {calm.state.data.auditInfo.auditorUser ? calm.state.data.auditInfo.auditorUser.userName : ""}
                                                            <span className='time'>{calm.state.data.auditInfo.auditingTime ? WebServiceUtil.formatAllTime(calm.state.data.auditInfo.auditingTime) : ""}</span></div>
                                                        <div className='line_public'>
                                                            <span className='title'>审核说明：</span>
                                                            <div className='reCont'>
                                                                {calm.state.data.auditInfo.auditMark ? calm.state.data.auditInfo.auditMark : "无"}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <span className='title'>审核结果：</span>
                                                            {calm.state.data.auditInfo.isPass == 1 ? <span className="pass">已通过</span> : <span>未通过</span>}
                                                            <div className="reBtn" onClick={calm.showAlert} style={{ display: calm.state.flag == 0 ? "block" : "none" }}>
                                                                重新审核
                                                        </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                : ""
                                        }
                                    </div>
                                    :
                                    ""
                    }
                    {
                        calm.state.type == 0 ?
                            <div style={{ display: calm.state.flag == 1 ? "block" : "none" }}>
                                <div className="isDangerArea">
                                    <List renderHeader={() => '审核：'}>
                                        {passData.map(i => (
                                            <RadioItem key={i.value} checked={isPass === i.value} onChange={() => this.radioChange(i.value)}>
                                                {i.label}<List.Item.Brief>{i.extra}</List.Item.Brief>
                                            </RadioItem>
                                        ))}
                                    </List>
                                    <div style={{ display: calm.state.isShow ? "block" : "none" }}>
                                        <List renderHeader={() => '推荐：'}>
                                            {isRecData.map(i => (
                                                <RadioItem key={i.value} checked={isRec === i.value} onChange={() => this.recChange(i.value)}>
                                                    {i.label}
                                                    {/*<List.Item.Brief>{i.extra}</List.Item.Brief>*/}
                                                </RadioItem>
                                            ))}
                                        </List>
                                        <List renderHeader={() => '置顶：'}>
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
                                            value={calm.state.textareaValue}
                                        />
                                    </List>
                                </div>
                                <div className="submitBtn">
                                    <Button type='warning' onClick={_this.submit}>提交</Button>
                                </div>

                            </div>
                            :
                            calm.state.type == 1 ?
                                <div style={{ display: calm.state.flag == 1 ? "block" : "none" }}>
                                    <div className="isDangerArea">
                                        <List renderHeader={() => '审核：'}>
                                            {passData.map(i => (
                                                <RadioItem key={i.value} checked={isPass === i.value} onChange={() => this.radioChange(i.value)}>
                                                    {i.label}<List.Item.Brief>{i.extra}</List.Item.Brief>
                                                </RadioItem>
                                            ))}
                                        </List>
                                        <List style={{ display: calm.state.isShow ? "block" : "none" }} renderHeader={() => '推荐：'}>
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
                                                value={calm.state.textareaValue}
                                            />
                                        </List>
                                    </div>
                                    <div className="submitBtn">
                                        <Button type='warning' onClick={_this.submit}>提交</Button>
                                    </div>

                                </div>
                                :
                                calm.state.type == 2 ?
                                    <div style={{ display: calm.state.flag == 1 ? "block" : "none" }}>
                                        <div className="isDangerArea">
                                            <List renderHeader={() => '审核：'}>
                                                {passData.map(i => (
                                                    <RadioItem key={i.value} checked={isPass === i.value} onChange={() => this.radioChange(i.value)}>
                                                        {i.label}<List.Item.Brief>{i.extra}</List.Item.Brief>
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
                                                    value={calm.state.textareaValue}
                                                />
                                            </List>
                                        </div>
                                        <div className="submitBtn">
                                            <Button type='warning' onClick={_this.submit}>提交</Button>
                                        </div>

                                    </div>
                                    :
                                    ""
                    }
                </div>


            </div>
        )
    }
}
