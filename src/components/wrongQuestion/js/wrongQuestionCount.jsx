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
            currentProject: "",
            finalProject: "",
            value: "",
            data:[]
        }
    }


    componentDidMount() {
        Bridge.setShareAble("false");
        document.title = "科目错题统计"
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var uid = searchArray[0].split('=')[1];
        var cid = searchArray[1].split('=')[1];
        var finalProject = decodeURI(searchArray[2].split('=')[1]);
        var type = searchArray[3].split('=')[1]
        calm.setState({
            uid,
            cid,
            finalProject,
            type
        })
        calm.analysisCircleOfFriends(uid,cid);
        window.addEventListener('resize', calm.onWindowResize);

    }
    /**
     *
     */
    analysisCircleOfFriends(uid,cid) {
        var param = {
            "method": 'analysisCircleOfFriends',
            "uid":uid,
            "cid":cid,
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
                    // calm.setState({
                    //     waitLookThroughData: result.response
                    // })
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
            _this.analysisCircleOfFriends();
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
        calm.getCourseByUserIdAndDefianceCourseAll();
    }
    /**
     * 单选框改变
     */
    onChange = (value) => {
        this.setState({
            value: value.value,
            currentProject: value.label,
            item:value
        });

    };
    /**
     * 点击确定
     */
    submieProject = () => {
        console.log(calm.state.value)
        calm.initDataSource = [];
        calm.analysisCircleOfFriends(calm.state.uid,calm.state.value)
        calm.setState({
            finalProject: calm.state.currentProject,
            showModal: false,
        })
    }
    /**
     * 点击取消
     */
    calmcleModal = () => {
        calm.setState({
            showModal: false,
            finalProject: calm.state.finalProject,
            value: ""
        })
    }

    /**
     * getCourseByUserIdAndDefianceCourseAll
     */
    getCourseByUserIdAndDefianceCourseAll(){
        var param = {
            "method": 'getCourseByUserIdAndDefianceCourseAll',
            "userId":calm.state.uid,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                var arr = []
                result.response.forEach((v,i)=>{
                    arr.push({
                        value:v.cid,
                        label:v.courseName
                    })
                })
                calm.setState({
                    data:arr
                })
            },
            onError: function (error) {
                // Toast.fail(error, 1); 
            }
        });
    }
    render() {
        var _this = this;
        const row = (rowData, sectionID, rowID) => {
            return (
                <div className='listCont my_flex'>
                    <span><span className='tag'>{rowData.ftagObj.tagTitle}</span></span>
                     <span>
                        <span><span>{rowData.errorCount}</span></span>
                         <span><span>{rowData.avgLog}%</span></span>
                    </span>
                    <span><span>{rowData.otherAvgLog ? rowData.otherAvgLog : "-"}</span></span>
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
                <div className='mainCont' style={{
                    height: document.documentElement.clientHeight,
                }}>
                    <div className="topDiv">
                        <span className='course text_hidden'>{calm.state.finalProject}</span>
                        <span className='icon_change' onClick={calm.toShowModal}>切换科目</span>
                    </div>
                    <div className="title my_flex">
                        <span>标签</span>
                           <span>
                                <span>题量</span>
                                <span>个人占比</span>
                           </span>
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
                            height: document.body.clientHeight - 46 - 46,
                        }}
                    />
                </div>
                <div className="modalBack" style={{ display: calm.state.showModal ? "block" : "none" }}></div>
                <div className="modalDiv" style={{ display: calm.state.showModal ? "block" : "none" }}>
                    <p className="selectProject">选择科目</p>
                    <div className='tagCont'>
                        <List>
                            {calm.state.data.map(i => (
                                <RadioItem key={i.value} className={value === i.value ? 'checked' : '' } checked={value === i.value} onChange={() => this.onChange(i)}>
                                    {i.label}
                                </RadioItem>
                            ))}
                        </List>
                    </div>
                    <div className="bottomBox">
                        <span onClick={calm.calmcleModal}>取消</span>
                        <span onClick={calm.submieProject}>确定</span>
                    </div>
                </div>
            </div>
        )
    }
}