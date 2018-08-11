import React from 'react';
import './Login.less'
import {SimpleWebsocketConnection} from '../../helpers/simple_websocket_connection';

window.simpleMS=null;
var machineId=null;
export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: 'app',
            open: false,
            loginImg:''
        };
    }

    componentWillMount() {
        //mobile项目全局禁用原生下拉刷新
        Bridge.setRefreshAble("false");
        simpleMS = new SimpleWebsocketConnection();
        simpleMS.connect();
        machineId = this.createMachineId();
        console.log("machineId==>"+machineId)
    }

    componentDidMount(){
        var _this = this;
        _this.getLoginLittleVideoSystemEwm();
        simpleMS.msgWsListener = {
            onError: function (errorMsg) {

            }, onWarn: function (warnMsg) {

            }, onMessage: function (info) {
                var command = info.command;
                console.log("command===>"+command);
                if (WebServiceUtil.isEmpty(command) == false && command == "allowLoginLittleVideoSystem") {
                    var data = info.data;
                    var uuid = data.uuid;
                    var user = data.user;
                    if(WebServiceUtil.isEmpty(sessionStorage.getItem("loginUser"))){
                        sessionStorage.setItem("loginUser",JSON.stringify(user));
                    }
                    location.hash="AppSystem";
                    /*if(uuid == machineId){
                        location.hash="AppSystem";
                    }*/
                    console.log("data==============>"+data);
                }
            }
        };
    }

    getLoginLittleVideoSystemEwm=()=>{
        var _this = this;
        var param = {
            "method": 'getLoginLittleVideoSystemEwm',
            "uuid":machineId,
        };

        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                if (result.success) {
                    var response = result.response;
                    var loginImg = <img src={response}/>;
                    _this.setState({loginImg});
                } else {
                    Toast.fail("登录失败");
                }
            },
            onError: function (error) {
                Toast.fail(error, 1);
            }
        });
    }

    createMachineId() {
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";

        var uuid = s.join("");
        return uuid;
    }

    render() {
        return (
            <div id="Login">
                <div className="ThinkChange_cont empty_center">
                    <div className="ThinkChange">{this.state.loginImg}</div>
                    <div className="ThinkChange_text">扫码登录</div>
                </div>
                
            </div>
        );
    }
}
