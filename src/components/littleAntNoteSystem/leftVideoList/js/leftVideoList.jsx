import React from 'react';
import {Tabs, Toast, ListView} from 'antd-mobile';
import '../css/leftVideoList.less'

const tabs = [
    {title: '已发布'},
    {title: '草稿箱'},
];
const dataSource = new ListView.DataSource({
    rowHasChanged: (row1, row2) => row1 !== row2,
});

const dataSourceForDraft = new ListView.DataSource({
    rowHasChanged: (row1, row2) => row1 !== row2,
});

export default class leftVideoList extends React.Component {
    constructor(props) {
        super(props);
        this.initDataSource = [];
        this.initDataSourceForDraft = [];
        this.state = {
            tabsIndex: 0,
            dataSource: dataSource.cloneWithRows(this.initDataSource),
            defaultPageNo: 1,
            clientHeight: document.body.clientHeight,
            isLoadingLeft: false,
            hasMore: true,
            dataSourceForDraft: dataSource.cloneWithRows(this.initDataSourceForDraft),
            defaultPageNoForDraft: 1,
            isLoadingLeftForDraft: false,
            hasMoreForDraft: true,
            showOperId: null, // 显示编辑框按钮flag,
            editorId: null,//编辑id
        };
    }

    componentWillMount() {
        // this.getListData(0)
        //获取小视频发布列表
        this.getListData(1);
        this.getListData(0);
    }

    accept(type, id) {
        console.log(type, 'TYPE!!!!!!!!');
        switch (type) {
            // case "init":
            //     this.setState({
            //         tabsIndex: 1,
            //         editorId: id
            //     }, () => {
            //         // // console.log(this.state.tabsIndex)
            //         // this.getListData(0); //获取草稿箱列表
            //         // this.getListData(1); //获取发布列表
            //         this.refresh(this.state.tabsIndex);
            //     });
            //     break;
            // case 1:
            //     this.setState({
            //         tabsIndex: 1,
            //         editorId: null
            //     }, () => {
            //         // this.getListData(0); //获取草稿箱列表
            //         // this.getListData(1); //获取发布列表
            //         this.refresh(this.state.tabsIndex);
            //     });
            //     break;
            // case 0:
            //     this.setState({
            //         tabsIndex: 0,
            //         editorId: null,
            //     }, () => {
            //         // this.getListData(0); //获取草稿箱列表
            //         // this.getListData(1); //获取发布列表
            //         this.refresh(this.state.tabsIndex);
            //     })
            //     break;
            // case 'exit_editor':
            //     this.setState({
            //         editorId: null,
            //     }, () => {
            //         this.refresh(this.state.tabsIndex);
            //     });
            //     break;
            case 'refresh':
                this.refresh(this.state.tabsIndex);
                break;
        }
    }


    getListData(type) {  //0  1
        var param = {
            "method": 'getUserVideoListByStatus',
            "userId": JSON.parse(sessionStorage.getItem("loginUser")).uid,
            // "userId": 19,
            "status": type,  //已发布  0 草稿
            pageNo: '-1'
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                if (result.success) {
                    if (type == 0) {
                        this.initDataSourceForDraft = this.initDataSourceForDraft.concat(result.response);
                        this.setState({
                            dataSourceForDraft: dataSource.cloneWithRows(this.initDataSourceForDraft),
                            isLoadingLeftForDraft: false,
                            hasMoreForDraft: false,
                        })
                        if (result.response.length == 0) {
                            this.setState({
                                hasMoreForDraft: true
                            })
                        }
                    } else {
                        this.initDataSource = this.initDataSource.concat(result.response);
                        this.setState({
                            dataSource: dataSource.cloneWithRows(this.initDataSource),
                            isLoadingLeft: false,
                            hasMore: false,
                        })
                        if (result.response.length == 0) {
                            this.setState({
                                hasMore: true
                            })
                        }
                    }

                } else {
                    Toast.fail(type == 0 ? "获取小视频草稿列表失败" : "获取小视频发布列表失败");
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
        var currentPageNo = this.state.defaultPageNo;
        if (!this.state.isLoadingLeft && !this.state.hasMore) {
            console.log('阻止请求');
            return;
        }
        currentPageNo += 1;
        this.setState({isLoadingLeft: true, defaultPageNo: currentPageNo});
        this.getListData(0);
        // this.setState({
        //     dataSource: this.state.dataSource.cloneWithRows(this.initData),
        //     isLoadingLeft: true,
        // });
    };

    /**
     *  ListView数据全部渲染完毕的回调
     */
    onEndReachedForDraft = (event) => {
        var currentPageNo = this.state.defaultPageNoForDraft;
        if (!this.state.isLoadingLeftForDraft && !this.state.hasMoreForDraft) {
            console.log('阻止请求');
            return;
        }
        currentPageNo += 1;
        this.setState({isLoadingLeftForDraft: true, defaultPageNoForDraft: currentPageNo});
        this.getListData(1);
        // this.setState({
        //     dataSource: this.state.dataSource.cloneWithRows(this.initData),
        //     isLoadingLeft: true,
        // });
    };

    //tabs 改变事件
    onChange(key, index) {
        this.setState({
            tabsIndex: index
        })
    }

    showOperBox(id) {
        this.props.submitForvideo
        if (id == this.state.showOperId) {
            this.setState({
                showOperId: null,
            })
        } else {
            this.setState({
                showOperId: id,
            })
        }
    }

    openEditor(id) {
        console.log('编辑小视频');
        this.props.submitForvideo('编辑', id)
    }

    deleteLittleVideoInfoByType(id) {
        var param = {
            "method": 'deleteLittleVideoInfoByType',
            "videoIds": id,
            // "status": Math.abs(this.state.tabsIndex - 1),
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                if (result.success) {
                    console.log('删除成功');
                    this.refresh(this.state.tabsIndex);
                    // this.props.submit('删除', id)
                } else {
                    Toast.fail("删除失败");
                }
            },
            onError: function (error) {
                Toast.fail(error, 1);
            }
        });
    }

    refresh(index) {
        this.initDataSource = [];
        this.initDataSourceForDraft = [];
        this.setState({
            tabsIndex: index,
            dataSource: dataSource.cloneWithRows(this.initDataSource),
            defaultPageNo: 1,
            isLoadingLeft: false,
            hasMore: true,
            dataSourceForDraft: dataSource.cloneWithRows(this.initDataSourceForDraft),
            defaultPageNoForDraft: 1,
            isLoadingLeftForDraft: false,
            i_title_statehasMoreForDraft: true,
            showOperId: null, // 显示编辑框按钮flag
        }, () => {
            this.getListData(0)
            this.getListData(1)
        })
    }

    render() {
        const row = (rowData) => {
            // console.log(rowData);
            return (
                <div style={
                    this.state.editorId == rowData.vid ? {background: "#E8F1FF"} : {}
                } className="row">
                    <div className="title">
                        <span className="title_text text_hidden">{rowData.videoContent}</span>
                        <span
                            className={rowData.auditInfo ? rowData.auditInfo.isPass == 1 ? 'title_state state_through' : rowData.auditInfo.auditId == 0 ? 'title_state state_noAudit' : 'title_state state_noThrough' : 'title_state state_noAudit'}>
                        <i className='i_title_state'></i>
                            {rowData.auditInfo ? rowData.auditInfo.isPass == 1 ? '审核通过' : rowData.auditInfo.auditId == 0 ? '待审核' : '未通过' : '待审核'}
                            <span className="state-tips">
                                <i className='state-tipArrow'></i>
                                <div>未通过原因：</div>
                                <div
                                    className="tips-text">{rowData.auditInfo && rowData.auditInfo.isPass == 0 ? rowData.auditInfo.auditMark : '无'}</div>
                            </span>
                        </span>
                    </div>
                    <div className="row_bottom">
                        <div className="time">{WebServiceUtil.formatAllTime(rowData.createTime)}</div>
                        <button className="oper" onClick={this.showOperBox.bind(this, rowData.vid)}>
                            <div className="operBox" style={
                                this.state.showOperId == rowData.vid ? {display: 'inline-block'} : {display: 'none'}
                            }>
                                <div className="operBox_row" onClick={this.openEditor.bind(this, rowData.vid)}><i
                                    className="menu_edit"></i><span>编辑</span></div>
                                <div className="operBox_row" onClick={this.deleteLittleVideoInfoByType.bind(this, rowData.vid)}>
                                    <i className="menu_del"></i><span>删除</span></div>
                            </div>
                        </button>
                    </div>
                </div>
            )
        };
        const rowForDraft = (rowData) => {
            return (
                <div style={
                    this.state.editorId == rowData.vid ? {background: "#E8F1FF"} : {}
                } className="row">
                    <div className="title text_hidden"><span className="title_text">{rowData.videoContent}</span></div>
                    <div className="row_bottom">
                        <div className="time">{WebServiceUtil.formatAllTime(rowData.createTime)}</div>
                        <button className="oper" onClick={this.showOperBox.bind(this, rowData.vid)}>
                            <div className="operBox" style={
                                this.state.showOperId == rowData.vid ? {display: 'inline-block'} : {display: 'none'}
                            }>
                                <div className="operBox_row" onClick={this.openEditor.bind(this, rowData.vid)}><i
                                    className="menu_edit"></i><span>编辑</span></div>
                                <div className="operBox_row" onClick={this.deleteLittleVideoInfoByType.bind(this, rowData.vid)}>
                                    <i className="menu_del"></i><span>删除</span></div>
                            </div>
                        </button>
                    </div>
                </div>
            )
        };
        return (
            <div id="leftVideoList">
                <Tabs tabs={tabs}
                      initalPage={0}
                      swipeable={false}
                      animated={false}
                      useOnPan={false}
                      onChange={this.onChange.bind(this)}
                      page={this.state.tabsIndex}
                >
                    <div>
                        {/*发布列表*/}
                        <ListView
                            ref={el => this.lv = el}
                            dataSource={this.state.dataSource}    //数据类型是 ListViewDataSource
                            renderFooter={() => (
                                <div className="loading_text">
                                    {this.state.isLoadingLeft ? '正在加载...' : '已经全部加载完毕'}
                                </div>)}
                            renderRow={row}   //需要的参数包括一行数据等,会返回一个可渲染的组件为这行数据渲染  返回renderable
                            className="am-list inandout_a"
                            pageSize={30}    //每次事件循环（每帧）渲染的行数
                            //useBodyScroll  //使用 html 的 body 作为滚动容器   bool类型   不应这么写  否则无法下拉刷新
                            scrollRenderAheadDistance={200}   //当一个行接近屏幕范围多少像素之内的时候，就开始渲染这一行
                            onEndReached={this.onEndReached.bind(this)}  //当所有的数据都已经渲染过，并且列表被滚动到距离最底部不足onEndReachedThreshold个像素的距离时调用
                            onEndReachedThreshold={10}  //调用onEndReached之前的临界值，单位是像素  number类型
                            initialListSize={30}   //指定在组件刚挂载的时候渲染多少行数据，用这个属性来确保首屏显示合适数量的数据
                            scrollEventThrottle={20}     //控制在滚动过程中，scroll事件被调用的频率
                            style={{
                                height: this.state.clientHeight - 88.5,
                                // background: "black"
                            }}
                        />
                    </div>
                    <div>
                        {/*草稿箱*/}
                        <ListView
                            ref={el => this.lv = el}
                            dataSource={this.state.dataSourceForDraft}    //数据类型是 ListViewDataSource
                            renderFooter={() => (
                                <div className="loading_text">
                                    {this.state.isLoadingLeft ? '正在加载...' : '已经全部加载完毕'}
                                </div>)}
                            renderRow={rowForDraft}   //需要的参数包括一行数据等,会返回一个可渲染的组件为这行数据渲染  返回renderable
                            className="am-list inandout_a"
                            pageSize={30}    //每次事件循环（每帧）渲染的行数
                            //useBodyScroll  //使用 html 的 body 作为滚动容器   bool类型   不应这么写  否则无法下拉刷新
                            scrollRenderAheadDistance={200}   //当一个行接近屏幕范围多少像素之内的时候，就开始渲染这一行
                            onEndReached={this.onEndReachedForDraft.bind(this)}  //当所有的数据都已经渲染过，并且列表被滚动到距离最底部不足onEndReachedThreshold个像素的距离时调用
                            onEndReachedThreshold={10}  //调用onEndReached之前的临界值，单位是像素  number类型
                            initialListSize={30}   //指定在组件刚挂载的时候渲染多少行数据，用这个属性来确保首屏显示合适数量的数据
                            scrollEventThrottle={20}     //控制在滚动过程中，scroll事件被调用的频率
                            style={{
                                height: this.state.clientHeight - 88.5,
                                // background: "black"
                            }}
                        />
                    </div>
                </Tabs>
            </div>
        );
    }
}
