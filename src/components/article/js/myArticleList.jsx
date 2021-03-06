import React from 'react';
import {
    Toast, DatePicker, ListView, Button, List, Picker, Tag, PullToRefresh
} from 'antd-mobile';
import '../css/myArticleList.less';

const dataSource = new ListView.DataSource({
    rowHasChanged: (row1, row2) => row1 !== row2,
});
export default class myArticleList extends React.Component {

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
            refreshing: false,
            noomPullFlag: true,   //list是否滚动到最顶端
        }
    }

    componentDidMount() {
        Bridge.setShareAble("false");
        document.title = '我的文章列表';
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var schoolId = searchArray[0].split('=')[1];
        this.setState({
            userId: schoolId
        }, () => {
            this.getArticleInfoListByStatus();
        })
        // this.refurbishNoom()
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

            var dom = $('.am-pull-to-refresh-content').eq(0);

            //1.向下拉动  2.最顶端的向下拉动   3.距离超过300
            if (touch.clientY >= 300 && _this.state.noomPullFlag && touchDistance > 0) {
                if (touchFlag) {
                    transformNum = document.getElementsByClassName('am-pull-to-refresh-content')[0].style.transform

                    touchFlag = false
                }
                dom.css({
                    "transform": transformNum
                })
            }
        })
    }

    onRefresh = () => {
        var divPull = document.getElementsByClassName('am-pull-to-refresh-content');
        divPull[0].style.transform = "translate3d(0px, 30px, 0px)";   //设置拉动后回到的位置
        this.setState({
            defaultPageNo: 1,
            refreshing: true,
        }, () => {
            this.getArticleInfoListByStatus(true);
        });

    };

    /**
     * 按查询条件获取列表
     * **/
    getArticleInfoListByStatus(clearFlag) {
        var _this = this;
        var param = {
            "method": 'getArticleInfoListByStatus',
            "userId": this.state.userId,
            "status": -1,
            "pageNo": this.state.defaultPageNo,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                if (result.success) {
                    this.state.rsCount = result.pager.rsCount;
                    // if(result.pager.rsCount == 0){
                    //     this.setState({
                    //         initLoading:true,
                    //     })
                    // }else{
                    //     this.setState({
                    //         initLoading:false,
                    //     })
                    // }

                    if (clearFlag) {    //拉动刷新  获取数据之后再清除原有数据
                        _this.initDataSource.splice(0);
                        _this.state.dataSource = [];
                        _this.state.dataSource = new ListView.DataSource({
                            rowHasChanged: (row1, row2) => row1 !== row2,
                        });
                    }

                    this.initDataSource = this.initDataSource.concat(result.response);
                    this.setState({
                        dataSource: dataSource.cloneWithRows(this.initDataSource),
                        isLoading: true,
                        refreshing: false,
                    })
                    if (this.initDataSource.length == result.pager.rsCount) {
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
        console.log('触底事件')
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
            this.getArticleInfoListByStatus();
        });
    };

    toDetail(id,articleTitle) {
        console.log(id);
        if (id) {
            let url = encodeURI(WebServiceUtil.mobileServiceURL + "articleDetail?vId=" + id + "&userId=" + this.state.userId + "&type=3&machineType=&version=&articleTitle=" + ((articleTitle)));
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

    listViewScroll(e) {
        if (e.target.scrollTop == 0) {
            this.setState({noomPullFlag: true})
        } else {
            this.setState({noomPullFlag: false})
        }
    }

    render() {
        var _this = this;
        const row = (rowData, sectionID, rowID) => {
            var image = rowData.articleImgArray || [];
            var dom = "";
            var time = this.timeDifference(rowData.createTime);
            if (image.length == 1) {  //图片一张
                dom = <div className="item line_public">
                    <div className="leftBox">
                        <div className="title">{rowData.articleTitle}</div>
                        <div className="bottom">
                            <div className="read">{rowData.readCount}阅读</div>
                            <div className="like">{rowData.readCount}点赞</div>
                            <div className="time">{time}</div>
                        </div>
                    </div>
                    <div className="rightBox">
                        <img src={image[0]} alt=""/>
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
                        <div className="like">{rowData.readCount}点赞</div>
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
                                <div onClick={this.toDetail.bind(this, rowData.articleId,rowData.articleTitle)} className="videoMask"></div>
                                <img onClick={this.toDetail.bind(this, rowData.articleId,rowData.articleTitle)} className="playImg"
                                     src={require('../images/videoClick.png')} alt=""/>
                                <video src="http://www.w3school.com.cn/example/html5/mov_bbb.mp4"></video>
                            </div>
                        </div>
                        <div className="bottom">
                            <div className="read">{rowData.readCount}阅读</div>
                            <div className="like">{rowData.readCount}点赞</div>
                            <div className="time">{time}</div>
                        </div>
                    </div>
                } else {  //图片没有 视频也没有
                    dom = <div className="item line_public">
                        <div className="title">{rowData.articleTitle}</div>
                        <div className="bottom">
                            <div className="read">{rowData.readCount}阅读</div>
                            <div className="like">{rowData.readCount}点赞</div>
                            <div className="time">{time}</div>
                        </div>
                    </div>
                }

            }
            return (
                <div onClick={this.toDetail.bind(this, rowData.articleId,rowData.articleTitle)}>
                    {dom}
                </div>
            )
        };
        return (
            <div id="myArticleList" style={{
                height: document.body.clientHeight
            }}>
                <div className='emptyDiv emptyImgBg' style={{display: this.initDataSource.length == 0 ? "block" : "none"}
                }>
                    <div className='emptyIcon'></div>
                    <div className="emptyText">还没有发布文章，快去发布吧~</div>
                </div>
                <ListView
                    ref={el => this.lv = el}
                    dataSource={this.state.dataSource}    //数据类型是 ListViewDataSource
                    renderFooter={() => (
                        <div style={{paddingTop: 5, paddingBottom: 0, textAlign: 'center'}}>
                            {/*{this.state.initLoading?'':this.state.isLoading ? '正在加载...' : '已经全部加载完毕'}*/}
                            {this.state.isLoading ? '正在加载...' : '已经全部加载完毕'}
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
                    style={{
                        height: document.body.clientHeight,
                    }}
                    onScroll={this.listViewScroll.bind(this)}
                    pullToRefresh={<PullToRefresh
                        onRefresh={this.onRefresh}
                        distanceToRefresh={80}
                    />}
                />
            </div>
        );
    }

}