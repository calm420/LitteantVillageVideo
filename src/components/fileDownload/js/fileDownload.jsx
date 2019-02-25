import React from 'react';
import {Toast} from 'antd-mobile';
import '../css/fileDownload.less'

var imgName = 'youyang';
var imgNameTe = 'abc';
export default class Demo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            phone: 'IOS',
            androidUrl: '',
        };
    }

    componentDidMount() {
        var _this = this
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var fileType = searchArray[0].split('=')[1]
        this.setState({fileType})
        var phoneType = navigator.userAgent;
        if (phoneType.indexOf('iPhone') > -1 || phoneType.indexOf('iPad') > -1) {
            this.setState({phone: 'IOS'}, function () {
                _this.buildTitle(fileType)
            })
        } else {
            this.setState({phone: 'Android'}, function () {
                _this.buildTitle(fileType)
                _this.getAppEwmPath(fileType)
            })
        }
        if (window.location.href.indexOf("/fileDownload") > -1) {
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
        } else if (fileType == 'classCard') {
            document.title = '小蚂蚁.云班牌'
        } else if (fileType == 'classroom') {
            document.title = '同步课堂'
        }
    }

    /**
     * 获取最新地址
     * @param fileType
     */
    getAppEwmPath = (fileType) => {
        var _this = this
        var type;
        if (fileType === 'youyang') {
            type = 15
        } else if (fileType === 'littleAntFa') {
            type = 9
        } else if (fileType === 'littleAntSt') {
            type = 2
        } else if (fileType === 'littleAntTe') {
            type = 3
        } else if (fileType === 'elearning') {
            type = 12
        } else if (fileType === 'classCard') {
            type = 16
        }else if (fileType === 'classroom') {
            type = 17
        }

        var url = "https://www.maaee.com/Excoord_For_Education/webservice";
        $.post(url, {
            params: JSON.stringify({"type": type, "method": "checkForUpdates2"})
        }, function (result, status) {
            if (status == "success") {
                var appPath = result.response.webPath;
                _this.setState({androidUrl: appPath})
            }
        }, "json");

    }

    buildTitle(fileType) {
        if (fileType == 'youyang') {
            imgName = 'youyang';
            var titleDiv = <div className='textCont'>
                <div>有样</div>
                <span>AR微分享学习平台</span>
            </div>
        } else if (fileType == 'littleAntTe') {
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
        } else if (fileType == 'classCard') {
            imgName = 'ClassCard';
            var titleDiv = <div className='textCont'>
                <div>小蚂蚁智慧云班牌</div>
                <span>助力学校打造自己特色的校园文化传播平台</span>
            </div>
        } else if (fileType == 'classroom') {
            imgName = 'classroom';
            var titleDiv = <div className='textCont'>
                <div>同步课堂</div>
                <span>让每个中小学生都能享受到优质的学习资源</span>
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
                window.open(this.state.androidUrl)
            }
        } else if (fileType == 'littleAntTe') {
            if (phone == 'IOS') {
                window.open('https://itunes.apple.com/cn/app/apple-store/id1049156218?mt=8')
            } else {
                window.open(this.state.androidUrl)
            }
        } else if (fileType == 'littleAntSt') {
            if (phone == 'IOS') {
                window.open('https://itunes.apple.com/cn/app/apple-store/id1049156218?mt=8')
            } else {
                window.open(this.state.androidUrl)
            }
        } else if (fileType == 'littleAntFa') {
            if (phone == 'IOS') {
                window.open('https://itunes.apple.com/cn/app/apple-store/id1395849263?mt=8')
            } else {
                window.open(this.state.androidUrl)
            }
        } else if (fileType == 'elearning') {
            if (phone == 'IOS') {
                window.open('https://itunes.apple.com/cn/app/apple-store/id1268534857?mt=8')
            } else {
                window.open(this.state.androidUrl)
            }
        } else if (fileType == 'classCard') {
            if (phone == 'IOS') {
                Toast.info('智慧班牌暂不支持IOS', 3)
            } else {
                window.open(this.state.androidUrl)
            }
        }else if (fileType == 'classroom') {
            if (phone == 'IOS') {
                window.open('https://itunes.apple.com/cn/app/apple-store/id1268534857?mt=8')
            } else {
                window.open(this.state.androidUrl)
            }
        }
    }

    render() {
        if (imgNameTe == 'abc') {
            return (
                <div id='fileDownload' className={this.state.fileType}>
                    <div className='topImg'><img src={require('../img/topImg_' + imgName + '.png')} alt=""/></div>
                    {this.state.titleDiv}
                    <div className={this.state.phone + ' downBtn'} onClick={this.downLoadFile}>
                        <span>免费下载{this.state.phone}版</span></div>
                    <div className='bottomImg'><img
                        src={require('../img/bottomImg_' + imgName + '.png')} alt=""/></div>
                </div>
            );
        } else {
            return (
                <div id='fileDownload' className={this.state.fileType}>
                    <div className='topImg'><img src={require('../img/topImg_' + imgName + '.png')} alt=""/></div>
                    {this.state.titleDiv}
                    <div className={this.state.phone + ' downBtn'} onClick={this.downLoadFile}>
                        <span>免费下载{this.state.phone}版</span></div>
                    <div className='bottomImg'><img
                        src={require('../img/bottomImg_' + imgNameTe + '.png')} alt=""/></div>
                </div>
            );
        }


    }
}


