import React from "react";
import { List, Radio, TextareaItem, Toast, Modal, Button } from 'antd-mobile';
import "../css/AlreadylookThroughDetail.less"

const RadioItem = Radio.RadioItem;
const alert = Modal.alert;
var calm;
export default class AlreadylookThroughDetail extends React.Component {
    constructor(props) {
        super(props);
        calm = this;
        this.state = {
            isPass: 0,
            data: {},
            flag: 0,
            textareaValue: ""
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
        this.setState({
            isPass: value,
        });
    };

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
        var param = {
            "method": 'updateAUditInfo',
            "auditInfoJson": {
                auditId:calm.state.auditId,
                targetId: calm.state.id,
                targetType: calm.state.type,
                isPass: calm.state.isPass,
                auditMark: calm.state.textareaValue,
                auditorId: 3
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
                console.log(result)
                if (result.success) {
                    calm.setState({
                        data: result.response,
                        textareaValue:result.response.auditInfo ? result.response.auditInfo.auditMark : ""
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
        const data2 = [
            { value: 0, label: '通过' },
            { value: 1, label: '不通过' },
        ];
        const { isPass } = this.state;
        return (
            <div id="alreadyLookThrough" style={{
                height: document.body.clientHeight
            }}>
                {
                    calm.state.type == 0 ?
                        <div  className="content">
                            {
                                calm.state.data.articleInfo ?
                                    <div>
                                        <img style={{width:"50px",height:"50px"}} src={calm.state.data.articleInfo.userInfo.avatar} alt=""/>
                                        <div>类型：自媒体文章</div>
                                        <div>标题：{calm.state.data.articleInfo.articleTitle}</div>
                                        <div>作者：{calm.state.data.articleInfo.userInfo ? calm.state.data.articleInfo.userInfo.userName : ""}</div>
                                        <div>上传时间：{WebServiceUtil.formatAllTime(calm.state.data.articleInfo.createTime)}</div>
                                        <div>内容：{calm.state.data.articleInfo.articleContent}</div>
                                        <div>审核人：{calm.state.data.auditInfo.auditorUser ? calm.state.data.auditInfo.auditorUser.userName : ""}</div>
                                        <div>审核时间：{WebServiceUtil.formatAllTime(calm.state.data.auditInfo.auditingTime)}</div>
                                        <div>审核说明：{calm.state.data.auditInfo.auditMark}</div>
                                        <div>审核结果：{calm.state.data.auditInfo.isPass == 0 ? "通过" : "未通过"}</div>
                                    </div>
                                    :
                                    ""

                            }

                        </div>
                        :
                        calm.state.type == 1 ?
                            <div  className="content">
                                {
                                    calm.state.data.littleVideoInfo ?
                                        <div>
                                            <img style={{width:"50px",height:"50px"}} src={calm.state.data.littleVideoInfo.userInfo.avatar} alt=""/>
                                            <div>类型：短视频</div>
                                            <div>作者：{calm.state.data.littleVideoInfo.userInfo.userName}</div>
                                            <div>上传时间：{WebServiceUtil.formatAllTime(calm.state.data.littleVideoInfo.createTime)}</div>
                                            <div>内容：
                                                <video 
                                                    style={{width:"100%"}}
                                                    controls="controls" 
                                                    preload="auto"  
                                                    src={calm.state.data.littleVideoInfo.videoPath} 
                                                    autoPlay>
                                                </video>
                                            </div>
                                            <div>审核人：{calm.state.data.auditInfo.auditorUser ? calm.state.data.auditInfo.auditorUser.userName : ""}</div>
                                            <div>审核时间：{WebServiceUtil.formatAllTime(calm.state.data.auditInfo.auditingTime)}</div>
                                            <div>审核说明：{calm.state.data.auditInfo.auditMark}</div>
                                            <div>审核结果：{calm.state.data.auditInfo.isPass == 0 ? "通过" : "未通过"}</div>
                                        </div>
                                        :
                                        ""

                                }

                            </div>
                            :
                            ""
                }
                <div className="submitBtn" style={{ display: calm.state.flag == 0 ? "block" : "none" }}>
                    <Button type='warning' onClick={calm.showAlert}>重新审核</Button>
                </div>
                <div style={{ display: calm.state.flag == 1 ? "block" : "none" }}>
                    <div className="isDangerArea">
                        <List renderHeader={() => '审核：'}>
                            {data2.map(i => (
                                <RadioItem key={i.value} checked={isPass === i.value} onChange={() => this.radioChange(i.value)}>
                                    {i.label}<List.Item.Brief>{i.extra}</List.Item.Brief>
                                </RadioItem>
                            ))}
                        </List>
                    </div>
                    <div className="content">审核说明:
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
            </div>
        )
    }
}
