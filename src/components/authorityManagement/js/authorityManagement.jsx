import React from 'react';
import {Toast, Result, Icon} from 'antd-mobile';
import '../css/authorityManagement.less'

var authority_Management;

export default class authorityManagement extends React.Component {

    constructor(props) {
        super(props);
        authority_Management = this;
        this.state = {

        };

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
            <div id="authorityManagement">
                authorityManagement
            </div>
        );
    }
}
