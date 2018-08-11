import React from 'react';
import { Button, Toast } from 'antd-mobile';


/**
 * 二维码过渡页
 */
export default class LoginScanner extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '欢迎登录小蚂蚁平台',
            open: false,
            accessUser: '',
        };
    }

    componentWillMount() {
        //mobile项目全局禁用原生下拉刷新
        document.title = "欢迎登录小蚂蚁平台";
        Bridge.setRefreshAble("true");
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var uuid = searchArray[0].split('=')[1];
        var accessUser = searchArray[1].split('=')[1];
        console.log(accessUser, "access");
        this.setState({ uuid, accessUser });
    }

    /**
     * 二维码登录
     */
    allowLoginLittleVideoSystem = () => {
        console.log(this.state.accessUser);
        var param = {
            "method": 'allowLoginLittleVideoSystem',
            /* "uuid": this.state.uuid,
             "uid": this.state.uid*/
            "uuid": this.state.uuid,
            "uid": this.state.accessUser
        };

        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                if (result.success) {
                    Toast.info("登录成功", 3);

                    setTimeout(function () {
                        var data = {
                            method: 'end',
                        };
                        Bridge.callHandler(data, null, function (error) {
                            console.log(error);
                        });
                    }, 500)


                } else {
                    Toast.fail("登录失败");
                }
            },
            onError: function (error) {
                Toast.fail(error, 1);
            }
        });
    }

    render() {
        return (
            <div className="container">
                <div style={{ width: '100%', position: 'absolute', left: '0', top: '50%', marginTop: '-44px' }}>
                    <div style={{ color: '#333', fontSize: '16px', paddingBottom: '25px', textAlign: 'center' }}>有样：AR微分享学习平台登录</div>
                    <Button style={{ width: '250px', margin: '0 auto' }} type='warning' onClick={this.allowLoginLittleVideoSystem}>登录</Button>
                </div>
            </div>
        );
    }
}
