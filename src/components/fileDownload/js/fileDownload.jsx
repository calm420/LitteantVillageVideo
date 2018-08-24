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
            var titleDiv = <div className='textCont'>
                <div>有样</div>
                <span>AR微分享学习平台</span>
            </div>
        } else if (fileType == 'littleAntTe') {
            var titleDiv = <div className='textCont'>
                <div>小蚂蚁.教师端</div>
                <span>科技改变未来,教育成就未来</span>
            </div>
        } else if (fileType == 'littleAntSt') {
            var titleDiv = <div className='textCont'>
                <div>小蚂蚁.学生端</div>
                <span>科技改变未来,教育成就未来</span>
            </div>
        } else if (fileType == 'littleAntFa') {
            var titleDiv = <div className='textCont'>
                <div>小蚂蚁.家长端</div>
                <span>科技改变未来,教育成就未来</span>
            </div>
        } else if (fileType == 'elearning') {
            var titleDiv = <div className='textCont'>
                <div>小蚂蚁.云校</div>
                <span>科技改变未来,教育成就未来</span>
            </div>
        }
        this.setState({titleDiv})
    }

    downLoadFile = () => {
        var fileType = this.state.fileType;
        var phone = this.state.phone
        if (fileType == 'youyang') {
            if (phone == 'IOS') {
                window.open('https://itunes.apple.com/cn/app/apple-store/id1423189213?mt=8')
            } else {
                window.open('http://60.205.86.217/upload7_app/2018-08-23/20/5e2c5613-5a3d-48ce-8152-8fc64cef03b0.apk')
            }
        } else if (fileType == 'littleAntTe') {
            if (phone == 'IOS') {
                window.open('https://itunes.apple.com/cn/app/apple-store/id1049156218?mt=8')
            } else {
                window.open('http://60.205.86.217/upload7_app/2018-07-16/19/4e303b59-f115-49e9-9705-d38b5f649c52.apk')
            }
        } else if (fileType == 'littleAntSt') {
            if (phone == 'IOS') {
                window.open('https://itunes.apple.com/cn/app/apple-store/id1049156218?mt=8')
            } else {
                window.open('http://60.205.86.217/upload7_app/2018-07-19/9/93d48c33-cda5-4784-97f9-9f132bbc63e8.apk')
            }
        } else if (fileType == 'littleAntFa') {
            if (phone == 'IOS') {
                window.open('https://itunes.apple.com/cn/app/apple-store/id1395849263?mt=8')
            } else {
                window.open('http://60.205.86.217/upload7_app/2018-06-28/21/f500639a-e8e5-43e2-b813-be6ffbf2f10a.apk')
            }
        } else if (fileType == 'elearning') {
            if (phone == 'IOS') {
                window.open('https://itunes.apple.com/cn/app/apple-store/id1268534857?mt=8')
            } else {
                window.open('http://60.205.86.217/upload7_app/2018-08-02/19/3c09e2df-fd58-4f81-8b5f-7deb38748000.apk')
            }
        }
    }

    render() {
        return (
            <div id='fileDownload' className={this.state.fileType}>
                <div className='topImg'></div>
                {this.state.titleDiv}
                <div className={this.state.phone + ' downBtn'} onClick={this.downLoadFile}>免费下载{this.state.phone}版</div>
                <div className='bottomImg'></div>
            </div>
        );
    }
}


