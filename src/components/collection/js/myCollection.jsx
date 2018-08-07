import React from "react";

import {  ListView } from 'antd-mobile';


var calm;
const dataSource = new ListView.DataSource({
    rowHasChanged: (row1, row2) => row1 !== row2,
});
export default class  myCollection extends  React.Component{

    constructor(props){
        super(props);
        calm = this;
        calm.initDataSource = [];
        this.state = {
            dataSource: dataSource.cloneWithRows(this.initDataSource),
            defaultPageNo: 1,
            isLoading: true,
            hasMore: true,
        }

    }
    componentDidMount(){
        document.title = "收藏列表";
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var userId = searchArray[0].split('=')[1];
        calm.setState({
            userId
        })
        this.getUserFavoriteByUserId(userId)

    }
    /*
    * 获取收藏列表
    * */
    getUserFavoriteByUserId(userId){
        var param = {
            "method": 'getUserFavoriteByUserId',
            "userId": userId,
            "targetType":-1,
            "pageNo": calm.state.defaultPageNo,

        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                console.log(result,"rerere")
                if (result.success) {

                    calm.state.rsCount = result.pager.rsCount;
                    calm.initDataSource = calm.initDataSource.concat(result.response);
                    calm.setState({
                        dataSource: dataSource.cloneWithRows(calm.initDataSource),
                        isLoading: true
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
    /*
    * 下拉回调
    * */
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
            _this.getUserFavoriteByUserId();
        });
    };

    render(){
        const row = (rowData, sectionID, rowID) => {
            console.log(rowData,"row")
            return (
                <div>
                    {
                        rowData.littleVideoInfo ?
                            <div>
                                {
                                    rowData.littleVideoInfo.userInfo ?
                                        <div>
                                            <img src={ rowData.littleVideoInfo.userInfo.avatar}/>
                                            <span>{rowData.littleVideoInfo.userInfo.userName}</span>
                                        </div>
                                        :
                                        ""
                                }
                                <span>{rowData.littleVideoInfo.createTime}</span>
                                <p>{rowData.littleVideoInfo.videoContent}</p>
                                <video
                                    style={{ width: "100%" }}
                                    controls="controls"
                                    preload="auto"
                                    src={rowData.littleVideoInfo.videoPath}
                                    autoPlay>
                                </video>
                                <span>{rowData.littleVideoInfo.readCount}播放</span>
                                <span>{rowData.littleVideoInfo.likeCount}点赞</span>
                                <span>{new Date().getTime() - rowData.littleVideoInfo.favoriteTime}</span>

                            </div>
                            :
                            ""
                    }
                </div>
            )
        }
        return (
            <div>
                <ListView
                    ref={el => this.lv = el}
                    dataSource={this.state.dataSource}    //数据类型是 ListViewDataSource
                    renderFooter={() => (
                        <div style={{ paddingTop: 5, paddingBottom: 0, textAlign: 'center' }}>
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
                        height: document.body.clientHeight - 43.5,
                    }}
                />
            </div>
        )
    }
}


