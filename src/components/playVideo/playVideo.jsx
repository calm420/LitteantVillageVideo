import React from "react";
import "./playVideo.less"

var calm;
export default class playVideo extends React.Component {
    constructor(props) {
        super(props);
        calm = this;
        this.state = {
            data: {}
        }
    }
    componentDidMount() {
        document.title = "有样AR微分享"
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var videoId = locationSearch.split('=')[1];
        calm.getLittleVideoById(videoId);
        this.setState({
            videoId: videoId,
        })
        var phoneType = navigator.userAgent;
        var phone;
        if (phoneType.indexOf('iPhone') > -1 || phoneType.indexOf('iPad') > -1) {
            phone = 'ios'
        } else {
            phone = 'android'
        }
        if (phone = 'android') {
            //分享逻辑
            locationSearch = locationSearch.substr(locationHref.indexOf("?") + 1);
            var searchArray = locationSearch.split("&");
            var videoId = searchArray[0].split('=')[1];
            calm.getLittleVideoById(videoId);
            this.setState({
                videoId: videoId,
            })
        } 
        if (phone = 'ios') {
            //分享逻辑
            var shareSearch = locationSearch.substr(locationSearch.indexOf("?") + 1);
            var videoId = shareSearch.split("=")[1];
            calm.getLittleVideoById(videoId);
            this.setState({
                videoId: videoId,
            })
        } 
        this.videoElement = document.getElementsByTagName('video')[0];
        this.videoElement.setAttribute('playsinline', 'true');
        this.videoElement.setAttribute('x5-playsinline', 'true');
        this.videoElement.setAttribute('webkit-playsinline', 'true');
    }

    /**
     * 获取视频对象
     */
    getLittleVideoById(videoId) {
        var param = {
            "method": 'getLittleVideoById',
            "videoId": videoId,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                if (result.msg == '调用成功' || result.success) {
                    if (WebServiceUtil.isEmpty(result.response) == false) {
                        calm.setState({
                            data: result.response
                        })
                    } else {
                        // Toast.fail('失败,1')
                    }
                } else {
                    // Toast.fail('失败,1')
                }
            },
            onError: function (error) {
                // Toast.info('获取列表失败', error);
            }
        });
    }
    /**
     * 点击播放
     */
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
            <div>
                <div id="playVideo">
                    <div className="videoHead">
                        <img className="userFace" src={calm.state.data.userInfo ? calm.state.data.userInfo.avatar : ""} alt="" />
                        <div className="userMessage">
                            <div className="userName text_hidden">{calm.state.data.userInfo ? calm.state.data.userInfo.userName : ""}</div>
                            <div className="userinfo text_hidden">{calm.state.data.videoContent}</div>
                        </div>
                    </div>
                    <div className="videoCont">
                        <video
                            className="videoDiv empty_center"
                            src={calm.state.data.videoPath}
                            poster={calm.state.data.coverPath}
                            controls
                            autoPlay
                            x5-playsinline="true"
                            playsinline="true"
                            webkit-playsinline="true"
                            controlslist="nodownload nofullscreen"
                            webkit-playsinline="true"
                        >
                        </video>
                    </div>
                    <div className="download_box">
                        <div className='download_img_box'>
                            <img className="download_img" src={require("./images/youyangLogo.png")} alt="" />
                        </div>
                        <div className="download_describe">
                            <p className="downloadTitle">有样AR微分享</p>
                            <p className="downloadIntro">据说下载的人都变成学霸了！</p>
                        </div>
                        <div className="download_button" onClick={calm.Load}>去下载</div>
                    </div>
                </div>
            </div>

        )
    }
}

