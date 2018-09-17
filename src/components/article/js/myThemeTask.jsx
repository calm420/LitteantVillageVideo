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
const initCheckId = [];
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
            initCheckIdLength: 0,
            filterFlag: false,
            masteryId: "-1",
            tagId: "-1",
            startTime: WebServiceUtil.formatYMD(new Date('2000-01-01').getTime()),
            endTime: WebServiceUtil.formatYMD(new Date().getTime()),
            courseIdArray: '',
            masteryIdArray: ["-1"], //默認選擇全部
            tagIdArray: ["-1"],　　　//默認選擇全部
            courseData: [],
            tagData: [],
            timeText: '全部',
            startDateForCustom: new Date(),
            endDateForCustom: new Date(),
            customFlagFor: false,
            currentProject: "",
            isHidden: false,
        }
    }

    componentDidMount() {
        Bridge.setShareAble("false");
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var userId = searchArray[0].split('=')[1];
        var targetType = searchArray[1].split('=')[1];
        var cid = (searchArray[2] ? searchArray[2].split('=')[1] : 0);
        var project = searchArray[3] ? decodeURI(searchArray[3].split('=')[1]) : "";
        var fromTopic = false;
        if (targetType == 0) {
            var isHidden = searchArray[4] ? (searchArray[4].split('=')[1]) : null;
            fromTopic = true;
        } else {
            var isHidden = searchArray[2] ? (searchArray[2].split('=')[1]) : null;

        }
        if (isHidden) {
            if (userId != isHidden) {
                if(fromTopic){

                }else{
                    userId = isHidden;
                }
                this.setState({
                    isHidden: true,
                })
            }
        }
        this.setState({
            project: project,
            currentProject: project,
            userId: userId,
            targetType: targetType,
            cid: cid,
            courseIdArray: cid,
        }, () => {
            if (targetType == 1) {
                document.title = '我的主题任务';
                this.getCircleOfFriendsByType();
                $('.am-list-header').css({display: 'none'})
            } else {
                document.title = '我的错题本';
                this.getCircleOfFriendsByUidAndCid();
                this.gitErrorTagsByCourseId();
                this.getCourseAndCircleOfFriendsCount();
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
     * 根據科目ｉｄ查詢標籤
     * **/
    gitErrorTagsByCourseId(courseId) {
        var _this = this;
        var param = {
            "method": 'gitErrorTagsByCourseId',
            "courseId": courseId ? courseId : this.state.cid,
            "pageNo": -1,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                console.log(result, '标签列表')
                if (result.success) {
                    var res = [];
                    res.push({
                        tagId: -1,
                        tagTitle: '全部'
                    })
                    res = res.concat(result.response)
                    this.setState({
                        tagData: res,
                    })
                }

            },
            onError: function (error) {
                Toast.fail(error, 1);
            }
        });
    }

    /**
     * 根據userId 獲取科目
     * **/
    getCourseAndCircleOfFriendsCount(clearFlag, reslove) {
        var _this = this;
        var param = {
            "method": 'getCourseAndCircleOfFriendsCount',
            "uid": this.state.userId,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                console.log(result, '科目列表')
                if (result.success) {
                    var res = result.response;
                    var courseData = [];
                    for (var k in res) {
                        courseData.push({
                            name: k,
                            id: res[k].cid
                        })
                    }
                    // var dom = [];
                    // for(var k in res){
                    //     dom.push(
                    //         <span className={this.state.courseIdArray.indexOf(res[k].cid) == -1?"course-init":"course-active"} onClick={this.courseClick.bind(this,res[k].cid)}>{k}</span>
                    //     )
                    // }
                    // console.log(this.state.courseIdArray);
                    // console.log(this.state.courseIdArray.indexOf(res[k].cid),'``````````````');
                    // console.log(dom)
                    this.setState({
                        courseData: courseData,
                    })
                }

            },
            onError: function (error) {
                Toast.fail(error, 1);
            }
        });
    }


    /**
     * 錯題本獲取數據
     * **/
    getCircleOfFriendsByUidAndCid(clearFlag, reslove) {
        var _this = this;
        var param = {
            "method": 'searchCircleOfFriends',
            "userId": this.state.userId,
            "courseId": this.state.cid,
            "tagId": this.state.tagId,
            "mastery": this.state.masteryId,
            "startTime": this.state.startTime,
            "endTime": this.state.endTime,
            "pageNo": this.state.defaultPageNo,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                console.log(result, 'searchCircleOfFriends')
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
                    console.log('45678asbdjgakjgsdkjasgj')
                    result.response.forEach(function (v, i) {
                        initCheckId.push(v.cfid)
                    })
                    this.setState({
                        dataSource: dataSource.cloneWithRows(this.initDataSource),
                        isLoading: true,
                        refreshing: false,
                        initLoading: false,
                        exportIdArray: exportIdArray,
                        initCheckIdLength: exportIdArray.length,
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
            if (this.state.targetType == 1) {
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
            if (this.state.targetType == 1) {
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
        console.log('筛选');
        this.setState({
            filterFlag: true,
        })
    }

    closeFilter = () => {
        var timeText = '';
        var endTime = this.state.endTime;
        var startTime = this.state.startTime;
        endTime = endTime.split('-').join('/');
        startTime = startTime.split('-').join('/');
        this.setState({
            startTime: startTime,
            endTime: endTime
        }, () => {
            console.log(this.state.endTime, 'this.state.endTime');

            var nTime = new Date(this.state.endTime).getTime() - new Date(this.state.startTime).getTime();
            var day = Math.floor(nTime / 86400000);
            console.log(day);
            if (day > 5000) {
                timeText = '全部';
            } else if (day > 7) {
                timeText = '一月內';
            } else {
                timeText = '一周內';
            }
            if (this.state.customFlagFor) {
                timeText = '自定义';
            }
            this.setState({
                masteryId: String(this.state.masteryId),
                tagId: String(this.state.tagId)
            }, () => {
                this.setState({
                    currentProject: this.state.currentProject,
                    filterFlag: false,
                    courseIdArray: this.state.cid,
                    timeText: timeText,
                    masteryIdArray: this.state.masteryId.split(','),
                    tagIdArray: this.state.tagId.split(',')
                }, () => {
                    console.log(this.state.cid, 'closeFilter');

                });
            })
        })
    }

    setExport = () => {
        console.log('触发导出事件');
        this.setState({
            exportFlag: true,
        }, () => {
            var data = {
                method: 'editorInTopic',
            };
            Bridge.callHandler(data, function (val) {
                // console.log(val,'valvalvalvalvalvalvalvalval');
                // Toast.info(val);
                if (val == 'editorInTopic') {
                    that.closeExport();
                } else {
                    // Toast.info('error')
                }
            }, function (error) {

            });
        })
    }

    exportTopic = () => {
        console.log('导出')
        if (this.state.exportIdArray.length > 0) {
            console.log(this.state.exportIdArray);
            var param = {
                "method": 'exportPdfFlowHistoricProcessInstanceById',
                "WrongTopicBookIds": this.state.exportIdArray.join(","),
                "userId": this.state.userId,
            };
            WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
                onResponse: result => {
                    console.log(result, 'exportPdfFlowHistoricProcessInstanceById')
                    if (result.success) {
                        Toast.info('导出成功');
                        var url = result.response.fileWebPath;
                        var arr = url.split("/");
                        var newArr = (arr[arr.length - 1]).split(".");
                        var data = {
                            method: "printDoc",
                            url: url,
                            title: newArr[0]
                        }
                        Bridge.callHandler(data, null, function (error) {
                            // window.location.href = url;
                        });


                    }

                },
                onError: function (error) {
                    Toast.fail(error, 1);
                }
            });


            this.setState({
                exportFlag: false,
            })
            console.log('导出成功')
        } else {
            Toast.info('没有选中的错题', 1);
        }

    }

    closeExport = () => {
        this.setState({
            exportFlag: false,
        })
    }

    checkBoxClick(cfId, obj) {
        var exportIdArray = this.state.exportIdArray;
        console.log(this.state.exportIdArray, '复选操作前');
        if (obj.target.checked) {//選中
            exportIdArray.push(cfId);
        } else {//取消選中
            exportIdArray.splice(exportIdArray.indexOf(cfId), 1);
        }
        if (exportIdArray.length < this.state.initCheckIdLength) {
            document.getElementsByClassName('checkboxAll')[0].checked = false;
        } else {
            document.getElementsByClassName('checkboxAll')[0].checked = true;
        }
        this.setState({
            exportIdArray
        }, () => {
            console.log(this.state.exportIdArray, '复选操作后');
        })
    }

    checkBoxAllClick(obj) {
        if (obj.target.checked) {
            console.log('选中全选');
            // $('.checkbox').attr('checked','true');
            var fir = document.getElementsByClassName("checkbox");
            [].forEach.call(fir, function (value) {
                value.checked = true;
            })

            var arr = initCheckId.map((v) => {
                return v
            })

            console.log(arr, '0');

            that.setState({exportIdArray: arr})
        } else {
            console.log('取消全选')
            // $('.checkbox').removeAttr('checked');
            var fir = document.getElementsByClassName("checkbox");
            [].forEach.call(fir, function (value) {
                value.checked = false;
            })
            this.setState({
                exportIdArray: []
            }, () => {
                console.log(this.state.exportIdArray, '取消全选');
            })
        }
    }

    //科目點擊事件
    courseClick(cid, cName) {
        var courseIdArray = this.state.courseIdArray;
        console.log(cid, 'cidcid')
        this.setState({
            courseIdArray: cid,
            project: cName
        }, () => {
            this.gitErrorTagsByCourseId(this.state.courseIdArray)
        })
        // if(courseIdArray.indexOf(cid) == -1){
        //     courseIdArray.push(cid);
        // }else{
        //     courseIdArray.splice(courseIdArray.indexOf(cid),1);
        // }
        // this.setState({
        //     courseIdArray:courseIdArray
        // },()=>{
        //     if(courseIdArray.length > 0){
        //         this.gitErrorTagsByCourseId(courseIdArray.join(','))
        //     }
        // })
    }


    //時間點擊事件
    timeClick(timeText) {
        console.log(timeText);
        if (timeText == '自定义') {
            this.setState({
                customFlag: true,
                customFlagFor: true,
            })
        } else {
            this.setState({
                customFlagFor: false,
            })
        }
        this.setState({
            timeText: timeText
        })
    }


    //掌握程度點擊事件
    masteryClick(masteryId) {
        masteryId = String(masteryId);
        if (masteryId == "-1") {
            masteryIdArray = ["-1"];
        } else {
            var masteryIdArray = this.state.masteryIdArray;
            if (masteryIdArray.indexOf(masteryId) == -1) {
                masteryIdArray.push(masteryId);
                if (masteryIdArray.indexOf("-1") != -1 && masteryIdArray.length > 1) {
                    masteryIdArray.splice(masteryIdArray.indexOf("-1"), 1);
                }
            } else {
                masteryIdArray.splice(masteryIdArray.indexOf(masteryId), 1);
            }

        }
        this.setState({
            masteryIdArray: masteryIdArray
        })
    }


    //標籤點擊事件
    tagClick(tagId) {
        tagId = String(tagId);
        if (tagId == "-1") {
            tagIdArray = ["-1"];
        } else {
            var tagIdArray = this.state.tagIdArray;
            if (tagIdArray.indexOf(tagId) == -1) {
                tagIdArray.push(tagId);
                if (tagIdArray.indexOf("-1") != -1 && tagIdArray.length > 1) {
                    tagIdArray.splice(tagIdArray.indexOf("-1"), 1);
                }
            } else {
                tagIdArray.splice(tagIdArray.indexOf(tagId), 1);
            }

        }
        this.setState({
            tagIdArray: tagIdArray
        })

    }

    determine = () => {

        var warn = '';
        if (this.state.courseIdArray.length <= 0) {
            warn = '请选择科目';
        } else if (this.state.masteryIdArray.length <= 0) {
            warn = '请选择掌握程度';
        } else if (this.state.tagIdArray.length <= 0) {
            warn = '请选择标签'
        }
        if (warn != '') {
            Toast.info(warn);
            return;
        }
        if (this.state.timeText == '全部') {
            this.setState({
                startTime: WebServiceUtil.formatYMD(new Date('2000-01-01').getTime()),
                endTime: WebServiceUtil.formatYMD(new Date().getTime()),
            })
        } else if (this.state.timeText == '一月内') {
            var mouth = WebServiceUtil.formatYMD(new Date().getTime()).split('-');
            mouth[1] = mouth[1] == 1 ? 12 : mouth[1] - 1;
            this.setState({
                startTime: mouth.join('-'),
                endTime: WebServiceUtil.formatYMD(new Date().getTime())
            })
        } else if (this.state.timeText == '一周内') {
            this.setState({
                startTime: WebServiceUtil.formatYMD(new Date().getTime() - (86400000 * 7)),
                endTime: WebServiceUtil.formatYMD(new Date().getTime())
            })
        } else if (this.state.timeText == '自定义') {
            // console.log(WebServiceUtil.formatYMD(new Date(this.state.startDateForCustom).getTime()));
            // console.log(WebServiceUtil.formatYMD(new Date(this.state.endDateForCustom).getTime()));
            this.setState({
                startTime: WebServiceUtil.formatYMD(new Date(this.state.startDateForCustom).getTime()),
                endTime: WebServiceUtil.formatYMD(new Date(this.state.endDateForCustom).getTime())
            })
        }
        this.initDataSource = [];
        this.setState({
            cid: this.state.courseIdArray,
            currentProject: this.state.project,
            masteryId: this.state.masteryIdArray.join(','),
            tagId: this.state.tagIdArray.join(','),
            isLoading: true,
            defaultPageNo: 1,
        }, () => {
            console.log(this.state.cid, '科目id');
            console.log(this.state.masteryId, '掌握程度');
            console.log(this.state.tagId, '标签id');
            console.log(this.state.startTime, '开始时间');
            console.log(this.state.endTime, '结束时间');
            this.getCircleOfFriendsByUidAndCid();
            this.closeFilter();
        })


    }


    customSubmit = () => {
        this.setState({
            customFlag: false,
        })
    }

    /**
     * 跳转统计页面
     */
    toCount = () => {
        var url = WebServiceUtil.mobileServiceURL + "wrongQuestionCount?uid=" + this.state.userId + "&cid=" + this.state.cid + "&finalProject=" + this.state.currentProject;
        var data = {
            method: 'openNewPage',
            url: url
        };
        Bridge.callHandler(data, null, function (error) {
            window.location.href = url;
        });
    }

    render() {
        var createTime = null;
        const row = (rowData, sectionID, rowID) => {
            var tagClass = '';
            switch (rowData.mastery) {
                case 0:
                    tagClass = 'tag-course-red';
                    break;
                case 1:
                    tagClass = 'tag-course-orange';
                    break;
                case 2:
                    tagClass = 'tag-course-blue-text';
                    break;
                case 3:
                    tagClass = 'tag-course-green';
                    break;
            }
            var dom = "";
            var time = this.timeDifference(rowData.createTime);
            var friendsAttachments = rowData.friendsAttachments;
            for (var i = 0; i < friendsAttachments.length; i++) {
                if (friendsAttachments[i].fatherType == 1) {
                    friendsAttachments.splice(i, 1);
                }
            }

            var borderTop = null;
            if (new Date(rowData.createTime).getDay() == createTime) {
                borderTop = true;
            } else {
                borderTop = false;
            }
            console.log(borderTop);
            // console.log(new Date(rowData.createTime).getDay(),'new Date(rowData.createTime).getDay()');
            // console.log(createTime,'createTime');

            createTime = new Date(rowData.createTime).getDay();

            dom =
                <div className='my_flex month-select'>
                    <input style={
                        this.state.exportFlag ? {display: 'block'} : {display: 'none'}
                    } className="checkbox" type="checkbox" name="checked"
                           onClick={this.checkBoxClick.bind(this, rowData.cfid)}/>
                    <div className="date" style={
                        this.state.targetType == 1 ? {display: 'none'} : {display: 'block'}
                    }>
                        <div style={
                            borderTop ? {display: 'none'} : {display: 'block'}
                        }
                             className="day">{WebServiceUtil.formatMD(rowData.createTime).split('-')[1] < 10 ? '0' + WebServiceUtil.formatMD(rowData.createTime).split('-')[1] : WebServiceUtil.formatMD(rowData.createTime).split('-')[1]}</div>
                        <div style={
                            borderTop ? {display: 'none'} : {display: 'block'}
                        } className="mouth">{WebServiceUtil.formatMD(rowData.createTime).split('-')[0]}月
                        </div>
                    </div>
                    <div className="circleList" style={
                        this.state.targetType == 1 ? {width: '100%'} : {}
                    }
                         onClick={this.toThemeTaskDetail.bind(this, rowData.cfid, rowData)}>

                        <div>
                            <div style={
                                this.state.targetType == 0 ? {display: 'block'} : {display: 'none'}
                            } className="list-tags">
                                <span style={
                                    rowData.mastery || rowData.mastery == 0 ? {display: 'block'} : {display: 'none'}
                                }
                                      className={"tag-course " + tagClass}>{rowData.mastery == 0 ? '不懂' : rowData.mastery == 1 ? '略懂' : rowData.mastery == 2 ? '基本懂' : '完全懂'}</span>
                                <span style={
                                    rowData.courseInfo ? {display: 'block'} : {display: 'none'}
                                }
                                      className="tag-course tag-course-blue">{rowData.courseInfo ? rowData.courseInfo.courseName : ''}</span>

                            </div>

                            <div className={this.state.targetType  == 0? "list_content 错题本":"list_content 主题计划"}>

                                {rowData.fTags.map((value,index)=>{
                                    return <span className="myTag">【{value.tagTitle}】</span>
                                })}

                                {rowData.type == 0 ? rowData.mark : rowData.content}
                            </div>
                        </div>
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
                            <div className="deadline-line">截止时间:{WebServiceUtil.formatAllTime(rowData.endTime)}</div>
                        </div>
                        <div className="list_bottom">
                            <div className="list_bottom_item"><i className="i-share"></i></div>
                            <div className="list_bottom_item"><i
                                className="i-comments"></i><span>{rowData.disContent}</span></div>
                            <div className="list_bottom_item"><i
                                className={rowData.currentUserIsLike ? "i-praise-active" : "i-praise"}></i><span>{rowData.likeCount}</span>
                            </div>
                            <div className="list_bottom_item" onClick={this.showAlert.bind(this, rowData.cfid, rowID)}>
                                <i style={
                                    this.state.isHidden ? {display: 'none'} : {display: 'block'}
                                } className="i-delete"></i></div>
                        </div>
                    </div>
                </div>


            return (
                <div className={borderTop && this.state.targetType == 0 ? 'list_item clearBorderTop' : 'list_item'}>
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
                                <button className="filter-btn" onClick={this.setFilter}><i
                                    className="icon-screening"></i><span>筛选</span></button>
                                <button><i className="icon-statistical"></i><span onClick={this.toCount}>统计</span>
                                </button>
                                <button className='export-btn' onClick={this.setExport}><i
                                    className="icon-print"></i><span>打印</span></button>
                            </div>
                            <div className="export-header" style={
                                this.state.exportFlag ? {display: 'block'} : {display: 'none'}
                            }>
                                <div style={{display: 'inline-block'}}>
                                    <input id="2" className="checkboxAll" onClick={this.checkBoxAllClick.bind(this)}
                                           type="checkbox"/><span>全选</span></div>
                                <button className='export-btn Btn-bor-blue Btn-right' onClick={this.exportTopic}>导出
                                </button>
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

                {/*篩選*/}
                <div className="filter-content" style={
                    this.state.filterFlag ? {
                        height: this.state.clientHeight,
                        transform: 'translateX(0%)'
                    } : {height: this.state.clientHeight, transform: 'translateX(100%)'}
                }>
                    <div className="filter-info">
                        <div>
                            <div className="filter-header">科目</div>
                            <div style={{display: 'flex'}} className="filterCont">
                                {
                                    that.state.courseData.map(function (value, index) {
                                        return <span
                                            className={that.state.courseIdArray != (String(value.id)) ? "course-init" : "course-active"}
                                            onClick={that.courseClick.bind(that, String(value.id), value.name)}>{value.name}</span>
                                    })
                                }
                            </div>
                        </div>
                        <div>
                            <div className="filter-header">发布时间</div>
                            <div style={{display: 'flex'}} className="filterCont">
                                <span className={this.state.timeText == '全部' ? "time-active" : "time-init"}
                                      onClick={this.timeClick.bind(this, '全部')}>全部</span>
                                <span className={this.state.timeText == '一周内' ? "time-active" : "time-init"}
                                      onClick={this.timeClick.bind(this, '一周内')}>一周内</span>
                                <span className={this.state.timeText == '一月内' ? "time-active" : "time-init"}
                                      onClick={this.timeClick.bind(this, '一月内')}>一月内</span>
                                <span className={this.state.timeText == '自定义' ? "time-active" : "time-init"}
                                      onClick={this.timeClick.bind(this, '自定义')}>自定义</span>

                            </div>
                        </div>
                        <div>
                            <div className="filter-header">掌握程度</div>
                            <div style={{display: 'flex'}} className="filterCont">
                                <span
                                    className={this.state.masteryIdArray.indexOf("-1") == -1 ? 'mastery-init' : 'mastery-active'}
                                    onClick={this.masteryClick.bind(this, -1)}>全部</span>
                                <span
                                    className={this.state.masteryIdArray.indexOf("0") == -1 ? 'mastery-init' : 'mastery-active'}
                                    onClick={this.masteryClick.bind(this, 0)}>不懂</span>
                                <span
                                    className={this.state.masteryIdArray.indexOf("1") == -1 ? 'mastery-init' : 'mastery-active'}
                                    onClick={this.masteryClick.bind(this, 1)}>略懂</span>
                                <span
                                    className={this.state.masteryIdArray.indexOf("2") == -1 ? 'mastery-init' : 'mastery-active'}
                                    onClick={this.masteryClick.bind(this, 2)}>基本懂</span>
                                <span
                                    className={this.state.masteryIdArray.indexOf("3") == -1 ? 'mastery-init' : 'mastery-active'}
                                    onClick={this.masteryClick.bind(this, 3)}>完全懂</span>
                            </div>
                        </div>
                        <div>
                            <div className="filter-header">标签</div>
                            <div style={{display: 'flex'}} className="filterCont">
                                {
                                    this.state.tagData.map(function (value, index) {
                                        return <span
                                            className={that.state.tagIdArray.indexOf(String(value.tagId)) == -1 ? 'tag-init' : 'tag-active'}
                                            onClick={that.tagClick.bind(that, String(value.tagId))}>{value.tagTitle}</span>
                                    })
                                }
                            </div>
                        </div>
                    </div>
                    <div className="filterFooter">
                        <button onClick={this.closeFilter}>取消</button>
                        <button onClick={this.determine} className="blueBtn">确定</button>
                    </div>
                </div>
                {/*发布时间*/}
                <div className="customMask" style={
                    this.state.timeText == '自定义' && this.state.customFlag ? {display: 'block'} : {display: 'none'}
                }>
                    <div className='custom'>
                        <div className="custom-header">选择时间</div>
                        <div className="startTime">
                            <span>开始时间</span>
                            <DatePicker
                                mode="date"
                                title=""
                                extra="开始时间"
                                value={this.state.startDateForCustom}
                                onChange={startDateForCustom => this.setState({startDateForCustom})}
                            >
                                <List.Item arrow="horizontal"></List.Item>
                            </DatePicker>
                        </div>
                        <div className="endTime">
                            <span>结束时间</span>
                            <DatePicker
                                mode="date"
                                title=""
                                extra="结束时间"
                                value={this.state.endDateForCustom}
                                onChange={endDateForCustom => this.setState({endDateForCustom})}
                            >
                                <List.Item arrow="horizontal"></List.Item>
                            </DatePicker>
                        </div>
                        <button className="blueBtn" onClick={this.customSubmit}>确定</button>
                    </div>
                </div>
                {/*篩選　ｅｎｄ*/}

                <div className="mask" onClick={this.closeFilter} style={
                    this.state.filterFlag ? {
                        height: this.state.clientHeight,
                        display: 'block'
                    } : {height: this.state.clientHeight, display: 'none'}
                }></div>
            </div>
        );
    }

}