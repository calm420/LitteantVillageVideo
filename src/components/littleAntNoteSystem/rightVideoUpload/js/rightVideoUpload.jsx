import React from 'react';
import {ImagePicker, InputItem, Toast} from 'antd-mobile';
import '../css/rightVideoUpload.less';
var _this;
export default class rightVideoUpload extends React.Component {
    constructor(props) {
        super(props);
        var loginUserStr = sessionStorage.getItem("loginUser");
        var loginUser = JSON.parse(loginUserStr);
        _this = this;
        this.state = {
            writeFlag: false,
            userId: loginUser.uid,
            // user:JSON.parse(sessionStorage.getItem("loginUser"))
        };
    }

    componentDidMount() {

    }


    componentWillMount() {

    }

    //接受消息
    onMessage(e) {

    }

    createVideo(){
        console.log('创建小视频，改变flag显示iframe窗口')
        this.setState({
            writeFlag: true,
        })
    }


    render() {
        return (
            <div id="rightVideoUpload">
                <div className="click_head" style={!this.state.writeFlag ? {display: 'block'} : {display: "none"}}>
                    点击 "<a onClick={this.createVideo.bind(this)}>添加小视频</a>"，创建一个小视频
                </div>

                <div className="write_article" style={this.state.writeFlag ? {display: 'block'} : {display: "none"}}>
                    <iframe id="iframe_box" src={"http://192.168.50.186:8094/#/addUploadVideo?ident="+this.state.userId} frameborder="0"></iframe>
                </div>


            </div>
        );
    }
}
