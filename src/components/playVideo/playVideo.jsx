import React from "react";
import "./playVideo.less"

export default class playVideo extends React.Component{
    constructor(props){
        super(props);
        this.state = {
        }
    }
    componentDidMount(){
        document.title = "视频播放"
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        if(locationSearch.indexOf("?") == -1){  //正常逻辑
            var searchArray = locationSearch.split("&");
            var url = searchArray[0].split('=')[1];
            this.setState({
                url: url,
            })
        }else{   //分享逻辑
            locationSearch = locationSearch.substr(locationHref.indexOf("?") + 1);
            var searchArray = locationSearch.split("&");
            var url = searchArray[0].split('=')[1];
            this.setState({
                url: url,
            })
        }
    }
    render(){
        return (
            <div id="playVideo">
                <video className="videoDiv" autoPlay src={this.state.url} controls="controls"></video>
            </div>
        )
    }
}