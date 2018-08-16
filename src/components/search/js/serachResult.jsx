import React from 'react';
import { WhiteSpace, SearchBar, Button, WingBlank, Tabs, ListView } from 'antd-mobile';
import "../css/serachResult.less";
var calm;
const dataSource = new ListView.DataSource({
    rowHasChanged: (row1, row2) => row1 !== row2,
});

const tabs = [
    { title: '视频', value: "2" },
    // { title: '视频2', value: "3" },
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
            searchHistory: []
        }
    }

    componentDidMount() {
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var searghValue = decodeURI(searchArray[0].split('=')[1]);
        calm.searchVideo(searghValue)
        calm.setState({
            value: searghValue
        }, () => {
            $('.am-search-value').keydown(function (event) {
                if (event.keyCode == 13) {
                    calm.serach();
                    calm.searchVideo(calm.state.value)

                }
            })
        })

    }
    /**
     * 视频搜索结果
     */
    searchVideo = (value) => {
        var param = {
            "method": 'searchVideoLiketest',
            "test": value,
            "type": 1,
            "pageNo": calm.state.defaultPageNo,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                console.log(result, "re")
                if (result.success) {
                    calm.initDataSource = [];
                    calm.state.rsCount = result.pager.rsCount;
                    console.log(result.response.littleVideoInfo, "result.response.littleVideoInfo")
                    calm.initDataSource = calm.initDataSource.concat(result);
                    calm.setState({
                        dataSource: dataSource.cloneWithRows(calm.initDataSource),
                        isLoading: false
                    })
                    if (calm.initDataSource.length == result.pager.rsCount) {
                        calm.setState({
                            hasMore: false,
                            isLoading: false
                        })
                    }
                    calm.setState({
                        videoData: result.response
                    })
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
    onEndReached = (event) => {
        console.log('触底事件')
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
            _this.searchVideo();
        });
    };
    /**
     * 输入框改变的时候
     */
    onChange = (value) => {
        this.setState({ value });
    };
    /**
     * 点击搜索
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
        console.log("dianji")
        var data = {
            method: 'finishForRefresh',
        };
        Bridge.callHandler(data, null, function (error) {
            console.log(error);
        });
    }


    //播放视频
    toPlayVideo(videoIndex, recommended_video, recommended_pageCount, recommended_pageNo) {
        console.log(videoIndex,"videoIndex");
        console.log(recommended_video,"视频信息");
        console.log(recommended_pageCount,"yeshu");
        console.log(recommended_pageNo);
        var data = {
            method: 'playArticleVideo',
            videos: recommended_video,
            position: videoIndex,
            pageNo: recommended_pageNo,
            pageCount: recommended_pageCount
        };
        Bridge.callHandler(data, null, function (error) {
            // alert(JSON.stringify(error))
            // console.log('开启小视频失败',error)
        });
    }

    /**
       * Tab栏切换
       */
    tagOnChange(val) {
        // console.log(val,"VAL")
        console.log(val.value,"VALUE")
        // if(val.value == 3){
        //     calm.initDataSource = [];
        //     calm.setState({
        //         dataSource: dataSource.cloneWithRows(calm.initDataSource),
        //         defaultPageNo: 1,
        //         isLoading: true,
        //         hasMore: true,
        //     })
        // }
        if(val.value == 2){
            calm.initDataSource = [];
            calm.setState({
                dataSource: dataSource.cloneWithRows(calm.initDataSource),
                defaultPageNo: 1,
                isLoading: true,
                hasMore: true,
            },()=>{
                calm.searchVideo(calm.state.value)
            })
        }
    }
    render() {
        const row = (rowData, sectionID, rowID) => {
            console.log(rowData,"rowDta")
            console.log(rowID, "1")
            return (
                <div >
                    {
                        rowData.response.littleVideoInfo.map((v, i) => {
                            return (
                                <div className="videoInfo" onClick={this.toPlayVideo.bind(this, i, v, rowData.pager.pageCount, rowData.pager.pageNo)}>
                                    <video controls="controls" autoPlay style={{ width: "300px" }} src={v.videoPath}></video>
                                    <img style={{ width: "300px" }} src={v.coverPath} alt="" />
                                    <span>视频内容：{v.videoContent}</span>
                                    <span>播放次数：{v.readCount}</span>
                                    <span>点赞次数：{v.likeCount}</span>
                                </div>
                            )

                        })
                    }

                </div>
            )
        }

        return (
            <div id="serachResult">
                <SearchBar id="searchResult"
                    value={calm.state.value}
                    onSubmit={value => console.log(value, 'onSubmit')}
                    onClear={value => console.log(value, 'onClear')}
                    onFocus={() => console.log('onFocus')}
                    onBlur={() => console.log('onBlur')}
                    onCancel={calm.toSearchHistory}
                    onChange={this.onChange}
                    placeholder="Search"
                    maxLength={8} />
                <Tabs
                    tabs={tabs}
                    useOnPan={false}
                    onChange={calm.tagOnChange}
                    initialPage={0} tabs={tabs} >
                    <div style={{
                        height: document.documentElement.clientHeight - 46,
                        backgroundColor: '#f4f4f4'
                    }} className="hahah">
                        <ListView
                            ref={el => this.lv = el}
                            dataSource={this.state.dataSource}    //数据类型是 ListViewDataSource
                            renderFooter={() => (
                                <div style={{ paddingTop: 5, paddingBottom: 0, textAlign: 'center' }}>
                                    {this.state.isLoadingLeft ? '正在加载' : '已经全部加载完毕'}
                                </div>)}
                            renderRow={row}   //需要的参数包括一行数据等,会返回一个可渲染的组件为这行数据渲染  返回renderable
                            className="am-list uploadVideo"
                            pageSize={30}    //每次事件循环（每帧）渲染的行数
                            //useBodyScroll  //使用 html 的 body 作为滚动容器   bool类型   不应这么写  否则无法下拉刷新
                            scrollRenderAheadDistance={200}   //当一个行接近屏幕范围多少像素之内的时候，就开始渲染这一行
                            onEndReached={this.onEndReached}  //当所有的数据都已经渲染过，并且列表被滚动到距离最底部不足onEndReachedThreshold个像素的距离时调用
                            onEndReachedThreshold={10}  //调用onEndReached之前的临界值，单位是像素  number类型
                            initialListSize={30}   //指定在组件刚挂载的时候渲染多少行数据，用这个属性来确保首屏显示合适数量的数据
                            scrollEventThrottle={20}     //控制在滚动过程中，scroll事件被调用的频率
                            style={{
                                height: calm.state.clientHeight,
                            }}
                        />
                    </div>
                </Tabs>
            </div>
        )
    }
}