import React from 'react';
import {
    Toast, DatePicker, PullToRefresh, ListView, Button, List, Picker, Tag, Tabs
} from 'antd-mobile';
import '../css/themeTaskDetail.less';

var dataSource = new ListView.DataSource({
    rowHasChanged: (row1, row2) => row1 !== row2,
});
var that;
export default class articleList extends React.Component {

    constructor(props) {
        super(props);
        that = this;
        this.initDataSource = [];
        this.state = {

        }
    }

    componentDidMount() {

    }




    /**
     * 按查询条件获取列表
     * **/
    getArticleInfoListByType() {
        var param = {
            "method": 'getArticleInfoListByType',
            "userId": this.state.userId,
            "getType": this.state.index,
            "pageNo": this.state.defaultPageNo,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                if (result.success) {

                }

            },
            onError: function (error) {
                Toast.fail(error, 1);
            }
        });
    }


    toDetail(id, articleTitle) {
        if (id) {
            let url = encodeURI(WebServiceUtil.mobileServiceURL + "articleDetail?vId=" + id + "&userId=" + this.state.userId + "&type=1&machineType=" + this.state.machineType + "&version=" + this.state.version + '&articleTitle=' + ((articleTitle)));
            var data = {
                method: 'openNewPage',
                url: url
            };
            Bridge.callHandler(data, null, function (error) {
                window.location.href = url;
            });
        } else {
            Toast.fail('id参数有误', 2);
        }
    }


    render() {
        return (
            <div id="themeTaskDetail" style={{height: document.body.clientHeight}}>
                themeTaskDetail
            </div>
        );
    }

}