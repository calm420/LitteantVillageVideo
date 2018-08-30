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
            vId: null,
            // user:JSON.parse(sessionStorage.getItem("loginUser"))
        };
    }

    componentDidMount() {
        //监听postmessage消息接受
        window.addEventListener('message', (e) => {
            this.onMessage(e);
        })
    }


    componentWillMount() {

    }

    //接受消息
    onMessage(e) {
        console.log(e, '接受到的postmessage')
        var iframeData = JSON.parse(e.data);
        switch(iframeData.method){
            case '发布成功':
                console.log('调用了发布成功');
                _this.setState({
                    writeFlag: false,
                })
                Toast.info('发布成功',1);
                this.props.submitInVideo('refresh');
                break;
        }
    }

    createVideo() {
        console.log('创建小视频，改变flag显示iframe窗口')
        this.setState({
            writeFlag: true,
        })
    }

    //接受来自list => appSystem 的消息
    accept(type, data) {
        switch (type) {
            case "编辑":
                console.log(data);
                this.setState({
                    writeFlag: true,
                    vId: data,
                });
                break;
            case "删除":
                if (data == this.state.artId) {
                    this.setState({
                        writeFlag: false,
                        vId: null,
                    })
                } else {
                    console.log('删除的不是编辑状态的');
                }
                break;
        }
    }


    render() {
        return (
            <div id="rightVideoUpload">
                <div className="click_head" style={!this.state.writeFlag ? {display: 'block'} : {display: "none"}}>
                    点击 "<a onClick={this.createVideo.bind(this)}>添加小视频</a>"，创建一个小视频
                </div>

                <div className="write_article" style={this.state.writeFlag ? {display: 'block'} : {display: "none"}}>
                    <div style={
                        this.state.vId ? {display: 'none'} : {display: 'block'}
                    }>
                        <iframe id="iframe_box"
                                src={"http://192.168.50.186:8094/#/addUploadVideo?ident=" + this.state.userId}
                                frameborder="0"></iframe>
                    </div>
                    <div style={
                        this.state.vId ? {display: 'block'} : {display: 'none'}
                    }>
                        <iframe id="iframe_box"
                                src={"http://192.168.50.186:8094/#/updateVideo?ident=" + this.state.userId + "&vId=" + this.state.vId}
                                frameborder="0"></iframe>
                    </div>
                </div>


            </div>
        );
    }
}
