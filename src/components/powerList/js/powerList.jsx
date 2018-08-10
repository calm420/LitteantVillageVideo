import React from 'react';
import {Toast, Result, Icon} from 'antd-mobile';
import '../css/powerList.less'

var power_List;

export default class powerList extends React.Component {

    constructor(props) {
        super(props);
        power_List = this;
        this.state = {
            userId: "",
        };

    }

    componentWillMount() {
        document.title = "充值";   //设置title
    }

    componentDidMount() {
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var userId = searchArray[0].split('=')[1];
        this.getAllPowersByUserId(userId)
        this.setState({userId})
    }

    getAllPowersByUserId(userId) {
        var _this = this;
        var param = {
            "method": 'getAllPowersByUserId',
            "userId": userId,
            "pageNo": -1,
        };

        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {

                if (result.msg == '调用成功' && result.success == true) {
                    if (result.response.length != 0) {
                        _this.buildList(result.response)
                    }
                } else {
                    Toast.fail(result.msg)
                }

            },
            onError: function (error) {
                Toast.fail(error, 1);
            }
        });
    }

    /**
     * // 权限id
     private long powerId;
     // 权限名称
     private String powerName;
     // 权限图标路径
     private String iconUrl;
     // 权限对应功能的路径
     private String powerUrl;
     // 是否已删除
     private int isDelete;
     * @param data
     */
    buildList(data) {
        var arr = [];
        data.forEach(function (v, i) {
            console.log(v);
            arr.push(<li key={v.powerId} onClick={power_List.listOnClick.bind(this, v.powerUrl)}>
                <img src={v.iconUrl} alt=""/>
                <span className='textOver'>{v.powerName}</span>
            </li>)
        })
        this.setState({listArr: arr});
    }

    listOnClick(src) {

        console.log(src);

        var url = src + '&ident=' + power_List.state.userId;
        var data = {
            method: 'openNewPage',
            url: url
        };
        Bridge.callHandler(data, null, function (error) {
            window.location.href = url;
        });
    }

    render() {
        var _this = this;
        return (
            <div id="powerList">
                <div className="my_flex listCont">
                     {this.state.listArr}
                </div>
            </div>
        );
    }
}
