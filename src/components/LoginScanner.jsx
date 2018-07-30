import React from 'react';
import {Button,Toast} from 'antd-mobile';

/**
 * 二维码过渡页
 */
export default class LoginScanner extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '欢迎登录小蚂蚁平台',
            open: false,
        };
    }

    componentWillMount() {
        //mobile项目全局禁用原生下拉刷新
        document.title="欢迎登录小蚂蚁平台";
        Bridge.setRefreshAble("false");
    }

    /**
     * 二维码登录
     */
    allowLoginLittleVideoSystem=()=>{
        var param = {
            "method": 'allowLoginLittleVideoSystem',
           /* "uuid": this.state.uuid,
            "uid": this.state.uid*/
            "uuid": "8330bdee-149a-40aa-8329-a63c8aa305fd",
            "uid": 1
        };

        WebServiceUtil.requestArPaymentApi(JSON.stringify(param), {
            onResponse: result => {
                if (result.success) {
                    Toast.fail("登录成功");
                    var data = {
                        method: 'finish',
                    };

                    Bridge.callHandler(data, null, function (error) {
                        console.log(error);
                    });

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
                <Button onClick={this.allowLoginLittleVideoSystem}>登录</Button>
            </div>
        );
    }
}
