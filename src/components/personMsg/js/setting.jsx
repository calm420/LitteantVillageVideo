import React from "react";
import {
    Toast, Modal, Popover, NavBar, Icon
} from 'antd-mobile';
import '../css/personMsg.less'
const Item = Popover.Item;
const alert = Modal.alert;
var calm;
export default class setting extends React.Component {
    constructor(props) {
        super(props);
        calm = this;
        this.state = {
        }
    }
    componentWillReceiveProps () {
        window.addEventListener('resize', this.onWindwoResize);
    }
    componentDidMount () {
        document.title = "设置";
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var userId = searchArray[0].split('=')[1];
        calm.setState({
            userId
        })

    }


    /**
    * 退出弹出框
    */
    showAlertLogout = (event) => {
        event.stopPropagation();
        var phoneType = navigator.userAgent;
        var phone;
        if (phoneType.indexOf('iPhone') > -1 || phoneType.indexOf('iPad') > -1) {
            phone = 'ios'
        } else {
            phone = 'android'
        }
        const alertInstance = alert('您确定退出登录吗?', '', [
            { text: '取消', onPress: () => console.log('cancel'), style: 'default' },
            { text: '确定', onPress: () => this.logout() },
        ], phone);
    };


    //退出登录
    logout = () => {
        var data = {
            method: 'loginout',
        };
        console.log(data, "data")
        Bridge.callHandler(data, null, function (error) {
        });
    }
    //清除缓存
    toClearCache = () => {
        var data = {
            method: 'clearCache',
        };
        console.log(data, "data")
        Bridge.callHandler(data, null, function (error) {
        });
    }

    //返回
    toBack = () => {
        var data = {
            method: 'popView',
        };
        Bridge.callHandler(data, null, function (error) {
        })
    }

    //跳转个人中心设置页面
    toPCenter = () => {
        var url = WebServiceUtil.mobileServiceURL + "personMsg?userid=" + this.state.userId;
        var data = {
            method: 'openNewPage',
            url: url
        };
        Bridge.callHandler(data, null, function (error) {
            window.location.href = url;
        });
    }
    

    render () {
        return (
            <div id="setting" className='bg_white' >
                <div className="p20"></div>
                <div className="topNav">
                    <i className='icon_back'></i>
                    完善资料
                </div>
                <div className="grayBorder"></div>
                <div className='commonLocation-cont'>
                    <div className='am-list-item am-list-item-middle line_public15 activeDiv' onClick={this.toPCenter}>
                        <div className="am-list-line">
                            <div className="am-list-content">完善资料</div>
                            <div className="am-list-extra"></div>
                            <div className="am-list-arrow am-list-arrow-horizontal"></div>
                        </div>
                    </div>
                 
                    <div className='am-list-item am-list-item-middle line_public15'>
                        <div className="am-list-line">
                            <div className="am-list-content">版本信息</div>
                            <div className="am-list-extra">{this.state.version}</div>
                        </div>
                    </div>
                    <div onClick={this.toClearCache} className='am-list-item am-list-item-middle activeDiv'>
                        <div className="am-list-line">
                            <div className="am-list-content">清除缓存</div>
                            <div className="am-list-extra"></div>
                        </div>
                    </div>
                    {/* <div className='am-list-item am-list-item-middle line_public activeDiv'>
                        <div className="am-list-line">
                            <div className="am-list-content">关于</div>
                            <div className="am-list-extra"></div>
                        </div>
                    </div> */}
                    <div className='submitBtn_gradient' onClick={this.showAlertLogout}><span>退出登录</span></div>
                </div>
            </div>
        )
    }



}



