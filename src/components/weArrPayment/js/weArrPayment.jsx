import React from 'react';
import {Toast, Result, Icon} from 'antd-mobile';
import '../css/weArrPayment.less'
import {SimpleWebsocketConnection} from '../../../helpers/simple_websocket_connection'

var weArr_Payment;
window.simpleMS = null;
const myImg = src => <img src={src} className="spe am-icon am-icon-md" alt=""/>;
window.orderNoNoom = null;

export default class weArrPayment extends React.Component {

    constructor(props) {
        super(props);
        weArr_Payment = this;
        this.state = {
            userId: 23836,
            channel: 'alipayjs',    //支付方式
            rechargeType: 0,    //消费类型
            payPrice: 25,   //消费金额
            successDisPlay: true
        };

    }

    componentWillMount() {
        document.title = "充值";   //设置title
        simpleMS = new SimpleWebsocketConnection();
        simpleMS.connect();
    }

    componentDidMount() {
        this.simpleListener()
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
        if (type == 0) {
            this.setState({payPrice: 25})
        } else if (type == 1) {
            this.setState({payPrice: 80})
        } else if (type == 2) {
            this.setState({payPrice: 150})
        }
        this.setState({rechargeType: type})
    }

    render() {

        var _this = this;

        return (
            <div id="weArrPayment">
                <div className='payContent' style={{display: this.state.successDisPlay ? 'block' : 'none'}}>
                    <div className='personCenter'>
                        <div>
                            <img
                                className='userImg'
                                src="http://60.205.86.217/upload6/2018-02-09/19/805eee4a-b707-49a2-9c75-d5b14ed9227b.jpg?size=100x100"
                                alt=""/>
                            <span className='userName'>brotherXu</span>
                            <span className='userName'>13天后到期</span>
                        </div>
                        <h5>购买会员后可玩转AR</h5>
                    </div>
                    <div className='rechargeAmount'>
                        <div className='payBall' onClick={this.changeRechargeType.bind(this, 0)}>
                            <span>1个月</span>
                            <span>25元</span>
                        </div>
                        <div className='payBall' onClick={this.changeRechargeType.bind(this, 1)}>
                            <span>6个月</span>
                            <span>80元</span>
                        </div>
                        <div className='payBall' onClick={this.changeRechargeType.bind(this, 2)}>
                            <span>1年</span>
                            <span>150元</span>
                        </div>
                    </div>
                    <div className='paymentMode'>
                        请选择支付方式
                        <span className='payBtn payBtnClick'
                              id='alipayjs'
                              onClick={this.changeChannel.bind(this, 'alipayjs')}>支付宝支付</span>
                        <span id='wxpayjs' className='payBtn'
                              onClick={this.changeChannel.bind(this, 'wxpayjs')}>微信支付</span>
                    </div>
                    <div className='payNow' onClick={this.createRechargeInfo}>
                        立即充值
                    </div>

                    <iframe id="pay_Iframe" src="" frameborder="0" style={{display: 'none'}}></iframe>
                </div>

                <Result
                    className='paySuccess'
                    img={myImg('https://gw.alipayobjects.com/zos/rmsportal/pdFARIqkrKEGVVEwotFe.svg')}
                    title="支付成功"
                    style={{display: !this.state.successDisPlay ? 'block' : 'none'}}
                    message={<div>{this.state.payPrice}元</div>}
                />
            </div>
        );
    }
}
