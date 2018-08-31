import React from "react";
import {Toast} from 'antd-mobile';
import "../css/mobileEditor.less"

var _this;
export default class mobileEditor extends React.Component {
    constructor(props) {
        super(props);
        _this = this;
        this.state = {}
    }

    componentDidMount() {
        document.title = "手机编辑器";
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
                _this.saveArticleInfo(iframeData.param)
            }
        }

    }

    /**
     * 发布文章
     * @param param
     */
    saveArticleInfo(param) {
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                if (result.msg == '调用成功' || result.success) {
                    if (param.articleInfoJson.status === 0) {
                        Toast.success('保存成功', 1)
                    } else {
                        Toast.success('发布成功', 1)
                    }
                }
            },
            onError: function (error) {

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

                    var data = {}
                    data.method = 'loginUserObj';
                    data.mes = result.response

                    var ifm = document.getElementById('iframe_mobile');
                    ifm.contentWindow.postMessage(JSON.stringify(data), '*');
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
                <iframe id="iframe_mobile" src="https://192.168.50.29:6443/mobileEditor/" frameborder="0"></iframe>
            </div>

        )
    }
}
