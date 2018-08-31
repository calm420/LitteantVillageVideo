import React from "react";
import { List, Radio, TextareaItem, Toast, Modal, Button, Icon } from 'antd-mobile';
import "../css/mobileEditor.less"
const RadioItem = Radio.RadioItem;
const alert = Modal.alert;
var calm;

export default class mobileEditor extends React.Component {
    constructor(props) {
        super(props);
        calm = this;
        this.state = {

        }
    }
    componentDidMount() {
        document.title = "手机编辑器";
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var id = searchArray[0].split('=')[1];
        console.log('mobileEditor')
    }




    render() {
        return (
            <div id="mobileEditor">
                <iframe id="iframe_mobile" src="https://192.168.50.186:6443/mobileEditor/" frameborder="0"></iframe>
            </div>

        )
    }
}
