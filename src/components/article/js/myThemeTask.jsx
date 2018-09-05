import React from 'react';
import {
    Toast, DatePicker, PullToRefresh, ListView, Button, List, Picker, Tag, Tabs
} from 'antd-mobile';
import '../css/myThemeTask.less';

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
            dataSource: dataSource.cloneWithRows(this.initDataSource),
            defaultPageNo: 1,
            clientHeight: document.body.clientHeight,
            isLoading: true,
            hasMore: true,

        }
    }

    componentDidMount() {
        Bridge.setShareAble("false");
        document.title = '';
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var userId = searchArray[0].split('=')[1];
        var targetType = searchArray[1].split('=')[1];
        this.setState({
            userId: userId,
            targetType: targetType
        }, () => {
            this.getCircleOfFriendsByType();
        })
    }


    /**
     * 按查询条件获取列表
     * **/
    getCircleOfFriendsByType(clearFlag, reslove) {
        var _this = this;
        var param = {
            "method": 'getCircleOfFriendsByType',
            "userId": this.state.userId,
            "targetType": this.state.targetType,
            "pageNo": this.state.defaultPageNo,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                console.log(result, 'getAllCircleOfFriendsByUid')
                if (result.success) {
                    this.state.rsCount = result.pager.rsCount;
                    if (clearFlag) {    //拉动刷新  获取数据之后再清除原有数据
                        _this.initDataSource.splice(0);
                        dataSource = [];
                        dataSource = new ListView.DataSource({
                            rowHasChanged: (row1, row2) => row1 !== row2,
                        });
                    }
                    this.initDataSource = this.initDataSource.concat(result.response);
                    this.setState({
                        dataSource: dataSource.cloneWithRows(this.initDataSource),
                        isLoading: true,
                        refreshing: false,
                        initLoading: false
                    }, () => {
                        if (reslove) {
                            reslove();
                        }
                    })
                    if ((this.initDataSource.length >= result.pager.rsCount)) {
                        this.setState({
                            hasMore: false,
                            isLoading: false
                        })
                    }
                }

            },
            onError: function (error) {
                Toast.fail(error, 1);
            }
        });
    }


    /**
     *  ListView数据全部渲染完毕的回调
     */
    onEndReached = (event) => {
        var _this = this;
        var currentPageNo = this.state.defaultPageNo;
        if (!this.state.isLoading && !this.state.hasMore) {
            return;
        }
        currentPageNo += 1;
        this.setState({
            isLoading: true,
            defaultPageNo: currentPageNo,
        }, () => {
            this.getAllCircleOfFriendsByUid();
        });
    };

    onRefresh = (str) => {
        var divPull = document.getElementsByClassName('am-pull-to-refresh-content');

        if (str == 'left') {
            divPull[0].style.transform = "translate3d(0px, 30px, 0px)";   //设置拉动后回到的位置
            // divPull[0].style.height = document.body.clientHeight
        }
        this.setState({
            defaultPageNo: 1, refreshing: true
        }, () => {
            // this.getLittleVideoUserById();
            this.getArticleRecommenLittleVideoList(true);
            // Toast.info('重新绑定事件'+this.state.index);

        });


    };


    //计算时间差
    timeDifference(date) {
        var date1 = date;  //开始时间
        var date2 = new Date();    //结束时间
        var date3 = date2.getTime() - new Date(date1).getTime();   //时间差的毫秒数

        //------------------------------

        //计算出相差天数
        var days = Math.floor(date3 / (24 * 3600 * 1000))

        //计算出小时数

        var leave1 = date3 % (24 * 3600 * 1000)    //计算天数后剩余的毫秒数
        var hours = Math.floor(leave1 / (3600 * 1000))
        //计算相差分钟数
        var leave2 = leave1 % (3600 * 1000)        //计算小时数后剩余的毫秒数
        var minutes = Math.floor(leave2 / (60 * 1000))
        //计算相差秒数
        var leave3 = leave2 % (60 * 1000)      //计算分钟数后剩余的毫秒数
        var seconds = Math.round(leave3 / 1000);

        if (days == 0) {
            if (days == 0 && hours == 0) {
                if (days == 0 && hours == 0 && minutes == 0) {
                    if (days == 0 && hours == 0 && minutes == 0 && seconds <= 30) {
                        return "刚刚"
                    } else {
                        return seconds + "秒前"
                    }
                } else {
                    return minutes + '分钟前';
                }
            } else {
                return hours + "小时前";
            }
        } else {
            return days + "天前"
        }
        // alert(" 相差 "+days+"天 "+hours+"小时 "+minutes+" 分钟"+seconds+" 秒")
    }


    //跳转至朋友圈详情
    toThemeTaskDetail(cid) {
        var url = WebServiceUtil.mobileServiceURL + "themeTaskDetail?userId=" + this.state.userId + "&cfid=" + cid;
        var data = {
            method: 'openNewPage',
            url: url
        };
        Bridge.callHandler(data, null, function (error) {
            window.location.href = url;
        });
    }


    playVideo(event) {

        event.stopPropagation();
        // console.log(e,'eeeeeeeeeeee');
        // e.nativeEvent.stopImmediatePropagation();
    }

    deleteCircle(data, event) {
        event.stopPropagation();
        console.log(data,'要刪除的id');

    }


    render() {
        var _this = this;
        const row = (rowData, sectionID, rowID) => {
            var dom = "";
            var time = this.timeDifference(rowData.createTime);
            var friendsAttachments = rowData.friendsAttachments;
            for (var i = 0; i < friendsAttachments.length; i++) {
                if (friendsAttachments[i].fatherType == 1) {
                    friendsAttachments.splice(i, 1);
                }
            }
            dom =
                <div className='my_flex'>
                    <div className="date" style={
                        this.state.targetType == 1?{display:'none'}:{display:'block'}
                    }>
                        <div className="day">{WebServiceUtil.formatMD(rowData.createTime).split('-')[1] < 10?'0'+WebServiceUtil.formatMD(rowData.createTime).split('-')[1]:WebServiceUtil.formatMD(rowData.createTime).split('-')[1]}</div>
                        <div className="mouth">{WebServiceUtil.formatMD(rowData.createTime).split('-')[0]}月</div>
                    </div>
                    <div className="circleList" style={
                            this.state.targetType == 1 ? {width:'100%'}:{}
                        }
                         onClick={this.toThemeTaskDetail.bind(this, rowData.cfid)}>

                        <div className="list_content">{rowData.type==0?rowData.mark:rowData.content}</div>
                        <div className="list_image" style={
                            friendsAttachments.length == 0 ? {display: 'none'} : {display: 'block'}
                        }>
                            {friendsAttachments.map((value, index) => {
                                if (value.type == 0) {
                                    return <img style={
                                        friendsAttachments.length == 1 ? {width: '100%', height: '100%'} : {
                                            display: 'inline-block'
                                        }
                                    } src={value.path} alt=""/>
                                } else {
                                    return <div className="video_tag" style={
                                        friendsAttachments.length == 1 ? {maxWidth: '100%'} : {
                                            display: 'inline-block'
                                        }
                                    }>
                                        <video onClick={this.playVideo.bind(this)} style={{width: '100%', height: '100%'}}
                                               src={value.path} alt=""/>
                                        <div className="video_tag_play" onClick={this.playVideo.bind(this)}></div>
                                    </div>
                                }

                            })}
                        </div>
                        <div className='time' style={
                            rowData.type==0?{display:'none'}:{display:'block'}
                        }>
                            <div>发布时间:{this.timeDifference(rowData.createTime)}</div>
                            <div>截止时间:{WebServiceUtil.formatAllTime(rowData.endTime)}</div>
                        </div>
                        <div className="list_bottom">
                            <div className="list_bottom_item"><i className="i-share"></i></div>
                            <div className="list_bottom_item"><i className="i-comments"></i><span>{rowData.disContent}</span></div>
                            <div className="list_bottom_item"><i className="i-praise"></i><span>{rowData.likeCount}</span></div>
                            <div className="list_bottom_item" onClick={this.deleteCircle.bind(this, rowData.cfid)}><i className="i-delete"></i></div>
                        </div>
                    </div>
                </div>




            return (
                <div className='list_item'>
                    {dom}
                </div>
            )
        };
        return (
            <div id="myThemeTask" style={{height: document.body.clientHeight}}>

                <ListView
                    ref={el => this.lv = el}
                    dataSource={this.state.dataSource}    //数据类型是 ListViewDataSource
                    renderFooter={() => (
                        <div style={{paddingTop: 5, paddingBottom: 0, textAlign: 'center'}}>
                            {this.state.isLoading ? '正在加载...' : '已经全部加载完毕'}
                        </div>)}
                    renderRow={row}   //需要的参数包括一行数据等,会返回一个可渲染的组件为这行数据渲染  返回renderable
                    className="am-list"
                    pageSize={30}    //每次事件循环（每帧）渲染的行数
                    //useBodyScroll  //使用 html 的 body 作为滚动容器   bool类型   不应这么写  否则无法下拉刷新
                    scrollRenderAheadDistance={200}   //当一个行接近屏幕范围多少像素之内的时候，就开始渲染这一行
                    onEndReached={this.onEndReached}  //当所有的数据都已经渲染过，并且列表被滚动到距离最底部不足onEndReachedThreshold个像素的距离时调用+39*
                    onEndReachedThreshold={10}  //调用onEndReached之前的临界值，单位是像素  number类型
                    initialListSize={30}   //指定在组件刚挂载的时候渲染多少行数据，用这个属性来确保首屏显示合适数量的数据
                    scrollEventThrottle={20}     //控制在滚动过程中，scroll事件被调用的频率
                    style={{
                        height: document.body.clientHeight
                    }}
                    pullToRefresh={<PullToRefresh
                        onRefresh={this.onRefresh.bind(this, 'rightright')}
                        distanceToRefresh={80}
                    />}
                />

            </div>
        );
    }

}