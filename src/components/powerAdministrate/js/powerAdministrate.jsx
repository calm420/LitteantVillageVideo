import React from 'react';
import {Toast, Result, Icon} from 'antd-mobile';
import '../css/powerAdministrate.less'

var power_Administrate;

export default class powerAdministrate extends React.Component {

    constructor(props) {
        super(props);
        power_Administrate = this;
        this.state = {};

    }

    componentWillMount() {
        document.title = "用户权限管理";   //设置title
    }

    componentDidMount() {
        // var locationHref = window.location.href;
        // var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        // var searchArray = locationSearch.split("&");
        // var userId = searchArray[0].split('=')[1];
        // this.getAllPowersByUserId(userId)
        // this.setState({userId})
    }

    render() {
        var _this = this;
        return (
            <div id="powerAdministrate">
                powerAdministrate
            </div>
        );
    }
}
