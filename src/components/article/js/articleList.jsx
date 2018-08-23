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
];
export default class articleList extends React.Component {

    constructor(props) {
        super(props);
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
        }
    }

    componentDidMount() {
        Bridge.setShareAble("false");
        document.title = '文章列表';
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var userId = searchArray[0].split('=')[1];
        var machineType = searchArray[1] ? searchArray[1].split('=')[1] : '';
        var version = searchArray[2] ? searchArray[2].split('=')[1] : '';
        // console.log(machineType);
        // console.log(version);
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
    }


    getRandom() {
        return parseInt(Math.random() * (15 - 5 + 1) + 5);
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
                        // console.log(obj)
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
                    //     random_index: parseInt(result.response.length / 2)
                    // })
                    // console.log(this.state.recommended_video,'recommended_video');


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
                        this.initDataSource.splice((result.response.length / 2) + initLength, 0, this.state.recommended_video);
                    } else {
                        this.setState({
                            recommended_video: {
                                response: []
                            }
                        })
                    }
                    this.setState({
                        dataSource: dataSource.cloneWithRows(this.initDataSource),
                        isLoading: true,
                        refreshing: false,
                    })
                    if ((this.initDataSource.length - (this.state.recommended_video.response.length == 0 ? 0 : 1)) >= result.pager.rsCount) {
                        this.setState({
                            hasMore: false,
                            isLoading: false
                        })
                    }
                    //调用短视频
                    // this.getArticleRecommenLittleVideoList();
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
                    // console.log(data,'data');
                    // console.log(Boolean(0))
                    if (data.schoolId) {
                        this.setState({
                            userRoot: true,
                        })
                    } else {
                        this.setState({
                            userRoot: false,
                        })
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
            console.log('阻止请求')
            return;
        }
        currentPageNo += 1;
        this.setState({
            isLoading: true,
            defaultPageNo: currentPageNo,
        }, () => {
            this.getArticleRecommenLittleVideoList();
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
        }
        this.setState({
            defaultPageNo: 1, refreshing: true
        }, () => {
            // this.getLittleVideoUserById();
            this.getArticleRecommenLittleVideoList(true);
        });


    };

    toDetail(id) {
        if (id) {
            let url = encodeURI(WebServiceUtil.mobileServiceURL + "articleDetail?vId=" + id + "&userId=" + this.state.userId + "&type=1&machineType=" + this.state.machineType + "&version=" + this.state.version);
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
        }, () => {
            this.getArticleRecommenLittleVideoList(false, () => {
                this.setState({
                    initLoading: false,
                })
            });
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


    // toPerfectData(){
    //     let url = encodeURI(WebServiceUtil.mobileServiceURL + "articleDetail?vId=" + id +"&userId=" + this.state.userId +"&type=1");
    //     var data = {
    //         method: 'openNewPage',
    //         url: url
    //     };
    //     Bridge.callHandler(data, null, function (error) {
    //         window.location.href = url;
    //     });
    // }

    toPerfectInfo = () => {
        var data = {
            method: 'perfectUserInfo',
        };
        Bridge.callHandler(data, null, function (error) {
            Toast.info('跳转完善资料失败', 1)
        });
    }

    toTop = () => {
        if ($(".am-list-view-scrollview").scrollTop()) {
            $(".am-list-view-scrollview").animate({scrollTop: 0}, 1000);
            this.setState({
                scrollFlag: false,
            })
        }
    }

    listViewScroll(e) {
        console.log(e.target.scrollTop);
        if (e.target.scrollTop >= 200) {
            this.setState({
                scrollFlag: true,
            })
        } else {
            this.setState({
                scrollFlag: false,
            })
        }

    }

    render() {
        var _this = this;
        const row = (rowData, sectionID, rowID) => {
            // console.log(rowData,'rowData');
            var image = rowData.articleImgArray || [];
            var dom = "";
            var time = this.timeDifference(rowData.createTime);
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
                        imageDom.push(<img className="image3"
                                           src={image[i]}
                                           alt=""/>)
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
                                    <div onClick={this.toDetail.bind(this, rowData.articleId)}
                                         className="videoMask"></div>
                                    <img onClick={this.toDetail.bind(this, rowData.articleId)} className="playImg"
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

            return (
                <div onClick={rowData.response instanceof Array ? '' : this.toDetail.bind(this, rowData.articleId)}>
                    {dom}
                </div>
            )
        };
        return (
            <div id="articleList" style={{height: document.body.clientHeight}}>
                <div className='artEmptyDiv' style={
                    this.state.userRoot || this.state.index == 1 ? {display: 'none'} : {display: 'block'}
                }>
                    <div className='emptyIcon'></div>
                    <div className='text'>请完善基本信息，以获取本校动态消息</div>
                    <span className='btn' onClick={this.toPerfectInfo}>完善资料</span>
                    {/*<span>完善资料</span>*/}
                </div>
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
                                <div style={{paddingTop: 5, paddingBottom: 0, textAlign: 'center'}}>
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
                                    height: document.body.clientHeight - 46
                                }
                            }
                            onScroll={this.listViewScroll.bind(this)}
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
                            style={
                                this.state.initLoading ? {
                                    display: 'none',
                                    height: document.body.clientHeight - 46
                                } : {display: 'block', height: document.body.clientHeight - 46}
                            }
                            onScroll={this.listViewScroll.bind(this)}
                            pullToRefresh={<PullToRefresh
                                onRefresh={this.onRefresh.bind(this, 'right')}
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