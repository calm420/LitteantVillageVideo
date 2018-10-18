import React from 'react';
import { } from 'antd-mobile';
import '../css/fileDownload.less'

var imgName = 'youyang';
var imgNameTe = 'abc';
export default class Demo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            phone: 'IOS'
        };
    }

    componentDidMount() {
        var _this = this
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var fileType = searchArray[0].split('=')[1]
        this.setState({ fileType })
        var phoneType = navigator.userAgent;
        if (phoneType.indexOf('iPhone') > -1 || phoneType.indexOf('iPad') > -1) {
            this.setState({ phone: 'IOS' }, function () {
                _this.buildTitle(fileType)
            })
        } else {
            this.setState({ phone: 'Android' }, function () {
                _this.buildTitle(fileType)
            })
        }
        if (
            window.location.href.indexOf("/youyang") > -1 ||
            window.location.href.indexOf("/littleAntTe") > -1 ||
            window.location.href.indexOf("/littleAntSt") > -1 ||
            window.location.href.indexOf("/littleAntFa") > -1 ||
            window.location.href.indexOf("/elearning") > -1
        ) {
            //防止页面后退
            history.pushState(null, null, document.URL);
            window.addEventListener('popstate', function () {
                history.pushState(null, null, document.URL);
            });
        }

        if (fileType == 'youyang') {
            document.title = '有样'
        } else if (fileType == 'littleAntTe') {
            if (this.state.phone == 'IOS') {
                document.title = '小蚂蚁移动教学'
            } else {
                document.title = '小蚂蚁.教师端'
            }
        } else if (fileType == 'littleAntSt') {
            if (this.state.phone == 'IOS') {
                document.title = '小蚂蚁移动教学'
            } else {
                document.title = '小蚂蚁.学生端'
            }

        } else if (fileType == 'littleAntFa') {
            document.title = '小蚂蚁.家长端'
        } else if (fileType == 'elearning') {
            document.title = '小蚂蚁云校'
        }
    }

    buildTitle(fileType) {
        if (fileType == 'youyang') {
            imgName = 'youyang';
            var titleDiv = <div className='textCont'>
                <div>有样</div>
                <span>AR微分享学习平台</span>
            </div>
        } else if (fileType == 'littleAntTe') {
            console.log(this.state.phone);
            if (this.state.phone == 'IOS') {
                imgName = 'littleAntSt';
                imgNameTe = 'littleAntTe'
                var titleDiv = <div className='textCont'>
                    <div>小蚂蚁移动教学</div>
                    <span>科技改变未来，教育成就未来</span>
                </div>
            } else {
                imgName = 'littleAntTe';
                var titleDiv = <div className='textCont'>
                    <div>小蚂蚁.教师端</div>
                    <span>科技改变未来，教育成就未来</span>
                </div>
            }


        } else if (fileType == 'littleAntSt') {
            imgName = 'littleAntSt';
            if (this.state.phone == 'IOS') {
                var titleDiv = <div className='textCont'>
                    <div>小蚂蚁移动教学</div>
                    <span>科技改变未来，教育成就未来</span>
                </div>
            } else {
                var titleDiv = <div className='textCont'>
                    <div>小蚂蚁.学生端</div>
                    <span>科技改变未来，教育成就未来</span>
                </div>
            }

        } else if (fileType == 'littleAntFa') {
            imgName = 'littleAntFa';
            var titleDiv = <div className='textCont'>
                <div>小蚂蚁.家长端</div>
                <span>科技改变未来，教育成就未来</span>
            </div>
        } else if (fileType == 'elearning') {
            imgName = 'elearning';
            var titleDiv = <div className='textCont'>
                <div>小蚂蚁云校</div>
                <span>科技改变未来，教育成就未来</span>
            </div>
        }
        this.setState({ titleDiv })
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
        if (imgNameTe == 'abc') {
            return (
                <div id='fileDownload' className={this.state.fileType}>
                    <div className='topImg'><img src={require('../img/topImg_' + imgName + '.png')} alt="" /></div>
                    {this.state.titleDiv}
                    <div className={this.state.phone + ' downBtn'} onClick={this.downLoadFile}>
                        <span>免费下载{this.state.phone}版</span></div>
                    <div className='bottomImg'><img
                        src={require('../img/bottomImg_' + imgName + '.png')} alt="" /></div>
                </div>
            );
        } else {
            return (
                <div id='fileDownload' className={this.state.fileType}>
                    <div className='topImg'><img src={require('../img/topImg_' + imgName + '.png')} alt="" /></div>
                    {this.state.titleDiv}
                    <div className={this.state.phone + ' downBtn'} onClick={this.downLoadFile}>
                        <span>免费下载{this.state.phone}版</span></div>
                    <div className='bottomImg'><img
                        src={require('../img/bottomImg_' + imgNameTe + '.png')} alt="" /></div>
                </div>
            );
        }


    }
}


