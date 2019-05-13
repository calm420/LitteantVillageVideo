import React from "react";
import {ListView, PullToRefresh, Toast} from 'antd-mobile';

var calm;
export default class VillageCardSystemHome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    componentDidMount() {
        Bridge.setShareAble("false");
        document.title = "后台管理系统"
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var auditorId = searchArray[0].split('=')[1];
       
    }

    render() {

        return (
            <div id="myCollection" style={{
                height: document.body.clientHeight
            }}>
            tyuio
            </div>
        )
    }
}