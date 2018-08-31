import React from "react";
import {} from 'antd-mobile';
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
                <iframe id="iframe_mobile" src="https://192.168.50.163:6443/mobileEditor/" frameborder="0"></iframe>
            </div>

        )
    }
}
