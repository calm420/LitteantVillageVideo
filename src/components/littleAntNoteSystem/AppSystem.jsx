import React from 'react';
import {Drawer, NavBar, Radio, Toast, Modal} from 'antd-mobile';

import './AppSystem.less'
import List from './leftComponent/js/List'
import ReadPanel from './rightComponent/js/ReadPanel'

var _this;
const alert = Modal.alert;
export default class AppSystem extends React.Component {
    constructor(props) {
        super(props);
        _this = this;
        this.state = {
            title: 'app',
            open: false,
            user: JSON.parse(sessionStorage.getItem("loginUser")),
            clientHeight: document.body.clientHeight,
            maskFlag: false,
        };
    }

    componentWillMount() {
        //mobile项目全局禁用原生下拉刷新
        Bridge.setRefreshAble("false");
        if (this.state.user) {

        } else {
            location.hash = "Login";
        }

    }

    submit = (type, id) => {
        this.refs.listByNoom.accept(type, id)
    }

    submitForList = (type, data) => {
        console.log(data, 'in AppSystem');
        this.refs.listToReadPanel.accept(type, data)
    }

    /**
     * 重新审核弹出框
     */
    showAlert = (event) => {
        event.stopPropagation()
        var phoneType = navigator.userAgent;
        var phone;
        if (phoneType.indexOf('iPhone') > -1 || phoneType.indexOf('iPad') > -1) {
            phone = 'ios'
        } else {
            phone = 'android'
        }
        var _this = this;
        const alertInstance = alert('您确定退出登录吗?', '', [
            {text: '取消', onPress: () => console.log('cancel'), style: 'default'},
            {text: '确定', onPress: () => _this.exit()},

        ], phone);
    }

    exit() {
        sessionStorage.removeItem("loginUser");
        location.hash = "Login"
    }

    setPanel(key, html) {
        console.log(key);
        console.log(html);
        if (key == 'openPrieview') {
            _this.setState({
                maskFlag: true,
                label: html,
            })
        }
        console.log(_this.state.maskFlag)
    }

    closeMask() {
        _this.setState({
            maskFlag: false
        })
    }

    render() {
        var _this = this;
        return (
            <div id="AppSystem">
                {/*顶部banner*/}
                <NavBar
                    mode="dark"
                    leftContent="校园自媒体"
                    rightContent={[
                        <img className="headPic" src={this.state.user.avatar} alt=""/>,
                        <div className="userName">{this.state.user.userName}</div>,
                        <div className="user_line"></div>,
                        <div className="cancellation"><i className="user_exit"></i><span
                            onClick={_this.showAlert}>退出</span></div>,
                    ]}
                >
                    {/*<div className="logo">校园自媒体</div>*/}
                    {/*<div className="userInfo">*/}
                    {/*<div className="headPic_box">*/}
                    {/*<img className="headPic" src={this.state.user.pic} alt=""/>*/}
                    {/*</div>*/}
                    {/*<div className="userName">{this.state.user.name}</div>*/}
                    {/*<div className="cancellation">退出</div>*/}
                    {/*</div>*/}
                </NavBar>
                <div className="black_bg" style={
                    this.state.maskFlag ? {display: 'inline-block'} : {display: 'none'}
                } onClick={this.closeMask}></div>
                <div className="preview" style={
                    this.state.maskFlag ? {display: 'inline-block'} : {display: 'none'}
                } dangerouslySetInnerHTML={{
                    __html: this.state.label
                }}></div>
                <div id='main'>
                    <div className="left">
                        <List
                            ref='listByNoom'
                            submit={this.submitForList}
                        />
                    </div>
                    <div className="right" style={{height: this.state.clientHeight - 54}}>
                        <ReadPanel
                            submit={this.submit}
                            ref='listToReadPanel'
                            setPanel={this.setPanel}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
