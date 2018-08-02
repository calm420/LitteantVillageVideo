import React from 'react';
import {ListView, WingBlank, WhiteSpace, Card} from 'antd-mobile';
import '../css/uploadMusicList.less'

var musicList;

export default class uploadMusicList extends React.Component {
    constructor(props) {
        super(props);
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        this.initData = [];
        musicList = this;
        this.state = {
            dataSource: dataSource.cloneWithRows(this.initData),
            defaultPageNo: 1,
            clientHeight: document.body.clientHeight,
        };
    }

    componentDidMount() {
        document.title = '音乐列表'
        Bridge.setShareAble("false");
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var uid = locationSearch.split("&")[0].split("=")[1];
        this.setState({"uid": uid});
        this.getVideoMusicList()
    }

    /**
     * 获取音乐列表
     */
    getVideoMusicList() {
        var _this = this;
        const dataBlob = {};
        var param = {
            "method": 'getVideoMusicList',
            "pageNo": -1,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' && result.success == true) {
                    var arr = result.response;
                    // var pager = result.pager;
                    for (let i = 0; i < arr.length; i++) {
                        var topic = arr[i];
                        dataBlob[`${i}`] = topic;
                    }
                    var isLoading = false;
                    // if (arr.length > 0) {
                    //     if (pager.pageCount == 1 && pager.rsCount < 30) {
                    //         isLoading = false;
                    //     } else {
                    //         isLoading = true;
                    //     }
                    // } else {
                    //     isLoading = false;
                    // }
                    _this.initData = _this.initData.concat(arr);
                    _this.setState({
                        dataSource: _this.state.dataSource.cloneWithRows(_this.initData),
                        isLoadingLeft: isLoading,
                        refreshing: false
                    })
                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });
    }

    /**
     * 批量添加音乐
     * 跳转到添加页面
     */
    addRing() {
        var url = WebServiceUtil.mobileServiceURL + "addUploadMusic?ident=" + musicList.state.uid;
        var data = {
            method: 'openNewPage',
            url: url
        };
        Bridge.callHandler(data, null, function (error) {
            window.location.href = url;
        });
    }

    showDelAlert() {

    }

    render() {

        var _this = this

        const row = (rowData, sectionID, rowID) => {

            console.log(rowData);

            return (
                <WingBlank size="lg">
                    <WhiteSpace size="lg"/>
                    <Card>
                        <img src={rowData.cover} alt=""/>
                        <span>歌曲:{rowData.musicName}</span>
                        <span>歌手:{rowData.musicMan}</span>
                        <span>删除</span>
                        <span>编辑</span>
                    </Card>
                </WingBlank>
            )
        };

        return (
            <div id="uploadMusicList" style={{height: musicList.state.clientHeight}}>
                <div className='tableDiv' style={{height: musicList.state.clientHeight}}>
                    {/*这是列表数据,包括添加按钮*/}
                    <ListView
                        ref={el => this.lv = el}
                        dataSource={this.state.dataSource}    //数据类型是 ListViewDataSource
                        renderFooter={() => (
                            <div style={{paddingTop: 5, paddingBottom: 40, textAlign: 'center'}}>
                                {this.state.isLoadingLeft ? '正在加载' : '已经全部加载完毕'}
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
                            height: musicList.state.clientHeight,
                        }}
                    />
                    <div className='addBunton' onClick={this.addRing}>
                        <img src={require("../img/addBtn.png")}/>
                    </div>
                </div>
                <div className='updateModel' style={{height: musicList.state.clientHeight / 2, display: 'none'}}>

                </div>
            </div>
        );
    }
}
