import React from 'react';
import {Toast} from 'antd-mobile';
import '../css/userAdministration.less'

var user_Administration;

const myImg = src => <img src={`https://gw.alipayobjects.com/zos/rmsportal/${src}.svg`} className="am-icon am-icon-xs"
                          alt=""/>;

export default class userAdministration extends React.Component {

    constructor(props) {
        super(props);
        user_Administration = this;
        this.state = {};

    }

    componentWillMount() {
        document.title = "权限管理";   //设置title
    }

    componentDidMount() {
        // var locationHref = window.location.href;
        // var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        // var searchArray = locationSearch.split("&");
        // var userId = searchArray[0].split('=')[1];
    }

    render() {
        var _this = this;
        return (
            <div id="userAdministration">
                userAdministration
            </div>
        );
    }
}
