import React from 'react';
import {Toast, Result, Icon} from 'antd-mobile';
import '../css/weArrPayment.less'
import {SimpleWebsocketConnection} from '../../../helpers/simple_websocket_connection'

var weArr_Payment;
window.simpleMS = null;
const myImg = src => <img src={src} className="spe am-icon am-icon-md" alt=""/>;
window.orderNoNoom = null;

/**
 * 计算两个日期字符串之间相差的天数
 * @param date1
 * @param date2
 * @returns {number}
 */
function getDays(date2) {
    var date1Str = WebServiceUtil.formatYMD(new Date().getTime()).split("-");//将日期字符串分隔为数组,数组元素分别为年.月.日
    //根据年 . 月 . 日的值创建Date对象
    var date1Obj = new Date(date1Str[0], (date1Str[1] - 1), date1Str[2]);
    var date2Str = date2.split("-");
    var date2Obj = new Date(date2Str[0], (date2Str[1] - 1), date2Str[2]);
    var t1 = date1Obj.getTime();
    var t2 = date2Obj.getTime();
    var dateTime = 1000 * 60 * 60 * 24; //每一天的毫秒数
    var minusDays = Math.floor(((t2 - t1) / dateTime));//计算出两个日期的天数差
    var days = Math.abs(minusDays);//取绝对值
    return days;
}

export default class weArrPayment extends React.Component {

    constructor(props) {
        super(props);
        weArr_Payment = this;
        this.state = {
            userId: "",
            channel: 'alipayjs',    //支付方式
            rechargeType: 1,    //消费类型
            payPrice: 0.01,   //消费金额
            successDisPlay: true,
            userData: {}
        };

    }

    componentWillMount() {
        document.title = "充值";   //设置title
        simpleMS = new SimpleWebsocketConnection();
        simpleMS.connect();
    }

    componentDidMount() {
        this.simpleListener()
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var userId = searchArray[0].split('=')[1];
        this.getLittleVideoUserById(userId)
        this.setState({
            userId
        })
    }

    /**
     * 获取用户信息
     */
    getLittleVideoUserById = (userId) => {
        var param = {
            "method": 'getLittleVideoUserById',
            "uid": userId,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {

                console.log(result, "re")
                if (result.msg == '调用成功' || result.success) {
                    if (WebServiceUtil.isEmpty(result.response) == false) {
                        this.setState({
                            userData: result.response
                        })
                    } else {
                        Toast.fail('失败,1')
                    }
                } else {
                    Toast.fail('失败,1')
                }
            },
            onError: function (error) {
                // Toast.info('获取列表失败', error);
            }
        });
    }

    /**
     * 消息监听
     */
    simpleListener() {
        simpleMS.msgWsListener = {
            onError: function (errorMsg) {

            }, onWarn: function (warnMsg) {

            }, onMessage: function (info) {
                if (info.data.command == "LITTLE_VIDEO_BUY_SUCCESS") {
                    var orderNo = info.data.order_no;
                    if (orderNo == orderNoNoom) {
                        weArr_Payment.setState({successDisPlay: false})
                    }
                }
            }
        };
    }

    /**
     * 创建小视频订单
     * @param userId 用户id
     * @param channel : wxpayqr alipayqr alipayjs wxpayjs
     * @param rechargeType '消费类型:0一月1半年2一年'
     * @param payPrice '消费金额',
     * @param rechargeEndtime  '会员充值的截止有效期',
     * @param userLocation  '购买动作发生的位置',
     * @param payType  '购买渠道:0个人1学校统一',
     * @throws Exception
     */
    createRechargeInfo = () => {
        var param = {
            "method": 'createRechargeInfo',
            "userId": this.state.userId,
            "channel": this.state.channel,
            "rechargeType": this.state.rechargeType,
            "payPrice": this.state.payPrice,
            "rechargeEndtime": '',
            "userLocation": '',
            "payType": 0,
        };

        console.log(param)
        return

        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                if (result.msg == '调用成功' || result.success) {
                    if (WebServiceUtil.isEmpty(result.response) == false) {
                        orderNoNoom = result.response.orderNo
                        $('#pay_Iframe')[0].src = result.response.payUrl
                    } else {
                        Toast.fail('失败,1')
                    }
                } else {
                    Toast.fail('失败,1')
                }
            },
            onError: function (error) {
                // Toast.info('获取列表失败', error);
            }
        });
    }

    /**
     * 改变支付方式
     * @param type
     */
    changeChannel = (type) => {
        console.log(type)
        this.setState({channel: type})
        var arr = document.getElementsByClassName('payBtn')
        for (var i = 0; i < arr.length; i++) {
            arr[i].className = 'payBtn'
            if (arr[i].id == type) {
                arr[i].className = 'payBtn payBtnClick'
            }
        }
    }

    /**
     * 改变消费类型
     * @param rechargeType
     */
    changeRechargeType = (type) => {
        console.log(type)
        if (type == 1) {
            this.setState({payPrice: 0.01})
            $(".payBall").removeClass('active')
            $('#theFirst').addClass('active')
        } else if (type == 2) {
            this.setState({payPrice: 320})
            $(".payBall").removeClass('active')
            $('#theSecond').addClass('active')
        }
        this.setState({rechargeType: type})
    }

    render() {
        var _this = this;
        return (
            <div id="weArrPayment">
                <div style={{display: this.state.successDisPlay ? 'block' : 'none', height: '100%'}}>
                    <div className='payContent'>
                        <div className='personCenter M15'>
                            <div className="topCont">
                                <div className='photoDiv'>
                                    <img
                                        className='userImg'
                                        src={this.state.userData.avatar ? this.state.userData.avatar + "?size=100x100" : ""}
                                        alt=""/>
                                    {
                                        this.state.userData.vIP ? <span
                                                className='msg vip'>{getDays(WebServiceUtil.formatYMD(this.state.userData.rechargeEndtime)) - 1}天后到期</span>
                                            :
                                            <span className='msg'>您还不是VIP会员</span>
                                    }


                                </div>
                            </div>
                            <div className='userName textOver'>{this.state.userData.userName}</div>
                        </div>
                        <div className='rechargeAmount M15'>
                            <div className='title'>充值金额<span>（购买会员后可玩转AR教材）</span></div>
                            <div className="my_flex">
                                <div id="theFirst" className='payBall active'
                                     onClick={this.changeRechargeType.bind(this, 1)}>
                                    <div>六个月</div>
                                    <span>0.01</span>元
                                </div>
                                <div id="theSecond" className='payBall' onClick={this.changeRechargeType.bind(this, 2)}>
                                    <div>一年</div>
                                    <span>320</span>元
                                </div>
                            </div>

                        </div>
                        <div className='paymentMode line_public'>
                            <div className='title M15'>支付方式</div>
                            <div className='payBtn payBtnClick'
                                 id='alipayjs'
                                 onClick={this.changeChannel.bind(this, 'alipayjs')}>支付宝支付<i></i></div>
                            <div id='wxpayjs' className='payBtn'
                                 onClick={this.changeChannel.bind(this, 'wxpayjs')}>微信支付<i></i></div>
                        </div>

                        <iframe id="pay_Iframe" src="" frameborder="0" style={{display: 'none'}}></iframe>
                    </div>
                    <div className='payConfirm'>
                        <span className='payTitle'>需支付：<span>￥</span><span className='num'>{this.state.payPrice}</span></span>
                        <span className='payNow' onClick={this.createRechargeInfo}>
                            确定支付
                        </span>
                    </div>
                </div>

                <Result
                    className={this.state.channel + " paySuccess"}
                    img={myImg(this.state.channel == "alipayjs" ? require('../img/alipay.png') : require('../img/weixin.png'))}
                    title="支付成功"
                    style={{display: !this.state.successDisPlay ? 'block' : 'none'}}
                    message={<div>{this.state.payPrice}元</div>}
                />
            </div>
        );
    }
}
