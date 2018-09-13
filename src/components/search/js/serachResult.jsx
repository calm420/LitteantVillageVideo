import React from 'react';
import { WhiteSpace, SearchBar, Button, WingBlank, Tabs, ListView, Toast } from 'antd-mobile';
import "../css/serachResult.less";
var calm;
const dataSource = new ListView.DataSource({
    rowHasChanged: (row1, row2) => row1 !== row2,
});

const tabs = [
    { title: '视频', value: "2" },
    { title: '用户', value: "3" },
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
            calm.searchVideo(searghValue, userId)
        }
        if (calm.state.pageChange == 1) {
            calm.searchPeople(searghValue, userId)
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
                            calm.searchVideo(calm.state.value, userId)
                        }
                        if (calm.state.pageChange == 1) {
                            calm.serach();
                            calm.searchPeople(calm.state.value, userId)
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
                console.log(result, "result33333");
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
            _this.searchVideo(calm.state.value, calm.state.userId);
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
            _this.searchPeople(calm.state.value, calm.state.userId);
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
        // alert(JSON.stringify(calm.state.clientHeight))
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
        // if(calm.state.searghValue == ""){
        //     return
        // }
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
        // var url = WebServiceUtil.mobileServiceURL + "searchHistory";
        // var data = {
        //     method: 'openNewPage',
        //     url: url
        // };
        // Bridge.callHandler(data, null, function (error) {
        //     window.location.href = url;
        // });
        var data = {
            method: 'finishForRefresh',
        };

        Bridge.callHandler(data, null, function (error) {
            console.log(error);
        });
        // var data = {
        //     method: 'finishForRefresh',
        // };
        // Bridge.callHandler(data, null, function (error) {
        //     console.log(error);
        // });
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
        console.log(val.value)
        if (val.value == 3) {
            calm.initDataSource = [];
            calm.setState({
                dataSource: dataSource.cloneWithRows(calm.initDataSource),
                defaultPageNo: 1,
                isLoading: true,
                hasMore: true,
                pageChange: 1
            }, () => {
                calm.searchPeople(calm.state.value, calm.state.userId);
            })
        }
        if (val.value == 2) {
            calm.initDataSource = [];
            calm.setState({
                dataSource: dataSource.cloneWithRows(calm.initDataSource),
                defaultPageNo: 1,
                isLoading: true,
                hasMore: true,
                pageChange: 0
            }, () => {
                calm.searchVideo(calm.state.value, calm.state.userId)
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
    toCenterInfo = (data) => {
        var data = {
            method: 'toUserpage',
            user: data
        };
        console.log(data)
        Bridge.callHandler(data, null, function (error) {
        });
    }
    // dangerouslySetInnerHTML={{ __html: calm.state.data.articleContent }}
    render() {
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
        const row2 = (rowData, sectionID, rowID) => {
            return (
                <div className="User-Search line_public">
                    <img className="user" onClick={calm.toCenterInfo.bind(this,rowData.uid)} src={rowData.avatar} />
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
                    {/* 用户搜索 */}
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
                            onEndReached={this.onEndReached2}  //当所有的数据都已经渲染过，并且列表被滚动到距离最底部不足onEndReachedThreshold个像素的距离时调用
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