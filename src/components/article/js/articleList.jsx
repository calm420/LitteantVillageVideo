import React from 'react';
import {
    Toast, DatePicker, PullToRefresh, ListView, Button, List, Picker, Tag, Tabs
} from 'antd-mobile';
import '../css/articleList.less';

var dataSource = new ListView.DataSource({
    rowHasChanged: (row1, row2) => row1 !== row2,
});
const tabs = [
    {title: '本校', value: '0'},
    {title: '热点', value: '1'},
    {title: '圈子', value: '2'}
];
var AscrollView;
var BscrollView;
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
            index: 0,
            userRoot: true,
            recommended_video: {
                response: []
            },
            refreshing: false,
            show_bottom_text: true,
            scrollFlag: false,
            initLoading: true,
            noomPullFlag: true,   //list是否滚动到最顶端
            defaultPageNoForCircle: 1,
            // 显示发布菜单
            showPubliFlag: false,
        }
    }

    componentDidMount() {
        AscrollView = $('.am-list-view-scrollview').eq(0);
        BscrollView = $('.am-list-view-scrollview').eq(1);
        var _this = this;
        Bridge.setShareAble("false");
        document.title = '文章列表';
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var userId = searchArray[0].split('=')[1];
        var machineType = searchArray[1] ? searchArray[1].split('=')[1] : '';
        var version = searchArray[2] ? searchArray[2].split('=')[1] : '';
        this.setState({
            userId: userId,
            machineType: machineType,
            version: version
        }, () => {
            var p1 = new Promise((reslove, reject) => {
                this.getLittleVideoUserById(() => {
                    reslove('getLittleVideoUserById');
                });
            })
            var p2 = new Promise((reslove, reject) => {
                this.getArticleRecommenLittleVideoList(false, () => {
                    reslove('getArticleRecommenLittleVideoList');
                });
            })
            Promise.all([p1, p2]).then((result) => {
                //
                this.setState({
                    initLoading: false,
                })
            })
        })
        // this.refurbishNoom()

        // console.log($('.am-list-view-scrollview').eq(0));
        // console.log($('.am-list-view-scrollview').eq(1));
        $(document).on('scroll', '.am-list-view-scrollview', (e) => {
            if (e.target.scrollTop >= 200) {
                if (this.state.scrollFlag) {

                } else {
                    // Toast.info('开启:'+this.state.scrollFlag,1)
                    this.setState({
                        scrollFlag: true,
                    }, () => {
                        // Toast.info('开启了显示'+this.state.scrollFlag,1)
                    })
                }

            } else {
                if (this.state.scrollFlag) {
                    // Toast.info('关闭了显示',1)
                    this.setState({
                        scrollFlag: false,
                    })
                }

            }
        })
        //监听滚动事件
        // $('.am-list-view-scrollview').on('scroll',  (e) => {
        //     if (e.target.scrollTop >= 200) {
        //         this.setState({
        //             scrollFlag: true,
        //         })
        //     } else {
        //         this.setState({
        //             scrollFlag: false,
        //         })
        //     }
        // });
    }

    refurbishNoom() {
        var _this = this;
        var touchstartNum;
        var touchFlag;
        var transformNum;
        window.addEventListener('touchstart', function (e) {
            touchstartNum = e.targetTouches[0].pageY
            touchFlag = true
        })

        window.addEventListener('touchmove', function (event) {

            var touch = event.targetTouches[0];
            var touchDistance = touch.pageY - touchstartNum;

            if (_this.state.index == 0) {
                var dom = $('.am-pull-to-refresh-content').eq(0);
            } else {
                var dom = $('.am-pull-to-refresh-content').eq(1);
            }

            //1.向下拉动  2.最顶端的向下拉动   3.距离超过300
            if (touch.clientY >= 300 && _this.state.noomPullFlag && touchDistance > 0) {
                if (touchFlag) {
                    if (_this.state.index == 0) {
                        transformNum = document.getElementsByClassName('am-pull-to-refresh-content')[0].style.transform
                    } else {
                        transformNum = document.getElementsByClassName('am-pull-to-refresh-content')[1].style.transform
                    }

                    touchFlag = false
                }
                dom.css({
                    "transform": transformNum
                })
            }
        })
    }


    /**
     * 按页码获取短视频列表
     * **/
    getArticleRecommenLittleVideoList(clearFlag, reslove) {
        var param = {
            "method": 'getArticleRecommenLittleVideoList',
            "userId": this.state.userId,
            "pageNo": JSON.stringify(this.state.defaultPageNo)
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                if (result.success) {
                    this.setState({
                        recommended_video: result,
                        recommended_pageCount: result.pager.pageCount,
                        recommended_pageNo: result.pager.pageNo,
                        // random_index: this.getRandom(),
                    }, () => {
                        var obj = [];
                        // obj[`recommended_video[${this.state.defaultPageNo-1}]`] = result.response;
                        // this.setState(obj,()=>{
                        //     console.log(this.state.recommended_video[0], 'recommended_video');
                        // })
                        //获取文章列表
                        this.getArticleInfoListByType(clearFlag, reslove);
                    })
                } else {

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
    getArticleInfoListByType(clearFlag, reslove) {
        var _this = this;
        var param = {
            "method": 'getArticleInfoListByType',
            "userId": this.state.userId,
            "getType": this.state.index,
            "pageNo": this.state.defaultPageNo,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                if (result.success) {
                    this.state.rsCount = result.pager.rsCount;
                    // this.setState({
                    //    dex: parseInt(result.response.length / 2)
                    // })


                    if (clearFlag) {    //拉动刷新  获取数据之后再清除原有数据
                        _this.initDataSource.splice(0);
                        dataSource = [];
                        dataSource = new ListView.DataSource({
                            rowHasChanged: (row1, row2) => row1 !== row2,
                        });
                    }

                    var initLength = this.initDataSource.length;
                    this.initDataSource = this.initDataSource.concat(result.response);
                    if (this.state.recommended_video.response.length > 0 && result.response.length > 0) {
                        console.log(2);
                        //往文章数组里面添加一组小视频数据
                        this.initDataSource.splice((result.response.length / 2) + initLength, 0, this.state.recommended_video);
                    } else {
                        console.log(1);
                        // this.setState({
                        //     recommended_video: {
                        //         response: []
                        //     }
                        // })
                        this.state.recommended_video = {response: []}
                    }
                    // Toast.info('设置数据之前');
                    this.setState({
                        dataSource: dataSource.cloneWithRows(this.initDataSource),
                        isLoading: true,
                        refreshing: false,
                    }, () => {

                        if (reslove) {
                            reslove();
                        }
                    })
                    if ((this.initDataSource.length - (this.state.recommended_video.response.length == 0 ? 0 : 1)) >= result.pager.rsCount) {
                        this.setState({
                            hasMore: false,
                            isLoading: false
                        })
                    }
                    //调用短视频
                    // this.getArticleRecommenLittleVideoList();
                    console.log('重新绑定')
                    // 监听滚动事件
                    $('.am-list-view-scrollview').on('scroll', (e) => {
                        if (e.target.scrollTop >= 200) {
                            if (this.state.scrollFlag) {

                            } else {
                                this.setState({
                                    scrollFlag: true,
                                }, () => {
                                    // Toast.info('开启了显示'+this.state.scrollFlag,1)
                                })
                            }

                        } else {
                            if (this.state.scrollFlag) {
                                // Toast.info('关闭了显示',1)
                                this.setState({
                                    scrollFlag: false,
                                })
                            }

                        }
                    })
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
    getAllCircleOfFriendsByUid(clearFlag, reslove) {
        var _this = this;
        var param = {
            "method": 'getAllCircleOfFriendsByUid',
            "userId": this.state.userId,
            "pageNo": this.state.defaultPageNoForCircle,
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
     * 查询用户权限
     * **/
    getLittleVideoUserById(reslove) {
        var param = {
            "method": 'getLittleVideoUserById',
            "uid": this.state.userId,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                if (result.success) {
                    var data = result.response;
                    if (data ? data.schoolId : null) {
                        this.setState({
                            userRoot: true,
                            show_bottom_text: true,
                        })
                        console.log('此用户root为true')
                    } else {
                        this.setState({
                            userRoot: false,

                        })
                        if (this.state.index == 0) {
                            this.setState({
                                initLoading: false,
                                show_bottom_text: false,
                            })
                            console.log('此用户root为false')
                        } else {
                            this.setState({
                                initLoading: true,
                                show_bottom_text: true,
                            })
                        }
                    }
                } else {
                    this.setState({
                        show_bottom_text: false,
                    })
                }
                if (reslove) {
                    reslove();
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
            if (this.state.index == 2) {
                this.getAllCircleOfFriendsByUid();
            } else {
                this.getArticleRecommenLittleVideoList();
            }
        });
    };

    onRefresh = (str) => {
        var divPull = document.getElementsByClassName('am-pull-to-refresh-content');

        if (str == 'left') {
            divPull[0].style.transform = "translate3d(0px, 30px, 0px)";   //设置拉动后回到的位置
            // divPull[0].style.height = document.body.clientHeight
        } else if (str == 'right') {
            divPull[1].style.transform = "translate3d(0px, 30px, 0px)";   //设置拉动后回到的位置
            // divPull[1].style.height = document.body.clientHeight
        } else if (str == 'rightright') {
            //圈子的下拉刷新
            divPull[2].style.transform = "translate3d(0px, 30px, 0px)";   //设置拉动后回到的位置
            this.setState({
                defaultPageNo: 1, refreshing: true
            }, () => {
                // this.getLittleVideoUserById();
                // this.getArticleRecommenLittleVideoList(true);
                // Toast.info('重新绑定事件'+this.state.index);

            });
            return;
        }
        this.setState({
            defaultPageNo: 1, refreshing: true
        }, () => {
            // this.getLittleVideoUserById();
            this.getArticleRecommenLittleVideoList(true);
            // Toast.info('重新绑定事件'+this.state.index);

        });


    };

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

    //tab栏切换事件
    onChange(val) {
        this.initDataSource = [];
        this.setState({
            dataSource: dataSource.cloneWithRows(this.initDataSource),
            defaultPageNo: 1,
            isLoading: true,
            hasMore: true,
            index: val.value,
            recommended_video: [],
            initLoading: true,
            scrollFlag: false,
        }, () => {
            console.log(val.value)
            if (val.value == 2) {
                console.log('切换到圈子');
                this.getAllCircleOfFriendsByUid();
            } else {
                this.getArticleRecommenLittleVideoList(false, () => {
                    this.setState({
                        initLoading: false,
                    })
                });
            }

        })
    }

    //播放视频
    toPlayVideo(videoIndex, recommended_video, recommended_pageCount, recommended_pageNo) {
        var data = {
            method: 'playArticleVideo',
            videos: recommended_video,
            position: videoIndex,
            pageNo: recommended_pageNo,
            pageCount: recommended_pageCount
        };
        Bridge.callHandler(data, null, function (error) {
            console.log('开启小视频失败')
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


    toPerfectInfo = () => {
        var data = {
            method: 'perfectUserInfo',
        };
        Bridge.callHandler(data, null, function (error) {
            Toast.info('跳转完善资料失败', 1)
        });
    }

    toTop = () => {
        // if ($(".am-list-view-scrollview").scrollTop()) {
        // setTimeout(function(){
        //     document.getElementsByClassName("am-list-view-scrollview")[0].scrollTop = 0;
        // },1000)
        this.setState({
            scrollFlag: false,
        }, () => {
            $(".am-list-view-scrollview").animate({scrollTop: 0}, 1000);
        })
        // }
    }

    publishArt = (type) => {
        console.log(type);
        if (type == 'article') {
            var url = WebServiceUtil.mobileServiceURL + "mobileEditor?userId=" + this.state.userId;
            // var url = 'https://www.maaee.com:6443/richTextMobileEditor/'
            var data = {
                method: 'openNewPage',
                url: url
            };
            Bridge.callHandler(data, null, function (error) {
                window.location.href = url;
            });
        } else if (type == 'theme') {
            var url = WebServiceUtil.mobileServiceURL + "themeTask?userId=" + this.state.userId;
            // var url = 'https://www.maaee.com:6443/richTextMobileEditor/'
            var data = {
                method: 'openNewPage',
                url: url
            };
            Bridge.callHandler(data, null, function (error) {
                window.location.href = url;
            });
        } else if (type == '') {
            console.log('错题本');
        }

    }


    showPubli_box = () => {
        this.setState({
            showPubliFlag: !this.state.showPubliFlag
        })
    }


    //跳转至朋友圈详情
    toThemeTaskDetail(cid){
        console.log(cid,'cid')
    }


    render() {
        var _this = this;
        const row = (rowData, sectionID, rowID) => {
            var dom = "";
            var time = this.timeDifference(rowData.createTime);
            if (this.state.index == 2) {
                var friendsAttachments = rowData.friendsAttachments;
                for (var i = 0; i < friendsAttachments.length; i++) {
                    if (friendsAttachments[i].fatherType == 1) {
                        friendsAttachments.splice(i, 1);
                    }
                }
                dom = <div className="circleList" onClick={this.toThemeTaskDetail.bind(this,rowData.cid)}>
                    <div className="list_head">
                        <div className="headPic">
                            <img src={rowData.userInfo.avatar} alt=""/>
                        </div>
                        <div className="userName">{rowData.userInfo.userName}</div>
                        <div className="createTime"></div>

                    </div>
                    <div className="tags"><span className={rowData.type?"tag-ThemeTask":"tag-WrongTopic tag-WrongTopic-orange"}>{rowData.type?'':''}</span></div>
                    <div className="list_content">{rowData.content}</div>
                    <div className="list_image" style={
                        friendsAttachments.length == 0 ? {display: 'none'} : {display: 'block'}
                    }>
                        {friendsAttachments.map((value, index) => {
                            if(value.type == 0){
                                return <img style={
                                    friendsAttachments.length == 1 ? {maxWidth: '100%'} : {
                                        display: 'inline-block'
                                    }
                                } src={value.path} alt=""/>
                            }else{
                                return <div className="video_tag" style={
                                    friendsAttachments.length == 1 ? {maxWidth: '100%'} : {
                                        display: 'inline-block'
                                    }
                                }>
                                    <video  style={{width:'100%',height:'100%'}} src={value.path} alt=""/>
                                    <div className="video_tag_play"></div>
                                </div>
                            }

                        })}
                    </div>
                    <div className="list_bottom">
                        <div className="list_bottom_item"><i className="i-share"></i></div>
                        <div className="list_bottom_item"><i className="i-comments"></i><span>12</span></div>
                        <div className="list_bottom_item"><i className="i-praise"></i><span>8</span></div>
                    </div>
                </div>
            } else {
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
                                             src={require('../images/videoClick.png')} alt=""/>
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
            }


            return (
                <div className={this.state.index == 2 ? 'list_item' : ''}
                     onClick={this.state.index == 2 ? '' : rowData.response instanceof Array ? '' : this.toDetail.bind(this, rowData.articleId, rowData.articleTitle)}>
                    {dom}
                </div>
            )
        };
        return (
            <div id="articleList" style={{height: document.body.clientHeight}}>
                <div className='artEmptyDiv' style={
                    this.state.userRoot || this.state.index == 1 || this.state.index == 2 ? {display: 'none'} : {display: 'block'}
                }>
                    <div className='emptyIcon'></div>
                    <div className='text'>请完善基本信息，以获取本校动态消息</div>
                    <span className='btn' onClick={this.toPerfectInfo}>完善资料</span>
                    {/*<span>完善资料</span>*/}
                </div>
                {/*发布菜单*/}
                <div onClick={this.showPubli_box} className="icon-release">
                    <div className="showPubli_box" style={
                        this.state.showPubliFlag ? {display: 'block'} : {display: 'none'}
                    }>
                        <i className="showPubli_box-arrow"></i>
                        <div className="line_public" onClick={this.publishArt.bind(this, 'article')}><i className="i-WeMedia"></i>发布自媒体</div>
                        <div className="line_public" onClick={this.publishArt.bind(this, '')}><i className="i-WrongTopic"></i>发布错题本</div>
                        <div className="line_public" onClick={this.publishArt.bind(this, 'theme')}><i className="i-PublishThematicTasks"></i>发布主题任务</div>
                    </div>
                </div>
                {/*mask*/}
                <div style={
                    this.state.showPubliFlag ? {display: 'block'} : {display: 'none'}
                } onClick={this.showPubli_box} className="mask"></div>
                <Tabs tabs={tabs}
                      initalPage={0}
                      swipeable={false}
                      animated={false}
                      useOnPan={false}
                      onChange={this.onChange.bind(this)}
                >
                    <div>
                        <div className="initImage" style={
                            this.state.initLoading ? {display: 'block'} : {display: 'none'}
                        }>
                            <img src={require('../images/articleListLoading.png')} alt=""/>
                        </div>
                        <ListView
                            ref={el => this.lv = el}
                            dataSource={this.state.dataSource}    //数据类型是 ListViewDataSource
                            renderFooter={() => (
                                <div style={{paddingTop: 5, paddingBottom: 46, textAlign: 'center'}}>
                                    {this.state.show_bottom_text ? this.state.isLoading ? '正在加载...' : '已经全部加载完毕' : ''}
                                </div>)}
                            renderRow={row}   //需要的参数包括一行数据等,会返回一个可渲染的组件为这行数据渲染  返回renderable
                            className="am-list"
                            pageSize={30}    //每次事件循环（每帧）渲染的行数
                            //useBodyScroll  //使用 html 的 body 作为滚动容器   bool类型   不应这么写  否则无法下拉刷新
                            scrollRenderAheadDistance={200}   //当一个行接近屏幕范围多少像素之内的时候，就开始渲染这一行
                            onEndReached={this.onEndReached}  //当所有的数据都已经渲染过，并且列表被滚动到距离最底部不足onEndReachedThreshold个像素的距离时调用
                            onEndReachedThreshold={10}  //调用onEndReached之前的临界值，单位是像素  number类型
                            initialListSize={30}   //指定在组件刚挂载的时候渲染多少行数据，用这个属性来确保首屏显示合适数量的数据
                            scrollEventThrottle={20}     //控制在滚动过程中，scroll事件被调用的频率
                            style={
                                this.state.initLoading ? {display: 'none'} : {
                                    display: 'block',
                                    height: document.body.clientHeight
                                }
                            }
                            pullToRefresh={<PullToRefresh
                                onRefresh={this.onRefresh.bind(this, 'left')}
                                distanceToRefresh={80}
                            />}
                        />
                    </div>

                    <div>
                        <div className="initImage" style={
                            this.state.initLoading ? {display: 'block'} : {display: 'none'}
                        }>
                            <img src={require('../images/articleListLoading.png')} alt=""/>
                        </div>
                        <ListView
                            ref={el => this.lv = el}
                            dataSource={this.state.dataSource}    //数据类型是 ListViewDataSource
                            renderFooter={() => (
                                <div style={{paddingTop: 5, paddingBottom: 46, textAlign: 'center'}}>
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
                            style={
                                this.state.initLoading ? {
                                    display: 'none',
                                    height: document.body.clientHeight
                                } : {display: 'block', height: document.body.clientHeight}
                            }
                            pullToRefresh={<PullToRefresh
                                onRefresh={this.onRefresh.bind(this, 'right')}
                                distanceToRefresh={80}
                            />}
                        />
                    </div>
                    <div>
                        <div className="initImage" style={
                            this.state.initLoading ? {display: 'block'} : {display: 'none'}
                        }>
                            <img src={require('../images/articleListLoading.png')} alt=""/>
                        </div>
                        <ListView
                            ref={el => this.lv = el}
                            dataSource={this.state.dataSource}    //数据类型是 ListViewDataSource
                            renderFooter={() => (
                                <div style={{paddingTop: 5, paddingBottom: 46, textAlign: 'center'}}>
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
                            style={
                                this.state.initLoading ? {
                                    display: 'none',
                                    height: document.body.clientHeight
                                } : {display: 'block', height: document.body.clientHeight}
                            }
                            pullToRefresh={<PullToRefresh
                                onRefresh={this.onRefresh.bind(this, 'rightright')}
                                distanceToRefresh={80}
                            />}
                        />
                    </div>


                </Tabs>
                <div className="toTop" style={
                    this.state.scrollFlag ? {display: 'block'} : {display: 'none'}
                } onClick={this.toTop.bind(this)}><img src={require('../images/toTop.png')}/></div>
            </div>
        );
    }

}