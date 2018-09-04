import React from "react";
import {Toast} from 'antd-mobile';
import "../css/mobileEditor.less"

var _this;
export default class mobileEditor extends React.Component {
    constructor(props) {
        super(props);
        _this = this;
        this.state = {
            loginUser: {}
        }
    }

    componentDidMount() {
        document.title = "发布文章";
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var id = searchArray[0].split('=')[1];
        setTimeout(function () {
            _this.getLittleVideoUserById(id)
        }, 100)
        window.addEventListener('message', (e) => {
            this.onMessage(e);
        })
    }

    //接受消息
    onMessage(e) {
        if (e.data) {
            var iframeData = JSON.parse(e.data);
            if (iframeData.method == 'mobile-submit') {
                //发布文章
                _this.saveArticleInfo(iframeData.article)
            } else if (iframeData.method == 'unloadFilesForEdit') {
                Bridge.callHandler(iframeData, function (res) {
                    // 拿到照片地址

                    var ifm = document.getElementById('iframe_mobile');
                    var data = {
                        method: 'callbackSrc',
                        res: res,
                    }
                    ifm.contentWindow.postMessage(JSON.stringify(data), '*');

                }, function (error) {
                    console.log(error);
                });
            }
        }

    }

    /**
     * 发布文章
     * @param param
     */
    saveArticleInfo(article) {
        var imageList = [];
        var attacheMents = article.attacheMents;
        var newAttachMents = [];
        for (var k in attacheMents) {
            newAttachMents.push({
                userId: _this.state.loginUser.uid,
                type: attacheMents[k].type == 'image' ? 0 : 1,
                path: attacheMents[k].path,
                coverPath: attacheMents[k].cover,
                isCover: attacheMents[k].isMainCover,
                // articleId: _this.state.artId,
                // attachmentId: attacheMents[k].attachmentId || -1,
            })

            if (attacheMents[k].isMainCover) {
                imageList.push(attacheMents[k].cover);
            }
        }
        this.saveArticleInfoFinal(article.title, article.content, article.author, article.type, imageList, newAttachMents);
    }

    saveArticleInfoFinal(title, html, author, type, imgArray, articleAttachments) {
        var param = {
            "method": 'saveArticleInfo',
            "articleInfoJson": {
                "userId": this.state.loginUser.uid,
                "schoolId": this.state.loginUser.schoolId,
                "gradeId": this.state.loginUser.gradeId,
                "status": type,
                "articleTitle": title,
                "articleContent": html,
                "author": author,
                "articleAttachments": WebServiceUtil.isEmpty(articleAttachments) ? [] : articleAttachments
            }
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                if (result.success) {
                    Toast.info(type == 0 ? '保存成功' : '发布成功', 1);
                    //关闭
                    setTimeout(function () {
                        var data = {
                            method: 'finish',
                        };
                        Bridge.callHandler(data, null, function (error) {
                            console.log(error);
                        });
                    }, 1000)
                } else {
                    Toast.fail("保存/发布失败");
                }
            },
            onError: function (error) {
                Toast.fail(error, 1);
            }
        });
    }

    getLittleVideoUserById(id) {
        var param = {
            "method": 'getLittleVideoUserById',
            "uid": id,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                if (result.success) {
                    _this.setState({loginUser: result.response})
                }
            },
            onError: function (error) {
                // Toast.fail(error, 1);
            }
        });
    }


    render() {
        return (
            <div id="mobileEditor">
               {/* <iframe id="iframe_mobile" className="mobile-iframe" src="https://192.168.50.163:6443/mobileEditor/" frameborder="0"></iframe>*/}
                <iframe id="iframe_mobile" className="mobile-iframe"
                        src="http://jiaoxue.maaee.com:8094/richTextMobileEditor/"
                        frameborder="0"></iframe>

            </div>

        )
    }
}
