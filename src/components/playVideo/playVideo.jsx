import React from "react";
import "./playVideo.less"

var calm;
export default class playVideo extends React.Component {
    constructor(props) {
        super(props);
        calm = this;
        this.state = {
        }
    }
    componentDidMount() {
        document.title = "视频播放"
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var phoneType = navigator.userAgent;
        var phone;
        if (phoneType.indexOf('iPhone') > -1 || phoneType.indexOf('iPad') > -1) {
            phone = 'ios'
        } else {
            phone = 'android'
        }
        console.log(phone, "ppp")
        if (phone = 'android') {
            //分享逻辑
            locationSearch = locationSearch.substr(locationHref.indexOf("?") + 1);
            var searchArray = locationSearch.split("&");
            var url = searchArray[0].split('=')[1];
            this.setState({
                url: url,
            })
        } 
        if (phone = 'ios') {
            //分享逻辑
            shareSearch = locationSearch.substr(locationHref.indexOf("?") + 1);
            alert(JSON.stringify(shareSearch))

            var searchArray = locationSearch.split("&");
            var url = searchArray[0].split('=')[1];
            this.setState({
                url: url,
            })
        }
    }
    Load = (event) => {
        event.stopPropagation()
        var phoneType = navigator.userAgent;
        var phone;
        if (phoneType.indexOf('iPhone') > -1 || phoneType.indexOf('iPad') > -1) {
            phone = 'ios'
        } else {
            phone = 'android'
        }
        if (phone == 'ios') {
            window.location.href = "https://itunes.apple.com/cn/app/apple-store/id1423189213?mt=8";
        } else if (phone == 'android') {
            window.location.href = "http://60.205.86.217/upload7_app/2018-08-28/14/e9c3c09b-f9da-4d7e-8ad3-b810d17a1bf8.apk";
        }
    }
    render() {
        return (
            <div id="playVideo">
                <video
                    className="videoDiv"
                    src={this.state.url}
                    controls="controls"
                    webkit-playsinline
                    playsinline
                    x5-playsinline
                    x-webkit-airplay="allow"
                ></video>
                <span onClick={calm.Load}>下载</span>
            </div>
        )
    }
}