import React from 'react';
import {
    Toast, DatePicker, PullToRefresh, ListView, Modal, List, Picker, Tag, Tabs
} from 'antd-mobile';
import '../css/myThemeTask.less';

const alert = Modal.alert;
const prompt = Modal.prompt;
var dataSource = new ListView.DataSource({
    rowHasChanged: (row1, row2) => row1 !== row2,
});
var that;
export default class myThemeTask extends React.Component {

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
            exportFlag: false,
            exportIdArray: [],

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
        var cid = searchArray[2] ? searchArray[2].split('=')[1] : 0;
        console.log(cid, 'cid')
        this.setState({
            userId: userId,
            targetType: targetType,
            cid: cid
        }, () => {
            if (cid == 0) {
                this.getCircleOfFriendsByType();
                $('.am-list-header').css({display: 'none'})
            } else {
                this.getCircleOfFriendsByUidAndCid();
                setTimeout(function () {
                    $('.checkboxAll,.checkbox').attr('checked', 'true')
                    // var fir = document.getElementsByClassName("checkbox");
                    // [].forEach.call(fir,function(value){
                    //     value.checked = true;
                    // })
                    // var fir = document.getElementsByClassName("checkboxAll");
                    // [].forEach.call(fir,function(value){
                    //     value.checked = true;
                    // })
                    // for(var i=fir;i<fir.length;i++){
                    //     fir[i].checked = true;
                    //     console.log('循環')
                    // }
                }, 1000)
            }
        })
    }


    /**
     * 錯題本獲取數據
     * **/
    getCircleOfFriendsByUidAndCid(clearFlag, reslove) {
        var _this = this;
        var param = {
            "method": 'getCircleOfFriendsByUidAndCid',
            "uid": this.state.userId,
            "cid": this.state.cid,
            "pageNo": this.state.defaultPageNo,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                console.log(result, 'getCircleOfFriendsByUidAndCid')
                if (result.success) {
                    var exportIdArray = this.state.exportIdArray;
                    this.state.rsCount = result.pager.rsCount;
                    if (clearFlag) {    //拉动刷新  获取数据之后再清除原有数据
                        _this.initDataSource.splice(0);
                        dataSource = [];
                        dataSource = new ListView.DataSource({
                            rowHasChanged: (row1, row2) => row1 !== row2,
                        });
                    }
                    this.initDataSource = this.initDataSource.concat(result.response);
                    for (var k in this.initDataSource) {
                        exportIdArray.push(this.initDataSource[k].cfid)
                    }
                    this.setState({
                        dataSource: dataSource.cloneWithRows(this.initDataSource),
                        isLoading: true,
                        refreshing: false,
                        initLoading: false,
                        exportIdArray: exportIdArray
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
                    console.log(this.initDataSource, "ddd")

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
            if (cid == 0) {
                this.getCircleOfFriendsByType();
            } else {
                this.getCircleOfFriendsByUidAndCid();
            }
        });
    };

    onRefresh = (str) => {
        var divPull = document.getElementsByClassName('am-pull-to-refresh-content');


        divPull[0].style.transform = "translate3d(0px, 30px, 0px)";   //设置拉动后回到的位置
        // divPull[0].style.height = document.body.clientHeight

        this.setState({
            defaultPageNo: 1, refreshing: true
        }, () => {
            // this.getLittleVideoUserById();
            if (this.state.cid == 0) {
                this.getCircleOfFriendsByType(true);

            } else {
                this.getCircleOfFriendsByUidAndCid(true);
            }
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
    toThemeTaskDetail(cid, rowData) {
        var url = WebServiceUtil.mobileServiceURL + "themeTaskDetail?userId=" + this.state.userId + "&cfid=" + cid + '&type=' + rowData.type;
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

    /**
     * 重新审核弹出框
     */
    showAlert = (data, index, event) => {
        event.stopPropagation()
        var phoneType = navigator.userAgent;
        var phone;
        if (phoneType.indexOf('iPhone') > -1 || phoneType.indexOf('iPad') > -1) {
            phone = 'ios'
        } else {
            phone = 'android'
        }
        var _this = this;
        const alertInstance = alert('您确定删除吗?', '', [
            {text: '取消', onPress: () => console.log('cancel'), style: 'default'},
            {text: '确定', onPress: () => _this.deleteCircle(data, index, event)},

        ], phone);
    }
    deleteCircle = (data, index, event) => {
        event.stopPropagation();
        console.log(data, '要刪除的id');
        console.log(index, "indexindex")
        this.initDataSource.splice(index, 1);
        this.setState({
            dataSource: dataSource.cloneWithRows(this.initDataSource)
        })
        var param = {
            "method": 'deleteCircleFriendById',
            "friendId": data,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                console.log(result, 'getAllCircleOfFriendsByUid')
                if (result.success) {
                    Toast.info('刪除成功');
                }

            },
            onError: function (error) {
                Toast.fail(error, 1);
            }
        });

    }


    setFilter = () => {
        console.log('篩選');
    }

    setExport = () => {
        console.log('觸發導出事件');
        this.setState({
            exportFlag: true,
        })
    }

    exportTopic = () => {
        console.log('導出')
        if (this.state.exportIdArray.length > 0) {
            console.log(this.state.exportIdArray);
            this.setState({
                exportFlag: false,
            })
            console.log('導出成功')
        } else {
            Toast.info('沒有選中的錯題', 1);
        }

    }

    closeExport = () => {
        this.setState({
            exportFlag: false,
        })
    }

    checkBoxClick(cfId, obj) {
        var exportIdArray = this.state.exportIdArray;
        console.log(exportIdArray, '復選操作前');
        console.log(obj.target.checked);
        if (obj.target.checked) {//選中
            exportIdArray.push(cfId);
        } else {//取消選中
            exportIdArray.splice(exportIdArray.indexOf(cfId), 1);
        }
        this.setState({
            exportIdArray: exportIdArray
        }, () => {
            console.log(this.state.exportIdArray, '復選操作後');
        })
    }

    checkBoxAllClick(obj) {
        if (obj.target.checked) {
            console.log('選中全選');
            // $('.checkbox').attr('checked','true');
            var fir = document.getElementsByClassName("checkbox");
            [].forEach.call(fir, function (value) {
                value.checked = true;
            })
        } else {
            console.log('取消全選')
            // $('.checkbox').removeAttr('checked');
            var fir = document.getElementsByClassName("checkbox");
            [].forEach.call(fir,function(value){
                value.checked = false;
            })
        }
    }


    render() {
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
                    <input style={
                        this.state.exportFlag ? {display: 'block'} : {display: 'none'}
                    } className="checkbox" type="checkbox" name="checked"
                           onClick={this.checkBoxClick.bind(this, rowData.cfid)}/>
                    <div className="date" style={
                        this.state.targetType == 1 ? {display: 'none'} : {display: 'block'}
                    }>
                        <div
                            className="day">{WebServiceUtil.formatMD(rowData.createTime).split('-')[1] < 10 ? '0' + WebServiceUtil.formatMD(rowData.createTime).split('-')[1] : WebServiceUtil.formatMD(rowData.createTime).split('-')[1]}</div>
                        <div className="mouth">{WebServiceUtil.formatMD(rowData.createTime).split('-')[0]}月</div>
                    </div>
                    <div className="circleList" style={
                        this.state.targetType == 1 ? {width: '100%'} : {}
                    }
                         onClick={this.toThemeTaskDetail.bind(this, rowData.cfid, rowData)}>

                        <div className="list_content">{rowData.type == 0 ? rowData.mark : rowData.content}</div>
                        <div className="list_image" style={
                            friendsAttachments.length == 0 ? {display: 'none'} : {display: 'block'}
                        }>
                            {friendsAttachments.map((value, index) => {
                                if (value.type == 0) {
                                    return <img style={
                                        friendsAttachments.length == 1 ? {width: '200px', height: '113px'} : {
                                            display: 'inline-block'
                                        }
                                    } src={value.path} alt=""/>
                                } else {
                                    return <div className="video_tag" style={
                                        friendsAttachments.length == 1 ? {width: '200px', height: '113px'} : {
                                            display: 'inline-block'
                                        }
                                    }>
                                        <video poster={value.coverPath} onClick={this.playVideo.bind(this)}
                                               style={{width: '100%', height: '100%'}}
                                               src={value.path} alt=""/>
                                        <div className="video_tag_play" onClick={this.playVideo.bind(this)}></div>
                                    </div>
                                }

                            })}
                        </div>
                        <div className='time' style={
                            rowData.type == 0 ? {display: 'none'} : {display: 'block'}
                        }>
                            <div>发布时间:{this.timeDifference(rowData.createTime)}</div>
                            <div>截止时间:{WebServiceUtil.formatAllTime(rowData.endTime)}</div>
                        </div>
                        <div className="list_bottom">
                            <div className="list_bottom_item"><i className="i-share"></i></div>
                            <div className="list_bottom_item"><i
                                className="i-comments"></i><span>{rowData.disContent}</span></div>
                            <div className="list_bottom_item"><i
                                className={rowData.currentUserIsLike ? "i-praise-active" : "i-praise"}></i><span>{rowData.likeCount}</span>
                            </div>
                            <div className="list_bottom_item" onClick={this.showAlert.bind(this, rowData.cfid, rowID)}>
                                <i className="i-delete"></i></div>
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
                    renderHeader={sectionData => (
                        <div>
                            <div style={
                                this.state.exportFlag ? {display: 'none'} : {display: 'block'}
                            }>
                                <button className="filter-btn" onClick={this.setFilter}>篩選</button>
                                <button>數據統計</button>
                                <button className='export-btn' onClick={this.setExport}>導出錯題本</button>
                            </div>
                            <div style={
                                this.state.exportFlag ? {display: 'block'} : {display: 'none'}
                            }>
                                <div style={{display: 'inline-block'}}><input className="checkboxAll"
                                                                              onClick={this.checkBoxAllClick.bind(this)}
                                                                              type="checkbox"/><span>全選</span></div>
                                <button className='export-btn' onClick={this.exportTopic}>確定導出</button>
                                {/*<button onClick={this.closeExport}>取消</button>*/}
                            </div>
                        </div>

                    )}
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

                {/*<div className="filter-content" style={{*/}
                {/*height: this.state.clientHeight*/}
                {/*}}>*/}

                {/*</div>*/}


            </div>
        );
    }

}