import React from 'react';
import { WhiteSpace, SearchBar, Button, WingBlank, Tabs, ListView, Toast } from 'antd-mobile';
import "../css/serachResult.less";
var calm;
const dataSource = new ListView.DataSource({
    rowHasChanged: (row1, row2) => row1 !== row2,
});

const tabs = [
    { title: '文章', value: "0" },
    { title: '视频', value: "1" },
    { title: '用户', value: "2" },
    { title: '圈子', value: "3" },
];
export default class serachResult extends React.Component {
    constructor(props) {
        super(props);
        calm = this;
        this.initDataSource = [];
        this.state = {
            dataSource: dataSource.cloneWithRows(this.initDataSource),
            clientHeight: document.body.clientHeight,
            defaultPageNo: 1,
            isLoading: true,
            hasMore: true,
            searchHistory: [],
            searghValue: "",
            videoData: [],
            val: 2,
            pageChange: 0
        }
    }
    componentWillMount() {
        var searchJsonStr = localStorage.getItem('serachArr');
        var searchArray = JSON.parse(searchJsonStr) || [];
        var newSearchArray = []
        for (var i = 0; i < searchArray.length; i++) {
            if (newSearchArray.indexOf(searchArray[i]) == -1) {  //判断在s数组中是否存在，不存在则push到s数组中
                newSearchArray.push(searchArray[i]);
            }
        }
        calm.setState({
            searchHistory: newSearchArray
        })
        window.addEventListener('resize', this.onWindwoResize);
    }
    componentDidMount() {
        document.title = "搜索结果"
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var searghValue = decodeURI(searchArray[0].split('=')[1]);
        var userId = searchArray[1].split('=')[1];

        if (calm.state.pageChange == 0) {
            calm.searchArtical(searghValue, userId)
           
        }
        if (calm.state.pageChange == 1) {
            calm.searchVideo(searghValue, userId)
        }
        if (calm.state.pageChange == 2) {
            calm.searchPeople(searghValue, userId)
        }
        if (calm.state.pageChange == 3) {
            calm.searchCircle(searghValue, userId)
        }
        calm.setState({
            value: searghValue,
            userId
        }, () => {
            $('.am-search-value').keydown(function (event) {
                if (event.keyCode == 13) {
                    calm.initDataSource = [];
                    calm.setState({
                        dataSource: dataSource.cloneWithRows(calm.initDataSource),
                        defaultPageNo: 1,
                        isLoading: true,
                        hasMore: true,
                    }, () => {
                        if (calm.state.pageChange == 0) {
                            calm.serach();
                            calm.searchArtical(calm.state.value, userId)

                        }
                        if (calm.state.pageChange == 1) {
                            calm.serach();
                            calm.searchVideo(calm.state.value, userId)
                        }
                        if (calm.state.pageChange == 2) {
                            calm.serach();
                            calm.searchPeople(calm.state.value, userId)
                        }
                        if (calm.state.pageChange == 3) {
                            calm.serach();
                            calm.searchCircle(calm.state.value, userId)
                        }

                    })
                }
            })
        })

    }
    /**
     * 视频搜索结果
     */
    searchVideo = (value, userId) => {
        this.setState({ isLoadingLeft: true });
        var param = {
            "method": 'searchVideoLiketest',
            "test": value,
            "type": 1,
            "uid": userId,
            "pageNo": calm.state.defaultPageNo,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                // alert(JSON.stringify(result.response.littleVideoInfo.length))
                if (result.success) {
                    calm.state.rsCount = result.pager.rsCount;
                    calm.state.pageCount = result.pager.pageCount;
                    calm.state.pageNo = result.pager.pageNo;
                    // calm.state.videoData = result.response.littleVideoInfo
                    if (calm.state.defaultPageNo == 1) {
                        calm.state.videoData.splice(0);
                    }
                    calm.setState({
                        videoData: calm.state.videoData.concat(result.response.littleVideoInfo)
                    })
                    calm.initDataSource = calm.initDataSource.concat(result.response.littleVideoInfo);
                    calm.setState({
                        dataSource: dataSource.cloneWithRows(calm.initDataSource),
                        isLoading: false,
                        isLoadingLeft: false
                    })
                    if (calm.initDataSource.length == result.pager.rsCount) {
                        calm.setState({
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
   * 用户搜索结果
   */
    searchPeople = (value, userId) => {
        this.setState({ isLoadingLeft: true });
        var param = {
            "method": 'searchVideoLiketest',
            "test": value,
            "type": 2,
            "uid": userId,
            "pageNo": calm.state.defaultPageNo,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                // alert(JSON.stringify(result.response.littleVideoInfo.length))
                if (result.success) {
                    calm.state.rsCount = result.pager.rsCount;
                    calm.state.pageCount = result.pager.pageCount;
                    calm.state.pageNo = result.pager.pageNo;
                    // calm.state.videoData = result.response.littleVideoInfo
                    if (calm.state.defaultPageNo == 1) {
                        calm.state.videoData.splice(0);
                    }
                    calm.setState({
                        videoData: calm.state.videoData.concat(result.response.LittleVideoUser)
                    })
                    calm.initDataSource = calm.initDataSource.concat(result.response.LittleVideoUser);
                    calm.setState({
                        dataSource: dataSource.cloneWithRows(calm.initDataSource),
                        isLoading: false,
                        isLoadingLeft: false
                    })
                    if (calm.initDataSource.length == result.pager.rsCount) {
                        calm.setState({
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
   * 自媒体文章搜索
   */
    searchArtical = (value, userId) => {
        this.setState({ isLoadingLeft: true });
        var param = {
            "method": 'searchVideoLiketest',
            "test": value,
            "type": 0,
            "uid": userId,
            "pageNo": calm.state.defaultPageNo,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                console.log(result, "自媒体文章");
                // alert(JSON.stringify(result.response.littleVideoInfo.length))
                if (result.success) {
                    calm.state.rsCount = result.pager.rsCount;
                    calm.state.pageCount = result.pager.pageCount;
                    calm.state.pageNo = result.pager.pageNo;
                    // calm.state.videoData = result.response.littleVideoInfo
                    if (calm.state.defaultPageNo == 1) {
                        calm.state.videoData.splice(0);
                    }
                    calm.setState({
                        videoData: calm.state.videoData.concat(result.response.ArticleInfo)
                    })
                    calm.initDataSource = calm.initDataSource.concat(result.response.ArticleInfo);
                    calm.setState({
                        dataSource: dataSource.cloneWithRows(calm.initDataSource),
                        isLoading: false,
                        isLoadingLeft: false
                    })
                    if (calm.initDataSource.length == result.pager.rsCount) {
                        calm.setState({
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
   * 圈子搜索
   */
    searchCircle = (value, userId) => {
        this.setState({ isLoadingLeft: true });
        var param = {
            "method": 'searchVideoLiketest',
            "test": value,
            "type": 3,
            "uid": userId,
            "pageNo": calm.state.defaultPageNo,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                console.log(result, "圈子");
                // alert(JSON.stringify(result.response.littleVideoInfo.length))
                if (result.success) {
                    calm.state.rsCount = result.pager.rsCount;
                    calm.state.pageCount = result.pager.pageCount;
                    calm.state.pageNo = result.pager.pageNo;
                    // calm.state.videoData = result.response.littleVideoInfo
                    if (calm.state.defaultPageNo == 1) {
                        calm.state.videoData.splice(0);
                    }
                    calm.setState({
                        videoData: calm.state.videoData.concat(result.response.CircleOfFriends)
                    })
                    calm.initDataSource = calm.initDataSource.concat(result.response.CircleOfFriends);
                    calm.setState({
                        dataSource: dataSource.cloneWithRows(calm.initDataSource),
                        isLoading: false,
                        isLoadingLeft: false
                    })
                    if (calm.initDataSource.length == result.pager.rsCount) {
                        calm.setState({
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
    *  带审核的ListView数据全部渲染完毕的回调
    */
    onEndReached1 = (event) => {
        var _this = this;
        var currentPageNo = _this.state.defaultPageNo;
        if (!_this.state.isLoading && !_this.state.hasMore) {
            console.log('阻止请求')
            return;
        }
        currentPageNo += 1;
        _this.setState({
            isLoading: true,
            defaultPageNo: currentPageNo,
        }, () => {
            _this.searchArtical(calm.state.value, calm.state.userId);
        });
    };


    /**
   *  带审核的ListView数据全部渲染完毕的回调
   */
    onEndReached2 = (event) => {
        var _this = this;
        var currentPageNo = _this.state.defaultPageNo;
        if (!_this.state.isLoading && !_this.state.hasMore) {
            console.log('阻止请求2')
            return;
        }
        currentPageNo += 1;
        _this.setState({
            isLoading: true,
            defaultPageNo: currentPageNo,
        }, () => {
            _this.searchVideo(calm.state.value, calm.state.userId);
        });
    };
    /**
   *  带审核的ListView数据全部渲染完毕的回调
   */
    onEndReached3 = (event) => {
        var _this = this;
        var currentPageNo = _this.state.defaultPageNo;
        if (!_this.state.isLoading && !_this.state.hasMore) {
            console.log('阻止请求2')
            return;
        }
        currentPageNo += 1;
        _this.setState({
            isLoading: true,
            defaultPageNo: currentPageNo,
        }, () => {
            _this.searchPeople(calm.state.value, calm.state.userId);
        });
    };
    /**
   *  带审核的ListView数据全部渲染完毕的回调
   */
    onEndReached4 = (event) => {
        var _this = this;
        var currentPageNo = _this.state.defaultPageNo;
        if (!_this.state.isLoading && !_this.state.hasMore) {
            console.log('阻止请求2')
            return;
        }
        currentPageNo += 1;
        _this.setState({
            isLoading: true,
            defaultPageNo: currentPageNo,
        }, () => {
            _this.searchCircle(calm.state.value, calm.state.userId);
        });
    };

    /**
     * 搜索输入框改变的时候
     */
    onChange = (value) => {
        this.setState({ value, defaultPageNo: 1 });
    };
    /**
     * 点击搜索事件
     */
    serach = () => {
      
        /**
         * 取session数据
         */
        var searchJsonStr = localStorage.getItem('serachArr');
        var searchArray = JSON.parse(searchJsonStr) || [];
        var newSearchArray = []
        for (var i = 0; i < searchArray.length; i++) {
            if (newSearchArray.indexOf(searchArray[i]) == -1) {  //判断在s数组中是否存在，不存在则push到s数组中
                newSearchArray.push(searchArray[i]);
            }
        }
        calm.setState({
            searchHistory: newSearchArray
        })
       
        calm.state.searchHistory.push(calm.state.value)
        calm.setState({
            searchHistory: calm.state.searchHistory
        })
        localStorage.setItem('serachArr', JSON.stringify(calm.state.searchHistory));
    }
    /**
     * 返回搜索结果页面
     */
    toSearchHistory = () => {
     
        var data = {
            method: 'finishForRefresh',
        };

        Bridge.callHandler(data, null, function (error) {
            console.log(error);
        });
       
    }

    //监听窗口改变时间
    onWindwoResize() {
        // this
        setTimeout(() => {
            calm.setState({
                clientHeight: calm.state.clientHeight,
            })
        }, 100)
    }

    //播放视频
    toPlayVideo(videoIndex, recommended_video, recommended_pageCount, recommended_pageNo) {
        var data = {
            method: 'playVideo',
            keyWord: calm.state.value,
            videos: recommended_video,
            position: videoIndex,
            pageNo: recommended_pageNo,
            pageCount: recommended_pageCount
        };
        Bridge.callHandler(data, null, function (error) {
            console.log('开启小视频失败', error)
        });
    }

    /**
       * Tab栏切换
       */
    tagOnChange(val) {
        calm.setState({
            val: val.value
        })
        if (val.value == 0) {
            calm.initDataSource = [];
            calm.setState({
                dataSource: dataSource.cloneWithRows(calm.initDataSource),
                defaultPageNo: 1,
                isLoading: true,
                hasMore: true,
                pageChange: 0
            }, () => {
                calm.searchArtical(calm.state.value, calm.state.userId);

            })
        }
        if (val.value == 1) {
            calm.initDataSource = [];
            calm.setState({
                dataSource: dataSource.cloneWithRows(calm.initDataSource),
                defaultPageNo: 1,
                isLoading: true,
                hasMore: true,
                pageChange: 1
            }, () => {
                calm.searchVideo(calm.state.value, calm.state.userId)

            })
        }
        if (val.value == 2) {
        console.log(val.value)

            calm.initDataSource = [];
            calm.setState({
                dataSource: dataSource.cloneWithRows(calm.initDataSource),
                defaultPageNo: 1,
                isLoading: true,
                hasMore: true,
                pageChange: 2
            }, () => {
                calm.searchPeople(calm.state.value, calm.state.userId);

            })
        }
        if (val.value == 3) {
            calm.initDataSource = [];
            calm.setState({
                dataSource: dataSource.cloneWithRows(calm.initDataSource),
                defaultPageNo: 1,
                isLoading: true,
                hasMore: true,
                pageChange: 3
            }, () => {
                calm.searchCircle(calm.state.value, calm.state.userId);
            })
        }
     
    }
    /**
     * 关注
     */
    toLook = (id) => {
        var param = {
            "method": 'changeUserFollowInfo',
            "userFollowInfoJson": {
                "userId": calm.state.userId,
                "targetId": id,
                "targetType": 0
            },
            "changeType": 0,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                // alert(JSON.stringify(result.response.littleVideoInfo.length))
                if (result.success) {
                    calm.initDataSource.forEach((v,i)=>{
                        if(v.uid == id){
                            console.log(v)
                            v.isFollow = true;
                        }
                    })
                    calm.setState({
                        dataSource:dataSource.cloneWithRows(this.initDataSource)
                    })

                    Toast.info("关注成功", 1)
                    
                }
            },
            onError: function (error) {

            }
        });

    }
    /**
     * 跳转
     */
    toCenterInfo = (item) => {
        var data = {
            method: 'toUserpage',
            user: item
        };
        Bridge.callHandler(data, null, function (error) {
            console.log(error)
        });
    }
    /**
     * 播放视频
     */
    playVideo(url,event){

        event.stopPropagation();
        console.log(url);
        var data = {
            method: 'playChatVideo',
            playUrl: url
        };
        window.parent.Bridge.callHandler(data, function () {
        }, function (error) {
            Toast.info('開啓視頻失敗!');
        });
        // console.log(e,'eeeeeeeeeeee');
        // e.nativeEvent.stopImmediatePropagation();
    }
    /**
     * 分享
     */
    toShare = (cid,userName,type,event) => {
        event.stopPropagation();
        var data = {
            method: 'shareWechat',
            shareUrl: WebServiceUtil.mobileServiceURL + "themeTaskDetail?userId=" + this.state.userId+"&cfid="+cid+"&type="+type,
            shareTitle: $('.list_content').text(),
            shareUserName: userName,
        };
        Bridge.callHandler(data, null, function (error) {
            Toast.info('分享文章失败')
        });
    }

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
    toThemeTaskDetail(cid,rowData){
        console.log(rowData.type);
        var url = WebServiceUtil.mobileServiceURL + "themeTaskDetail?userId=" + calm.state.userId+"&cfid="+cid+"&type="+rowData.type;
        var data = {
            method: 'openNewPage',
            url: url
        };
        Bridge.callHandler(data, null, function (error) {
            window.location.href = url;
        });
    }
    // dangerouslySetInnerHTML={{ __html: calm.state.data.articleContent }}
    render() {
         // 文章
         const row0 = (rowData, sectionID, rowID) => {
            var dom =  "";
            var time = calm.timeDifference(rowData.createTime);
            console.log(rowData)
            var image = rowData.articleImgArray ? rowData.articleImgArray : [];
            // console.log(rowData,'整体循环中的rowData')
            if (rowData.response instanceof Array) {  //为自媒体推荐视频
                var videoDom = [];
                // console.log(rowData,'自媒体视频循环中listVideoInfo')
                for (var i = 0; i < rowData.response.length; i++) {
                    videoDom.push(
                        <div className="video_row"
                             onClick={this.toPlayVideo.bind(this, i, rowData.response, rowData.pager.pageCount, rowData.pager.pageNo)}>
                            <img className="video_firstImage"
                                 src={rowData.response[i].coverPath == '' ? rowData.response[i].firstUrl : rowData.response[i].coverPath}
                                 alt=""/>
                            <div className="gradient_bgT topText">
                                <div className="video_content">{rowData.response[i].videoContent}</div>
                            </div>
                            <div className='gradient_bgB bottomText'>
                                <div className="like">{rowData.response[i].likeCount}赞</div>
                                <div className="read">{rowData.response[i].readCount}</div>
                            </div>

                        </div>
                    )
                }
                dom = <div className="video_box line_public">{videoDom}</div>;
            } else {
                if (image.length == 1) {  //图片一张
                    dom = <div className="item line_public">
                        <div className="leftBox">
                            <div className="title minHeight">{rowData.articleTitle}</div>
                            <div className="bottom">
                                <div className="read">{rowData.readCount}阅读</div>
                                <div className="like">{rowData.likeCount}点赞</div>
                                <div className="time">{time}</div>
                            </div>
                        </div>
                        <div className="rightBox" style={{backgroundImage: 'url(' + image[0] + ')'}}>
                            {/*<img src={image[0]} alt=""/>*/}
                        </div>
                    </div>
                } else if (image.length > 1) {    //图片大于一张
                    var imageDom = [];
                    for (var i = 0; i < image.length; i++) {
                        imageDom.push(<div className='imageDiv'><span
                            style={{backgroundImage: 'url(' + image[i] + ')'}}
                            className="image3"
                        ></span></div>)
                    }
                    dom = <div className="item line_public">
                        <div className="title">{rowData.articleTitle}</div>
                        <div className="images">{imageDom}</div>
                        <div className="bottom">
                            <div className="read">{rowData.readCount}阅读</div>
                            <div className="like">{rowData.likeCount}点赞</div>
                            <div className="time">{time}</div>
                        </div>
                    </div>
                } else {                //图片没有
                    var videoFlag = false;
                    if (videoFlag) { //有视频
                        dom = <div className="item line_public">
                            <div className="title">{rowData.articleTitle}</div>
                            <div className="images">
                                <div className="videoBox">
                                    <div onClick={this.toDetail.bind(this, rowData.articleId, rowData.articleTitle)}
                                         className="videoMask"></div>
                                    <img onClick={this.toDetail.bind(this, rowData.articleId, rowData.articleTitle)}
                                         className="playImg"
                                        //  src={require('../images/videoClick.png')} 
                                         alt=""/>
                                    <video src="http://www.w3school.com.cn/example/html5/mov_bbb.mp4"></video>
                                </div>
                            </div>
                            <div className="bottom">
                                <div className="read">{rowData.readCount}阅读</div>
                                <div className="like">{rowData.likeCount}点赞</div>
                                <div className="time">{time}</div>
                            </div>
                        </div>
                    } else {  //图片没有 视频也没有
                        dom = <div className="item line_public">
                            <div className="title">{rowData.articleTitle}</div>
                            <div className="bottom">
                                <div className="read">{rowData.readCount}阅读</div>
                                <div className="like">{rowData.likeCount}点赞</div>
                                <div className="time">{time}</div>
                            </div>
                        </div>
                    }

                }
            }
            return (
                <div className="User-Search line_public">
                <span>{rowData.articleTitle}</span>
                <span>{rowData.isTop == 1 ? <span>置顶</span>:""}</span>
                <span>点赞{rowData.likeCount}</span>
                <span>阅读{rowData.readCount}</span>
                <div className="createTime">{WebServiceUtil.formatYMD(rowData.createTime)}</div>
                {/* <span>{WebServiceUtil.formatM(new Date().getTime() - rowData.createTime)}分钟前</span> */}
                </div>
            )
        }
        // 视频
        const row1 = (rowData, sectionID, rowID) => {
            // console.log(rowData.tags, "rowdata")
            rowData.tags = rowData.tags || [];
            var newTagArr = [];
            var newChanArr = [];
            rowData.tags.forEach((v, i) => {
                if (v.tagType == 1) {
                    newTagArr.push(v)
                }
                if (v.tagType == 2) {
                    newChanArr.push(v)
                }
            })
          
            return (
                <div className='videoItem' >
                    {
                        <div className="videoInfo" onClick={this.toPlayVideo.bind(this, rowID, calm.state.videoData, calm.state.pageCount, calm.state.pageNo)}>
                            <img src={rowData.coverPath} alt="" />
                            <div className="gradient_bgT topText">
                                <div dangerouslySetInnerHTML={{ __html: rowData.videoContent }} className="video_content"></div>
                            </div>
                            <div className="search-bottom">

                            {

                                newTagArr.length == 0 ?
                                    ""
                                    :
                                    <div className="i-label">
                                        <i></i>
                                        <span>
                                            {
                                                newTagArr.map((v, i) => {
                                                    return (
                                                        <span>
                                                            <span dangerouslySetInnerHTML={{ __html: v.tagTitle }} className="tag"></span>{newTagArr.length-1 == i ? "":","}
                                                        </span>
                                                    )
                                                })

                                            }
                                        </span>


                                    </div>
                            }
                            <div className='gradient_bgB bottomText'>
                                <div className="like"><i></i>{rowData.likeCount}</div>
                                {/* tagType==1标签  2挑战 */}
                                {
                                    newChanArr.length == 0 ?
                                        ""
                                        :
                                        <div className="i-challenge">
                                            <i></i>
                                            {
                                                newChanArr.map((v, i) => {
                                                    return (
                                                        <span  dangerouslySetInnerHTML={{ __html: v.tagTitle }} className="tag text_hidden"></span>
                                                    )
                                                })

                                            }

                                        </div>
                                }
                                {/* <div className="read">{rowData.readCount}</div> */}
                            </div>
                        </div>
                        </div>
                    }
                </div>
            )
        }
        //   用户
        const row2 = (rowData, sectionID, rowID) => {
            return (
                <div className="User-Search line_public">
                    <img className="user" onClick={calm.toCenterInfo.bind(this,rowData)} src={rowData.avatar} />
                    <div className="user-name">
                        <div className="name">{rowData.userName}</div>
                        <div className="fans">粉丝：{rowData.fansCount}</div>
                    </div>
                    {
                        rowData.isFollow ?
                            <button className="attentionBtn attentionBtn-old">已关注</button>
                            :
                            <button className="attentionBtn" onClick={calm.toLook.bind(this,rowData.uid)}><i></i>关注</button>

                    }

                </div>
            )
        }
        // 圈子
        const row3= (rowData, sectionID, rowID) => {
            rowData.userInfo  = rowData.userInfo || {}
            var tagClass = '';
            switch(rowData.mastery){
                case 0:
                    tagClass='tag-WrongTopic-red';
                    break;
                case 1:
                    tagClass='tag-WrongTopic-orange';
                    break;
                case 2:
                    tagClass='tag-WrongTopic-yellow';
                    break;
                case 3:
                    tagClass='tag-WrongTopic-green';
                    break;
                default:
                    tagClass='未匹配到';
                    break;
            }
            var friendsAttachments = rowData.friendsAttachments || [];
            for (var i = 0; i < friendsAttachments.length; i++) {
                if (friendsAttachments[i].fatherType == 1) {
                    friendsAttachments.splice(i, 1);
                }
            }
            return (
                <div  className="circleList" onClick={this.toThemeTaskDetail.bind(this,rowData.cfid,rowData)}>
                    <div className="list_head">
                        <div className="headPic">
                            <img src={rowData.userInfo.avatar} alt=""/>
                        </div>
                        <div className="userName text_hidden">{rowData.userInfo.userName}</div>
                        <div className="createTime">{WebServiceUtil.formatYMD(rowData.createTime)}</div>

                    </div>
                    <div className="tags"><span className={rowData.type== 1 ?"tag-ThemeTask":"tag-WrongTopic "+tagClass}>{rowData.type?'':''}</span></div>
                    <div className="list_content">{rowData.type == 1?rowData.content:rowData.mark}</div>
                    <div className="list_image" style={
                        friendsAttachments.length == 0 ? {display: 'none'} : {display: 'block'}
                    }>
                        {friendsAttachments.map((value, index) => {
                            if(value.type == 0){
                                return <img style={
                                    friendsAttachments.length == 1 ? {width: '200',height:'113'} : {
                                        display: 'inline-block'
                                    }
                                } src={value.path} alt=""/>
                            }else{
                                return <div className="video_tag" style={
                                    friendsAttachments.length == 1 ? {maxWidth: '100%'} : {
                                        display: 'inline-block'
                                    }
                                } >
                                    <video poster={value.coverPath} onClick={this.playVideo.bind(this,value.path)} style={{width:'100%',height:'100%'}} src={value.path} alt=""/>
                                    <div onClick={this.playVideo.bind(this,value.path)} className="video_tag_play"></div>
                                </div>
                            }

                        })}
                    </div>
                    <div className="list_bottom">
                        <div className="list_bottom_item" onClick={calm.toShare.bind(this,rowData.cfid,rowData.userInfo.userName,rowData.type)}><i className="i-share">分享</i></div>
                        <div className="list_bottom_item"><i className="i-comments"></i><span>{rowData.disContent}</span></div>
                        <div className="list_bottom_item"><i className="i-praise"></i><span>{rowData.likeCount}</span></div>
                    </div>
                </div>
            )
        }

        return (
            <div id="serachResult">
                <SearchBar id="searchResult"
                    value={calm.state.value}
                    // onSubmit={value => console.log(value, 'onSubmit')}
                    // onClear={value => console.log(value, 'onClear')}
                    // onFocus={() => console.log('onFocus')}
                    // onBlur={() => console.log('onBlur')}
                    onCancel={calm.toSearchHistory}
                    onChange={this.onChange}
                    placeholder="请输入搜索内容"
                    maxLength={8} />
                <Tabs
                    tabs={tabs}
                    useOnPan={false}
                    onChange={calm.tagOnChange}
                    initialPage={calm.state.pageChange}
                >
                {/* 文章 */}
                    <div style={{
                        height: calm.state.clientHeight - 36 - 44,
                        backgroundColor: '#f4f4f4'
                    }} className="listCont">
                        <ListView
                            ref={el => this.lv = el}
                            dataSource={this.state.dataSource}    //数据类型是 ListViewDataSource
                            renderFooter={() => (
                                <div style={{ paddingTop: 5, paddingBottom: 0, textAlign: 'center' }}>
                                    {this.state.isLoadingLeft ? '正在加载' : '已经全部加载完毕'}
                                </div>)}
                            renderRow={row0}   //需要的参数包括一行数据等,会返回一个可渲染的组件为这行数据渲染  返回renderable
                            className="am-list uploadVideo video-body"
                            pageSize={30}    //每次事件循环（每帧）渲染的行数
                            //useBodyScroll  //使用 html 的 body 作为滚动容器   bool类型   不应这么写  否则无法下拉刷新
                            scrollRenderAheadDistance={200}   //当一个行接近屏幕范围多少像素之内的时候，就开始渲染这一行
                            onEndReached={this.onEndReached1}  //当所有的数据都已经渲染过，并且列表被滚动到距离最底部不足onEndReachedThreshold个像素的距离时调用
                            onEndReachedThreshold={10}  //调用onEndReached之前的临界值，单位是像素  number类型
                            initialListSize={30}   //指定在组件刚挂载的时候渲染多少行数据，用这个属性来确保首屏显示合适数量的数据
                            scrollEventThrottle={20}     //控制在滚动过程中，scroll事件被调用的频率
                            style={{
                                height: calm.state.clientHeight - 36 - 44,
                            }}
                        />
                    </div>
                    {/* 视频 */}
                    <div style={{
                        height: calm.state.clientHeight - 36 - 44,
                        backgroundColor: '#f4f4f4'
                    }} className="listCont">
                        <ListView
                            ref={el => this.lv = el}
                            dataSource={this.state.dataSource}    //数据类型是 ListViewDataSource
                            renderFooter={() => (
                                <div style={{ paddingTop: 5, paddingBottom: 0, textAlign: 'center' }}>
                                    {this.state.isLoadingLeft ? '正在加载' : '已经全部加载完毕'}
                                </div>)}
                            renderRow={row1}   //需要的参数包括一行数据等,会返回一个可渲染的组件为这行数据渲染  返回renderable
                            className="am-list uploadVideo"
                            pageSize={30}    //每次事件循环（每帧）渲染的行数
                            //useBodyScroll  //使用 html 的 body 作为滚动容器   bool类型   不应这么写  否则无法下拉刷新
                            scrollRenderAheadDistance={200}   //当一个行接近屏幕范围多少像素之内的时候，就开始渲染这一行
                            onEndReached={this.onEndReached2}  //当所有的数据都已经渲染过，并且列表被滚动到距离最底部不足onEndReachedThreshold个像素的距离时调用
                            onEndReachedThreshold={10}  //调用onEndReached之前的临界值，单位是像素  number类型
                            initialListSize={30}   //指定在组件刚挂载的时候渲染多少行数据，用这个属性来确保首屏显示合适数量的数据
                            scrollEventThrottle={20}     //控制在滚动过程中，scroll事件被调用的频率
                            style={{
                                height: calm.state.clientHeight - 36 - 44,
                            }}
                        />
                    </div>
                      {/* 用户 */}
                      <div style={{
                        height: calm.state.clientHeight - 36 - 44,
                        backgroundColor: '#f4f4f4'
                    }} className="listCont">
                        <ListView
                            ref={el => this.lv = el}
                            dataSource={this.state.dataSource}    //数据类型是 ListViewDataSource
                            renderFooter={() => (
                                <div style={{ paddingTop: 5, paddingBottom: 0, textAlign: 'center' }}>
                                    {this.state.isLoadingLeft ? '正在加载' : '已经全部加载完毕'}
                                </div>)}
                            renderRow={row2}   //需要的参数包括一行数据等,会返回一个可渲染的组件为这行数据渲染  返回renderable
                            className="am-list uploadVideo"
                            pageSize={30}    //每次事件循环（每帧）渲染的行数
                            //useBodyScroll  //使用 html 的 body 作为滚动容器   bool类型   不应这么写  否则无法下拉刷新
                            scrollRenderAheadDistance={200}   //当一个行接近屏幕范围多少像素之内的时候，就开始渲染这一行
                            onEndReached={this.onEndReached3}  //当所有的数据都已经渲染过，并且列表被滚动到距离最底部不足onEndReachedThreshold个像素的距离时调用
                            onEndReachedThreshold={10}  //调用onEndReached之前的临界值，单位是像素  number类型
                            initialListSize={30}   //指定在组件刚挂载的时候渲染多少行数据，用这个属性来确保首屏显示合适数量的数据
                            scrollEventThrottle={20}     //控制在滚动过程中，scroll事件被调用的频率
                            style={{
                                height: calm.state.clientHeight - 36 - 44,
                            }}
                        />
                    </div>
                      {/* 圈子 */}
                      <div style={{
                        height: calm.state.clientHeight - 36 - 44,
                        backgroundColor: '#f4f4f4'
                    }} className="listCont">
                        <ListView
                            ref={el => this.lv = el}
                            dataSource={this.state.dataSource}    //数据类型是 ListViewDataSource
                            renderFooter={() => (
                                <div style={{ paddingTop: 5, paddingBottom: 0, textAlign: 'center' }}>
                                    {this.state.isLoadingLeft ? '正在加载' : '已经全部加载完毕'}
                                </div>)}
                            renderRow={row3}   //需要的参数包括一行数据等,会返回一个可渲染的组件为这行数据渲染  返回renderable
                            className="am-list uploadVideo"
                            pageSize={30}    //每次事件循环（每帧）渲染的行数
                            //useBodyScroll  //使用 html 的 body 作为滚动容器   bool类型   不应这么写  否则无法下拉刷新
                            scrollRenderAheadDistance={200}   //当一个行接近屏幕范围多少像素之内的时候，就开始渲染这一行
                            onEndReached={this.onEndReached4}  //当所有的数据都已经渲染过，并且列表被滚动到距离最底部不足onEndReachedThreshold个像素的距离时调用
                            onEndReachedThreshold={10}  //调用onEndReached之前的临界值，单位是像素  number类型
                            initialListSize={30}   //指定在组件刚挂载的时候渲染多少行数据，用这个属性来确保首屏显示合适数量的数据
                            scrollEventThrottle={20}     //控制在滚动过程中，scroll事件被调用的频率
                            style={{
                                height: calm.state.clientHeight - 36 - 44,
                            }}
                        />
                    </div>
                </Tabs>
            </div>
        )
    }
}