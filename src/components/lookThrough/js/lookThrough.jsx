import React from "react";
import { Tabs, WhiteSpace, ListView } from 'antd-mobile';
import '../css/lookThrough.less';

var calm;
const dataSource = new ListView.DataSource({
    rowHasChanged: (row1, row2) => row1 !== row2,
});
const tabs = [
    { title: '待审核', value: "0" },
    { title: '已审核', value: "1" },
];
export default class lookThrough extends React.Component {


    constructor(props) {
        super(props);
        calm = this;
        calm.initDataSource = [];
        this.state = {
            dataSource: dataSource.cloneWithRows(this.initDataSource),
            defaultPageNo: 1,
            isLoading: true,
            hasMore: true,
            waitLookThroughData: [],
            alreadyLookThroudhData: [],
        }
    }
    // scrollHandler = this.handleScroll.bind(this);

    // _handleScroll(scrollTop) {
    //     console.log(scrollTop)
    //     //滚动条距离页面的高度
    // }
    // handleScroll(event) {
    //     let scrollTop = event.srcElement.body.scrollTop;
    //     this._handleScroll(scrollTop);
    // }
    componentWillMount() {
        document.title = "审核列表";
    }
    componentDidMount() {
        document.title = "审核列表"
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var auditorId = searchArray[0].split('=')[1];
        calm.setState({
            auditorId
        })
        calm.getArticleAndLittleVideoIsNo();
        window.addEventListener('scroll', this.scrollHandler);

        // window.addEventListener('scroll', calm.scrollHandle);
    }

    // scrollHandler() {
    //     console.log("出发了滚动事件")
    //     console.log(window.pageYOffset)
    // }

    /**
     * 未审核列表
     */
    getArticleAndLittleVideoIsNo() {
        var param = {
            "method": 'getArticleAndLittleVideoIsNo',
            "pageNo": calm.state.defaultPageNo,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                console.log(result, "带审核");
                if (result.success) {
                    calm.state.rsCount = result.pager.rsCount;
                    calm.initDataSource = calm.initDataSource.concat(result.response);
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
                        waitLookThroughData: result.response
                    })
                }
            },
            onError: function (error) {
                // Toast.fail(error, 1); 
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
            _this.getArticleAndLittleVideoIsNo();
        });
    };
    /**
    * 跳转未审核页面
    */
    toWaitLookThrough(id, type) {
        var urlW = encodeURI(WebServiceUtil.mobileServiceURL + "WaitlookThroughDetail?id=" + id + "&type=" + type + "&auditorId=" + calm.state.auditorId);
        var data = {
            method: 'openNewPage',
            url: urlW
        };
        Bridge.callHandler(data, null, function (error) {
            window.location.href = urlW;
        });
    }

    //tab栏切换事件
    onChange(val) {
        console.log(val)
        if (val.value == 1) {
            var urlW = encodeURI(WebServiceUtil.mobileServiceURL + "alreadyLookThough?id=" + calm.state.auditorId);
            window.location.href = urlW;
            // var data = {
            //     method: 'openNewPage',
            //     url: urlW
            // };
            // Bridge.callHandler(data, null, function (error) {
            //     window.location.href = urlW;
            // });
            // calm.initDataSource = [];
            // calm.setState({
            //     dataSource: dataSource.cloneWithRows(calm.initDataSource),
            //     defaultPageNo: 1,
            //     isLoading: true,
            //     hasMore: true,
            // }, () => {
            //     calm.getArticleAndLittleVideo();
            // })
        }
        if (val.value == 0) {
            calm.initDataSource = [];
            calm.setState({
                dataSource: dataSource.cloneWithRows(calm.initDataSource),
                defaultPageNo: 1,
                isLoading: true,
                hasMore: true,
            }, () => {
                calm.getArticleAndLittleVideoIsNo();
            })
        }
    }
    render() {
        var _this = this;
        const row = (rowData, sectionID, rowID) => {
            return (
                <div>
                    {
                        rowData.littleVideoInfo ?
                            <div className="item my_flex" onClick={_this.toWaitLookThrough.bind(this, rowData.littleVideoInfoID, rowData.type)}>
                                <img className='photo' src={rowData.littleVideoInfo.userInfo ? rowData.littleVideoInfo.userInfo.avatar : ""} alt="" />
                                <div className='right'>
                                    <div className="topMsg my_flex">
                                        <span className='author text_hidden'>{rowData.littleVideoInfo.userInfo ? rowData.littleVideoInfo.userInfo.userName : ""}</span>
                                        <span className="type">{/*类型：短视频*/} <img src={require("../img/icon_video.png")} /></span>
                                    </div>
                                    <div className='title'>{rowData.littleVideoInfo.videoContent}</div>
                                    <div className='time'>{WebServiceUtil.formatYMD(rowData.littleVideoInfo.createTime)}</div>
                                </div>
                            </div>
                            :
                            rowData.articleInfo ?
                                <div className="item my_flex" onClick={_this.toWaitLookThrough.bind(this, rowData.articleInfoId, rowData.type)}>
                                    <img className='photo' src={rowData.articleInfo.userInfo ? rowData.articleInfo.userInfo.avatar : ""} alt="" />
                                    <div className='right'>
                                        <div className="topMsg my_flex">
                                            <span className='author text_hidden'>{rowData.articleInfo.userInfo ? rowData.articleInfo.userInfo.userName : ""}</span>
                                            <span className="type">{/*类型：自媒体文章*/}<img src={require("../img/icon_media.png")} /></span>
                                        </div>
                                        <div className='title'>{rowData.articleInfo.articleTitle}</div>
                                        <div className='time'>{WebServiceUtil.formatYMD(rowData.articleInfo.createTime)}</div>

                                    </div>

                                </div>
                                :
                                rowData.discussInfo ?
                                    <div className="item my_flex" onClick={_this.toWaitLookThrough.bind(this, rowData.discussInfoId, rowData.type)}>
                                        <img className='photo' src={rowData.discussInfo.discussUser ? rowData.discussInfo.discussUser.avatar : ""} alt="" />
                                        <div className='right'>
                                            <div className="topMsg my_flex">
                                                <span className='author text_hidden'>{rowData.discussInfo.discussUser ? rowData.discussInfo.discussUser.userName : ""}</span>
                                                <span className="type">{/*类型：评论*/}<img src={require("../img/icon_comment.png")} /></span>
                                            </div>
                                            <div className='title'>{rowData.discussInfo.discussContent}</div>
                                            <div className='time'>{WebServiceUtil.formatYMD(rowData.discussInfo.createTime)}</div>
                                        </div>
                                    </div> :
                                    ""
                    }
                </div>
            )
        }

        return (
            <div id="lookThrough" style={{
                height: document.body.clientHeight
            }}>
                <div className='emptyDiv' style={{ display: calm.initDataSource.length == 0 ? "block" : 'none' }}>
                    <div className='emptyIcon'></div>
                </div>
                <Tabs tabs={tabs} initialPage={0} animated={false} useOnPan={false} onChange={calm.onChange} >
                    <div style={{
                        height: document.documentElement.clientHeight - 46,
                        backgroundColor: '#f4f4f4'
                    }}>
                        {/* 未审核 */}
                        <ListView
                            ref={el => this.lv = el}
                            dataSource={this.state.dataSource}    //数据类型是 ListViewDataSource
                            renderFooter={() => (
                                <div style={{ paddingTop: 5, paddingBottom: 0, textAlign: 'center' }}>
                                    {this.state.isLoading ? '正在加载...' : '已经全部加载完毕'}
                                </div>)}
                            renderRow={row}   //需要的参数包括一行数据等,会返回一个可渲染的组件为这行数据渲染  返回renderable
                            className="am-list noReviewed"
                            pageSize={30}    //每次事件循环（每帧）渲染的行数
                            //useBodyScroll  //使用 html 的 body 作为滚动容器   bool类型   不应这么写  否则无法下拉刷新
                            scrollRenderAheadDistance={200}   //当一个行接近屏幕范围多少像素之内的时候，就开始渲染这一行
                            onEndReached={this.onEndReached}  //当所有的数据都已经渲染过，并且列表被滚动到距离最底部不足onEndReachedThreshold个像素的距离时调用
                            onEndReachedThreshold={10}  //调用onEndReached之前的临界值，单位是像素  number类型
                            initialListSize={30}   //指定在组件刚挂载的时候渲染多少行数据，用这个属性来确保首屏显示合适数量的数据
                            scrollEventThrottle={20}     //控制在滚动过程中，scroll事件被调用的频率
                            style={{
                                height: document.body.clientHeight - 46,
                            }}
                        />
                    </div>
                </Tabs>
            </div>
        )
    }
}