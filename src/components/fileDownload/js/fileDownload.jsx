import React from 'react';
import {} from 'antd-mobile';
import '../css/fileDownload.less'

export default class Demo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            phone: 'IOS'
        };
    }

    componentDidMount() {
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var fileType = searchArray[0].split('=')[1]
        this.setState({fileType})
        var phoneType = navigator.userAgent;
        if (phoneType.indexOf('iPhone') > -1 || phoneType.indexOf('iPad') > -1) {
            this.setState({phone: 'IOS'})
        } else {
            this.setState({phone: 'Android'})
        }
        this.buildTitle(fileType)
    }

    buildTitle(fileType) {
        if (fileType == 'youyang') {
            var titleDiv = <div>
                <div>有样</div>
                <div>AR微分享学习平台</div>
            </div>
        } else if (fileType == 'littleAntTe') {
            var titleDiv = <div>
                <div>小蚂蚁.教师端</div>
                <div>科技改变未来,教育成就未来</div>
            </div>
        } else if (fileType == 'littleAntSt') {
            var titleDiv = <div>
                <div>小蚂蚁.学生端</div>
                <div>科技改变未来,教育成就未来</div>
            </div>
        } else if (fileType == 'littleAntFa') {
            var titleDiv = <div>
                <div>小蚂蚁.家长端</div>
                <div>科技改变未来,教育成就未来</div>
            </div>
        } else if (fileType == 'elearning') {

        }
        this.setState({titleDiv})
    }

    downLoadFile = () => {
        console.log(this.state.fileType);
        console.log(this.state.phone);
        // window.open('http://60.205.86.217/upload7_app/2018-08-23/20/5e2c5613-5a3d-48ce-8152-8fc64cef03b0.apk')
    }

    render() {
        return (
            <div id='fileDownload'>
                <img
                    src="http://60.205.86.217/upload6/2018-02-09/19/805eee4a-b707-49a2-9c75-d5b14ed9227b.jpg?size=100x100"
                    alt=""/>
                {this.state.titleDiv}
                <div onClick={this.downLoadFile}>免费下载{this.state.phone}版</div>
                <img
                    src="http://60.205.86.217/upload6/2018-02-09/19/805eee4a-b707-49a2-9c75-d5b14ed9227b.jpg?size=100x100"
                    alt=""/>
            </div>
        );
    }
}


