import React from 'react';
import {
    Toast, DatePicker, PullToRefresh, ListView, Button, List, Picker, Tag, Tabs
} from 'antd-mobile';
import '../css/articleList.less';

var that;
export default class articleList extends React.Component {

    constructor(props) {
        super(props);
        that = this;
        this.state = {
            villNewsDetail: {}
        }
    }

    componentDidMount () {
        Bridge.setShareAble("false");
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var userId = searchArray[0].split('=')[1];
        var cid = searchArray[1].split('=')[1];
        this.queryVillageNewsById(cid)
    }


    /**
     * 判斷用戶是否點贊
     * **/
    queryVillageNewsById (id) {
        var _this = this;
        var param = {
            "method": 'queryVillageNewsById',
            "id": id
        };
        WebServiceUtil.requestLittleAntApi6013(JSON.stringify(param), {
            onResponse: result => {
                if (result.success) {
                    this.setState({
                        villNewsDetail: result.response
                    })

                }

            },
            onError: function (error) {
                Toast.fail(error, 1);
            }
        });
    }


    render () {
        return (
            <div id="articleDetail" style={{ height: document.body.clientHeight }}>
                <div className="p15 villageDetail">
                    <div className='title'>{this.state.villNewsDetail.title}</div>
                    <div className='at'>
                        <div className="author">
                            {this.state.villNewsDetail.userName}
                        </div>
                    </div>
                    <div className="content">
                       <div  dangerouslySetInnerHTML={{ __html: this.state.villNewsDetail.content }}>{}</div>

                    </div>
                </div>

            </div>
        );
    }

}