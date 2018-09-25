import React from 'react';
import {
    Toast, DatePicker, PullToRefresh, ListView, Modal, List, Picker, Tag, Tabs
} from 'antd-mobile';
import '../css/topicWrongList.less';

var that;
export default class articleList extends React.Component {

    constructor(props) {
        super(props);
        that = this;
        this.state = {
            clientHeight: document.body.clientHeight,
            listData:[],
            refreshing:false,
            isHidden:false,
        }
    }

    componentDidMount() {
        Bridge.setShareAble("false");
        document.title = '错题本';
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var userId = searchArray[0].split('=')[1];
        var toUserId = searchArray[1]?searchArray[1].split('=')[1]:null;
        if(toUserId){
            if(userId == toUserId){

            }else{
                userId = toUserId;
                this.setState({
                    isHidden: true
                })
            }

        }
        this.setState({
            userId: userId,
        }, () => {
            this.getCourseAndCircleOfFriendsCount();
        })
    }


    /**
     * 按查询条件获取列表
     * **/
    getCourseAndCircleOfFriendsCount() {
        var _this = this;
        var param = {
            "method": 'getCourseAndCircleOfFriendsCount',
            "uid": this.state.userId,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                console.log(result, 'getCourseAndCircleOfFriendsCount')
                if (result.success) {
                    var listData = [];
                    var res = result.response;
                    for(var k in res){
                        listData.push(
                            {
                                name: k,
                                count: res[k].count,
                                cid: res[k].cid,
                            }
                        )
                    }
                    for(var k in listData){
                        switch(listData[k].name){
                            case '生物':
                                listData[k].css = 'Wrong-topic-biological';
                                    break;
                            case '化学':
                                listData[k].css = 'Wrong-topic-chemical';
                                break;
                            case '语文':
                                listData[k].css = 'Wrong-topic-Chinese';
                                break;
                            case '英语':
                                listData[k].css = 'Wrong-topic-English';
                                break;
                            case '地理':
                                listData[k].css = 'Wrong-topic-geographic';
                                break;
                            case '历史':
                                listData[k].css = 'Wrong-topic-history';
                                break;
                            case '数学':
                                listData[k].css = 'Wrong-topic-mathematics';
                                break;
                            case '物理':
                                listData[k].css = 'Wrong-topic-physical';
                                break;
                            case '政治':
                                listData[k].css = 'Wrong-topic-political';
                                break;
                            default :
                                listData[k].css = 'Wrong-topic-other';
                                break;
                        }
                    }
                    console.log(listData);

                    this.setState({
                        listData: listData,
                        refreshing:false,
                    })
                }

            },
            onError: function (error) {
                Toast.fail(error, 1);
            }
        });
    }





    //跳转至朋友圈详情
    toThemeTaskDetail(item) {
        if(this.state.isHidden){
            var url = WebServiceUtil.mobileServiceURL + "myThemeTask?userId="+this.state.userId+"&targetId=0&cid="+item.cid+"&projectName="+item.name+"&isHidden="+this.state.isHidden;
        }else{
            var url = WebServiceUtil.mobileServiceURL + "myThemeTask?userId="+this.state.userId+"&targetId=0&cid="+item.cid+"&projectName="+item.name;
        }
        var data = {
            method: 'openNewPage',
            url: url
        };
        Bridge.callHandler(data, null, function (error) {
            window.location.href = url;
        });
    }

    render() {
        return (
            <div id="topicWrongList" style={{height: document.body.clientHeight}}>
                <PullToRefresh
                    damping={60}
                    style={{
                        height: this.state.clientHeight,
                        overflow: 'auto',
                    }}
                    indicator={{}}
                    direction={'down'}
                    refreshing={this.state.refreshing}
                    onRefresh={() => {
                        this.setState({ refreshing: true });
                        setTimeout(() => {
                            this.getCourseAndCircleOfFriendsCount();
                        }, 1000);
                    }}
                >
                    <div style={
                        this.state.listData.length >= 1 ?{display:'block',height:this.state.clientHeight}:{display:'none',height:this.state.clientHeight}
                    }>
                        {this.state.listData.map(function(value,index){
                            return <div className="list-item" onClick={that.toThemeTaskDetail.bind(that,value)}>
                                <div className={value.css+" tag-pic"}></div>
                                <div className="tag-text">{value.name}/{value.count}</div>
                            </div>
                        })}
                    </div>
                    <div style={
                        this.state.listData.length < 1 ?{display:'block'}:{display:'none'}
                    }>
                        <img src={require('../images/noDataPic.jpg')} alt=""/>
                        <div>错题本暂无数据</div>
                    </div>

                </PullToRefresh>

            </div>
        );
    }

}