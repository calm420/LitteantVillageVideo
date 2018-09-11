import React from "react";
import { Tabs, WhiteSpace, ListView, Button, List, Radio, TextareaItem, Toast, Modal, } from 'antd-mobile';
const RadioItem = Radio.RadioItem;
const alert = Modal.alert;
import '../css/wrongQuestionCount.less';

var calm;
const dataSource = new ListView.DataSource({
    rowHasChanged: (row1, row2) => row1 !== row2,
});
export default class wrongQuestionCount extends React.Component {

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
            clientHeight: document.body.clientHeight,
            showModal: false,
            currentProject: "语文",
            value:""
        }
    }


    componentDidMount() {
        document.title = "科目错题统计"
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var auditorId = searchArray[0].split('=')[1];
        calm.setState({
            auditorId
        })
        calm.getArticleAndLittleVideoIsNo();
        window.addEventListener('resize', calm.onWindowResize);

    }
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



    //--------//
    //监听窗口改变时间
    onWindwoResize() {
        // this
        setTimeout(() => {
            calm.setState({
                clientHeight: document.body.clientHeight,
            })
        }, 100)
    }
    /**
     * 显示弹出框
     */
    toShowModal = () => {
        calm.setState({
            showModal: true
        })
    }
    /**
     * 单选框改变
     */
    onChange = (value) => {
        console.log('checkbox', value);
        this.setState({
            value: value.value,
            currentProject: value.label
        });

    };
    /**
     * 点击确定
     */
    submieProject = () => {
        calm.setState({
            currentProject: calm.state.currentProject,
            showModal: false,
        })
    }
    /**
     * 点击取消
     */
    calmcleModal = () => {
        calm.setState({
            showModal: false,
            currentProject:calm.state.currentProject,
            value:""
        })
    }
    render() {
        var _this = this;
        const row = (rowData, sectionID, rowID) => {
            // console.log(rowData,"rowData")
            rowData = rowData || {}
            return (
                <div>

                </div>
            )
        }
        const data = [
            { value: 0, label: '语文' },
            { value: 1, label: '数学' },
            { value: 2, label: '历史' },
            { value: 3, label: '英语' },
            { value: 4, label: '政治' },
            { value: 5, label: '化学' },
        ]
        const { value } = this.state;
        return (
            <div id="wrongQuestionCount" style={{
                height: document.body.clientHeight
            }}>
                <div style={{
                    height: document.documentElement.clientHeight - 46,
                    backgroundColor: '#f4f4f4'
                }}>
                    <div> 
                        <span>{calm.state.currentProject}</span>
                        <span onClick={calm.toShowModal}>切换科目</span>
                    </div>
                    <div className="title"> 
                        <span>标签</span>
                        <span>题量</span>
                        <span>个人占比</span>
                        <span>他人平均占比</span>
                    </div>
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
                        onScroll={this.scroll}
                        style={{
                            height: document.body.clientHeight - 46,
                        }}
                    />
                </div>
                <div className="modalBack" style={{ display: calm.state.showModal ? "block" : "none" }}></div>
                <div className="modalDiv" style={{ display: calm.state.showModal ? "block" : "none" }}>
                    <p className="selectProject">选择科目</p>
                    <div>
                        {data.map(i => (
                            <RadioItem key={i.value} checked={value === i.value} onChange={() => this.onChange(i)}>
                                {i.label}
                            </RadioItem>
                        ))}
                    </div>
                    <div className="bottomButton">
                        <span onClick={calm.calmcleModal}>取消</span>
                        <span onClick={calm.submieProject}>确定</span>
                    </div>
                </div>
            </div>
        )
    }
}