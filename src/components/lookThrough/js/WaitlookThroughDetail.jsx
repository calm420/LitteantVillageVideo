import React from "react";
import { List, Radio, TextareaItem, Toast, Button } from 'antd-mobile';
import "../css/WaitlookThroughDetail.less"
const RadioItem = Radio.RadioItem;
var calm;

export default class WaitlookThroughDetail extends React.Component {
    constructor(props) {
        super(props);
        calm = this;
        this.state = {
            isPass: 0,
            data: {
            }
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
            id, type,auditorId
        })
        if (type == 0) {
            calm.getArticleInfoById(id)

        } else if (type == 1) {
            calm.getLittleVideoById(id)
        }else if (type == 2){
            calm.getDiscussInfoById(id)
        }
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
    getDiscussInfoById(id){
        var param = {
            "method": 'getDiscussInfoById',
            "discussId": id,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {

                console.log(result,"pppl")
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
        this.setState({
            isPass: value,
        });
    };

    /**
     * 点击提交按钮
     */
    submit() {
        var param = {
            "method": 'saveAuditInfo',
            "auditInfoJson": {
                targetId: calm.state.id,
                targetType: calm.state.type,
                isPass: calm.state.isPass,
                auditMark: calm.state.textareaValue,
                auditorId: calm.state.auditorId
            },
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
                // Toast.fail(error, 1);
            }
        });
    }
    render() {
        var _this = this;
        const data2 = [
            { value: 0, label: '通过' },
            { value: 1, label: '不通过' },
        ];
        const { isPass } = this.state;
        return (
            <div id="waitLookThrough" style={{
                height: document.body.clientHeight
            }}>
                <div className="content">
                    {
                        calm.state.type == 0 ?
                            <div className="sameBack">
                                <div className='title'>{calm.state.data.articleTitle}</div>
                                <div className='topMsg'>
                                    <img className="photo" src={calm.state.data.userInfo ? calm.state.data.userInfo.avatar : ""} alt=""/>
                                    <span className='author'>{calm.state.data.userInfo ? calm.state.data.userInfo.userName : ""}</span>
                                    <span className='time'>{WebServiceUtil.formatYMD(calm.state.data.createTime)}</span>
                                    <span className="type">{/*类型：自媒体文章*/}<img src={require("../img/icon_media.png")}/></span>
                                </div>
                                <div className='textCont' dangerouslySetInnerHTML={{ __html: calm.state.data.articleContent }}></div>
                            </div>
                            :
                            calm.state.type == 1 ?
                                <div className="sameBack">
                                     <div className='topMsg'>
                                        <img className="photo" src={calm.state.data.userInfo ? calm.state.data.userInfo.avatar:""} alt=""/>
                                        <span className='author'>{calm.state.data.userInfo ? calm.state.data.userInfo.userName : ""}</span>
                                        <span className='time'>{WebServiceUtil.formatYMD(calm.state.data.createTime)}</span>
                                        <span className="type">{/*类型：短视频*/}<img src={require("../img/icon_video.png")}/></span>
                                     </div>
                                     <div className="textCont">
                                        <video
                                            controls="controls"
                                            preload="auto"
                                            style={{objectFit: "fill",width:"100%"}}
                                            src={calm.state.data.videoPath}>
                                        </video>
                                    </div>
                                </div>
                                :
                                calm.state.type == 2 ?
                            <div className="sameBack">
                                <img style={{width:"50px",height:"50px"}} src={calm.state.data.userInfo ? calm.state.data.userInfo.avatar:""} alt=""/>
                                <div>类型：评论</div>
                                <div>作者：{calm.state.data.discussUser ? calm.state.data.discussUser.userName : ""}</div>
                                <div>上传时间：{WebServiceUtil.formatYMD(calm.state.data.createTime)}</div>
                                <div>内容：
                                {calm.state.data.discussContent}
                                </div>
                            </div>
                            :""
                            
                }
                
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
                            />

                    </List>
                    </div>
                </div>
                <div className="submitBtn">
                    <Button type='warning' onClick={_this.submit}>提交</Button>
                </div>

            </div>

        )
    }
}
