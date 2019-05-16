import React from "react";
import { Tabs, WhiteSpace, ListView, List, Radio, TextareaItem, Toast, Modal, Button, } from 'antd-mobile';
import '../css/lookThrough.less';

var calm;
const RadioItem = Radio.RadioItem;
const alert = Modal.alert;
const dataSource = new ListView.DataSource({
    rowHasChanged: (row1, row2) => row1 !== row2,
});
const tabs = [
    { title: '待审核', value: "0" },
    { title: '已审核', value: "1" },
];
export default class alreadyLookThough extends React.Component {
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
            data: {},
            flag: 0,
            textareaValue: "",
            isRec: "",
            isTop: ""
        }
    }
    componentWillMount () {
        Bridge.setShareAble("false");
        document.title = "审核列表";
    }

    componentDidMount () {
        setTimeout(() => {
            $(".item").eq(0).trigger("click");
        }, 100);
        document.title = "审核列表"
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var auditorId = searchArray[0].split('=')[1];
        calm.setState({
            auditorId
        })
        calm.getArticleAndLittleVideo();
        window.addEventListener('resize', calm.onWindowResize)

    }
    /**
     * 获取已审核列表
     */
    getArticleAndLittleVideo () {
        var param = {
            "method": 'getArticleAndLittleVideo',
            "pageNo": calm.state.defaultPageNo,
        };
        WebServiceUtil.requestLittleAntApi6013(JSON.stringify(param), {
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
                        alreadyLookThroudhData: result.response
                    })
                }
            },
            onError: function (error) {
                // Toast.fail(error, 1); 
            }
        });
    }

    /**
    *  已审核的ListView数据全部渲染完毕的回调
    */
    onEndReached2 = (event) => {
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
            calm.getArticleAndLittleVideo();
        });
    };
    /**
    * 跳转未审核页面
    */
    toWaitLookThrough (id, type) {
        var urlW = encodeURI(WebServiceUtil.mobileServiceURL + "WaitlookThroughDetail?id=" + id + "&type=" + type + "&auditorId=" + calm.state.auditorId);
        var data = {
            method: 'openNewPage',
            url: urlW
        };
        Bridge.callHandler(data, null, function (error) {
            window.location.href = urlW;
        });
    }
    /**
     * 跳转已审核页面
     */
    toAlreadyLookThrough (id, type, auditId, index) {
        calm.getUnionByAId(id, auditId, type)
        setTimeout(() => {
            $(".content").scrollTop(0)
        }, 100)
        calm.setState({
            textareaValue: "",
            index: index,
            flag: 0
        }, () => {
            $(".updateModel").slideDown()
            // $(".tagAddPanel_bg").show();
        })
        calm.setState({
            isShow: false
        })
        calm.setState({
            id, type, auditId
        })
    }

    //tab栏切换事件
    onChange (val) {
        if (val.value == 1) {
            calm.initDataSource = [];
            calm.setState({
                dataSource: dataSource.cloneWithRows(calm.initDataSource),
                defaultPageNo: 1,
                isLoading: true,
                hasMore: true,
            }, () => {
                calm.getArticleAndLittleVideo();
            })
        }
        if (val.value == 0) {
            var urlW = encodeURI(WebServiceUtil.mobileServiceURL + "lookThrough?id=" + calm.state.auditorId);
            window.location.href = urlW;
            // var data = {
            //     method: 'openNewPage',
            //     url: urlW
            // };
            // Bridge.callHandler(data, null, function (error) {
            //     window.location.href = urlW;
            // });
        }
    }





    /** 
     * 弹出模板
    */
    //监听窗口改变时间
    onWindwoResize () {
        // this
        setTimeout(() => {
            calm.setState({
                clientHeight: document.body.clientHeight,
            })
        }, 100)
    }
    /**
      * 单选按钮的改变
      */
    radioChange = (value) => {
        if (value == 1) {
            calm.setState({
                isShow: true
            })
        }
        if (value == 0) {
            calm.setState({
                isShow: false,
                isRec: 0,
                isTop: 0
            })
        }
        this.setState({
            isPass: value,
        });


    };


    /**
    * 是否推荐
    */
    recChange = (value) => {
        this.setState({
            isRec: value
        })
    }

    /**
     * 是否置顶
     */
    topChange = (value) => {
        this.setState({
            isTop: value
        })
    }

    /**
     * 重新审核弹出框
     */
    showAlert = (event) => {
        event.stopPropagation()
        var phoneType = navigator.userAgent;
        var phone;
        if (phoneType.indexOf('iPhone') > -1 || phoneType.indexOf('iPad') > -1) {
            phone = 'ios'
        } else {
            phone = 'android'
        }
        var _this = this;
        const alertInstance = alert('您确定重新审核吗?', '', [
            { text: '取消', onPress: () => console.log('cancel'), style: 'default' },
            { text: '确定', onPress: () => calm.reLook() },

        ], phone);
    }

    /**
     * 重新审核
     */
    reLook () {
        calm.setState({
            flag: 1
        })
    }
    /**
     * 点击提交按钮
     */
    submit () {
        calm.setState({
            textareaValue: ""
        })
        var param;
        if (calm.state.type == 0) {
            param = {
                "method": 'updateAUditInfo',
                "auditInfoJson": {
                    auditId: calm.state.auditId,
                    targetId: calm.state.id,
                    targetType: calm.state.type,
                    isPass: calm.state.isPass,
                    auditMark: calm.state.textareaValue,
                    auditorId: 3,
                    istop: calm.state.isTop,
                },
            }
        } else if (calm.state.type == 1) {
            param = {
                "method": 'updateAUditInfo',
                "auditInfoJson": {
                    auditId: calm.state.auditId,
                    targetId: calm.state.id,
                    targetType: calm.state.type,
                    isPass: calm.state.isPass,
                    auditMark: calm.state.textareaValue,
                    auditorId: 3,
                    isRecommend: calm.state.isRec
                },
            }
        } else if (calm.state.type == 2) {
            param = {
                "method": 'updateAUditInfo',
                "auditInfoJson": {
                    auditId: calm.state.auditId,
                    targetId: calm.state.id,
                    targetType: calm.state.type,
                    isPass: calm.state.isPass,
                    auditMark: calm.state.textareaValue,
                    auditorId: 3,
                },
            }

        };
        WebServiceUtil.requestLittleAntApi6013(JSON.stringify(param), {
            onResponse: result => {
                if (result.success) {
                    Toast.success("成功", 1, "", false)
                    $(".updateModel").slideUp();
                    // $(".tagAddPanel_bg").hide();
                    if (calm.state.type == 1) {
                        $(".updateModel video")[0].pause()
                        $(".updateModel video")[0].currentTime = 0;
                    }
                    calm.initDataSource.forEach((v, i) => {
                        if (calm.state.index == i) {
                            v.auditInfo.isPass = calm.state.isPass;
                            v.littleVideoInfo ? v.littleVideoInfo.isRecommend = calm.state.isRec : -1;
                            v.articleInfo ? v.articleInfo.isTop = calm.state.isTop : -1;
                        }
                    })
                    calm.setState({
                        initDataSource: calm.initDataSource
                    },()=>{
                        $(".item").eq(0).trigger("click");
                    })
                }

            },
            onError: function (error) {
                Toast.fail(error, 1);
            }
        });
    }


    /**
     * 获取已经修改的数据
     */
    getUnionByAId (id, auditId, type) {
        var param = {
            "method": 'getUnionByAId',
            "Id": id,
            "auditId": auditId,
            "type": type
        };
        WebServiceUtil.requestLittleAntApi6013(JSON.stringify(param), {
            onResponse: result => {
                if (result.success) {
                    calm.setState({
                        data: result.response,
                        textareaValue: result.response.auditInfo ? result.response.auditInfo.auditMark : "",
                        isPass: result.response.auditInfo ? result.response.auditInfo.isPass : "",
                        isTop: result.response.auditInfo ? result.response.auditInfo.istop : "",
                        isRec: result.response.auditInfo ? result.response.auditInfo.isRecommend : "",
                        isShow: result.response.auditInfo ? (result.response.auditInfo.isPass == 1 ? true : false) : ""
                    })
                }
            },
            onError: function (error) {
                Toast.fail(error, 1);
            }
        });
    }

    /**
     * 点击取消
     */
    cancle () {
        $(".updateModel").slideUp()
        if (calm.state.type == 1) {
            $(".updateModel video")[0].pause()
            $(".updateModel video")[0].currentTime = 0;
        }
        // $(".tagAddPanel_bg").hide();

    }


    render () {
        var _this = this;
        const passData = [
            { value: 1, label: '通过' },
            { value: 0, label: '不通过' },
        ];
        const isRecData = [
            { value: 1, label: '是' },
            { value: 0, label: '否' },
        ];
        const isTopData = [
            { value: 1, label: '是' },
            { value: 0, label: '否' },
        ];
        const { isPass, isRec, isTop } = this.state;
        const row2 = (rowData, sectionID, rowID) => {
            return (
                <div>
                    {
                        rowData.littleVideoInfo ?
                            <div className="item my_flex" onClick={_this.toAlreadyLookThrough.bind(this, rowData.littleVideoInfoID, rowData.type, rowData.auditId, rowID)}>
                                <img className='photo' src={rowData.littleVideoInfo.userInfo ? rowData.littleVideoInfo.userInfo.avatar : ""} alt="" />
                                <div className="right">
                                    <div className="topMsg my_flex">
                                        <span className='author text_hidden'>{rowData.littleVideoInfo.userInfo ? rowData.littleVideoInfo.userInfo.userName : ""}</span>
                                        <span className='type'>{/*类型：短视频*/}<img src={require("../img/icon_video.png")} /></span>
                                        {rowData.littleVideoInfo.isRecommend == 1 ? (rowData.littleVideoInfo.isRecommend == 0 ? "" : <span className='toPriority'>优先</span>) : ""}
                                    </div>
                                    <div className='status'>{rowData.auditInfo ? (rowData.auditInfo.isPass == 1 ? <i className='pass'>通过</i> : <i>未通过</i>) : ""}</div>
                                    <div className='title'>{rowData.littleVideoInfo.videoContent}</div>
                                    <div className='time'>{WebServiceUtil.formatYMD(rowData.littleVideoInfo.createTime)}</div>
                                </div>
                            </div>
                            :
                            rowData.articleInfo ?
                                <div className="item my_flex" onClick={_this.toAlreadyLookThrough.bind(this, rowData.articleInfoId, rowData.type, rowData.auditId, rowID)}>
                                    <img className='photo' src={rowData.articleInfo.userInfo ? rowData.articleInfo.userInfo.avatar : ""} alt="" />
                                    <div className="right">
                                        <div className="topMsg my_flex">
                                            <span className='author text_hidden'>{rowData.articleInfo.userInfo ? rowData.articleInfo.userInfo.userName : ""}</span>
                                            <span className='type'>{/*类型：自媒体文章*/}<img src={require("../img/icon_media.png")} /></span>
                                            {rowData.articleInfo.isTop == 1 ? (rowData.articleInfo.isTop == 0 ? "" : <span className='toFirst'>置顶</span>) : ""}
                                        </div>
                                        <div className='status'>{rowData.auditInfo ? (rowData.auditInfo.isPass == 1 ? <i className='pass'>通过</i> : <i>未通过</i>) : ""}</div>
                                        <div className='title'>{rowData.articleInfo.articleTitle}</div>
                                        <div className='time'>{WebServiceUtil.formatYMD(rowData.articleInfo.createTime)}</div>
                                    </div>
                                </div>
                                :
                                rowData.discussInfo ?
                                    <div className="item my_flex" onClick={_this.toAlreadyLookThrough.bind(this, rowData.discussInfoId, rowData.type, rowData.auditId, rowID)}>
                                        <img className='photo' src={rowData.discussInfo.discussUser ? rowData.discussInfo.discussUser.avatar : ""} alt="" />
                                        <div className='right'>
                                            <div className="topMsg my_flex">
                                                <span className='author text_hidden'>{rowData.discussInfo.discussUser ? rowData.discussInfo.discussUser.userName : ""}</span>
                                                <span className="type">{/*类型：评论*/}<img src={require("../img/icon_comment.png")} /></span>
                                            </div>
                                            <div className='status'>{rowData.auditInfo ? (rowData.auditInfo.isPass == 1 ? <i className='pass'>通过</i> : <i>未通过</i>) : ""}</div>
                                            <div className='title'>{rowData.discussInfo.discussContent}</div>
                                            <div className='time'>{WebServiceUtil.formatYMD(rowData.discussInfo.createTime)}</div>
                                        </div>
                                    </div>
                                    :
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
                <div className="To-auditLeft" style={{
                    height: document.documentElement.clientHeight - 46,
                    backgroundColor: '#f4f4f4'
                }}>
                    {/* 已经审核 */}
                    <ListView
                        ref={el => this.lv = el}
                        dataSource={this.state.dataSource}    //数据类型是 ListViewDataSource
                        renderFooter={() => (
                            <div style={{ paddingTop: 5, paddingBottom: 0, textAlign: 'center' }}>
                                {this.state.isLoading ? '正在加载...' : '已经全部加载完毕'}
                            </div>)}
                        renderRow={row2}   //需要的参数包括一行数据等,会返回一个可渲染的组件为这行数据渲染  返回renderable
                        className="am-list reviewed"
                        pageSize={30}    //每次事件循环（每帧）渲染的行数
                        //useBodyScroll  //使用 html 的 body 作为滚动容器   bool类型   不应这么写  否则无法下拉刷新
                        scrollRenderAheadDistance={200}   //当一个行接近屏幕范围多少像素之内的时候，就开始渲染这一行
                        onEndReached={this.onEndReached2}  //当所有的数据都已经渲染过，并且列表被滚动到距离最底部不足onEndReachedThreshold个像素的距离时调用
                        onEndReachedThreshold={10}  //调用onEndReached之前的临界值，单位是像素  number类型
                        initialListSize={30}   //指定在组件刚挂载的时候渲染多少行数据，用这个属性来确保首屏显示合适数量的数据
                        scrollEventThrottle={20}     //控制在滚动过程中，scroll事件被调用的频率
                        style={{
                            height: document.body.clientHeight - 46,
                        }}
                    />
                </div>
                <div className="updateModel" style={{ display: 'none', width: "100%", height: "500px", position: "absolute", left: "0", padding: "10px 0 0 0", bottom: "0" }}>
                    <div id="alreadyLookThrough" style={{
                        height: calm.state.clientHeight
                    }}>
                        {/* <div className="goBack line_public"><Icon type="left" onClick={calm.goBack}/></div> */}
                        <div className="content">
                            {
                                // 自媒体文章
                                calm.state.type == 0 ?
                                    <div>
                                        {
                                            calm.state.data.articleInfo ?
                                                <div>
                                                    <div className='sameBack'>
                                                        <div className='title'>{calm.state.data.articleInfo.articleTitle}</div>
                                                        <div className='topMsg'>
                                                            <img className="photo" src={calm.state.data.articleInfo.userInfo ? calm.state.data.articleInfo.userInfo.avatar : ""} alt="" />
                                                            <span className='author'>{calm.state.data.articleInfo.userInfo ? calm.state.data.articleInfo.userInfo.userName : ""}</span>
                                                            <span className='time'>{calm.state.data.articleInfo.createTime ? WebServiceUtil.formatAllTime(calm.state.data.articleInfo.createTime) : ""}</span>
                                                            <span className='type'>{/*类型：自媒体文章*/}<img src={require("../img/icon_media.png")} /></span>
                                                        </div>
                                                        <div className='textCont' dangerouslySetInnerHTML={{ __html: calm.state.data.articleInfo.articleContent }}></div>
                                                    </div>
                                                    <div className='review'>
                                                        <div className='line_public'>
                                                            <span className='title'>审核人：</span>
                                                            {calm.state.data.auditInfo.auditorUser ? calm.state.data.auditInfo.auditorUser.userName : ""}
                                                            <span className='time'>{calm.state.data.auditInfo.auditingTime ? WebServiceUtil.formatAllTime(calm.state.data.auditInfo.auditingTime) : ""}</span></div>
                                                        <div className='line_public'>
                                                            <span className='title'>审核说明：</span>
                                                            <div className='reCont'>
                                                                {calm.state.data.auditInfo.auditMark ? calm.state.data.auditInfo.auditMark : "无"}
                                                            </div>
                                                        </div>
                                                        <div className='result'>
                                                            <span className='title'>审核结果：</span>
                                                            {calm.state.data.auditInfo.isPass == 1 ? <span className="pass">已通过</span> : <span>未通过</span>}
                                                            {calm.state.data.auditInfo.istop == 1 ? <span className="pass">已置顶</span> : <span>未置顶</span>}
                                                            {/* {calm.state.data.auditInfo.isRecommend == 1 ? <span className="pass">已推荐</span> : <span>未推荐</span>} */}
                                                            <div className="reBtn" onClick={calm.showAlert} style={{ display: calm.state.flag == 0 ? "block" : "none" }}>
                                                                重新审核
                                                </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                :
                                                ""
                                        }
                                    </div>
                                    :
                                    // 短视频
                                    calm.state.type == 1 ?
                                        <div>
                                            {
                                                calm.state.data.littleVideoInfo ?
                                                    <div>
                                                        <div className='sameBack  sameBackTop sameBackBottom'>
                                                            <div className='topMsg'>
                                                                <img className="photo" src={calm.state.data.littleVideoInfo.userInfo ? calm.state.data.littleVideoInfo.userInfo.avatar : ""} alt="" />
                                                                <span className='author'>{calm.state.data.littleVideoInfo.userInfo ? calm.state.data.littleVideoInfo.userInfo.userName : ""}</span>
                                                                <span className='time'>{calm.state.data.littleVideoInfo.createTime ? WebServiceUtil.formatAllTime(calm.state.data.littleVideoInfo.createTime) : ""}</span>
                                                                <span className="type">{/*类型：短视频*/}<img src={require("../img/icon_video.png")} /></span>
                                                            </div>
                                                            <div className='textCont'>
                                                                <div className='video_title textOver2'>{calm.state.data.littleVideoInfo.videoContent}</div>
                                                                <video
                                                                    className="tag-vedio"
                                                                    poster={calm.state.data.littleVideoInfo.coverPath}
                                                                    style={{ width: "100%" }}
                                                                    controls="controls"
                                                                    preload="load"
                                                                    src={calm.state.data.littleVideoInfo.videoPath}
                                                                    autoPlay>
                                                                </video>
                                                            </div>
                                                        </div>
                                                        <div className='review'>
                                                            <div className='line_public'>
                                                                <span className='title'>审核人：</span>
                                                                {calm.state.data.auditInfo.auditorUser ? calm.state.data.auditInfo.auditorUser.userName : ""}
                                                                <span className='time'>{calm.state.data.auditInfo.auditingTime ? WebServiceUtil.formatAllTime(calm.state.data.auditInfo.auditingTime) : ""}</span></div>
                                                            <div className='line_public'>
                                                                <span className='title'>审核说明：</span>
                                                                <div className='reCont'>
                                                                    {calm.state.data.auditInfo.auditMark ? calm.state.data.auditInfo.auditMark : "无"}
                                                                </div>
                                                            </div>
                                                            <div className='result'>
                                                                <span className='title'>审核结果：</span>
                                                                {calm.state.data.auditInfo.isPass == 1 ? <span className="pass">已通过</span> : <span>未通过</span>}
                                                                {calm.state.data.auditInfo.isRecommend == 1 ? <span className="pass">已优先</span> : <span>未优先</span>}
                                                                <div className="reBtn" onClick={calm.showAlert} style={{ display: calm.state.flag == 0 ? "block" : "none" }}>
                                                                    重新审核
                                                        </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    :
                                                    ""

                                            }

                                        </div>
                                        :
                                        calm.state.type == 2 ?
                                            <div>
                                                {
                                                    calm.state.data.discussInfo ?
                                                        <div>
                                                            <div className="sameBack">
                                                                <div className='topMsg'>
                                                                    <img className="photo" src={calm.state.data.discussInfo.discussUser ? calm.state.data.discussInfo.discussUser.avatar : ""} alt="" />
                                                                    <span className='author'>{calm.state.data.discussInfo.discussUser ? calm.state.data.discussInfo.discussUser.userName : ""}</span>
                                                                    <span className='time'>{WebServiceUtil.formatYMD(calm.state.data.discussInfo.createTime)}</span>
                                                                    <span className="type">{/*类型：评论*/}<img src={require("../img/icon_comment.png")} /></span>
                                                                </div>
                                                                <div className='textCont'>
                                                                    {calm.state.data.discussInfo.discussContent}
                                                                </div>
                                                            </div>
                                                            <div className='review'>
                                                                <div className='line_public'>
                                                                    <span className='title'>审核人：</span>
                                                                    {calm.state.data.auditInfo.auditorUser ? calm.state.data.auditInfo.auditorUser.userName : ""}
                                                                    <span className='time'>{calm.state.data.auditInfo.auditingTime ? WebServiceUtil.formatAllTime(calm.state.data.auditInfo.auditingTime) : ""}</span></div>
                                                                <div className='line_public'>
                                                                    <span className='title'>审核说明：</span>
                                                                    <div className='reCont'>
                                                                        {calm.state.data.auditInfo.auditMark ? calm.state.data.auditInfo.auditMark : "无"}
                                                                    </div>
                                                                </div>
                                                                <div className='result'>
                                                                    <span className='title'>审核结果：</span>
                                                                    {calm.state.data.auditInfo.isPass == 1 ? <span className="pass">已通过</span> : <span>未通过</span>}
                                                                    <div className="reBtn" onClick={calm.showAlert} style={{ display: calm.state.flag == 0 ? "block" : "none" }}>
                                                                        重新审核
                                                        </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        : ""
                                                }
                                            </div>
                                            :
                                            ""
                            }
                            {
                                calm.state.type == 0 ?
                                    <div style={{ display: calm.state.flag == 1 ? "block" : "none" }}>
                                        <div className="isDangerArea">
                                            <List className="line_public reCheckCont" renderHeader={() => '审核：'}>
                                                {passData.map(i => (
                                                    <RadioItem key={i.value} checked={isPass === i.value} onChange={() => this.radioChange(i.value)}>
                                                        {i.label}<List.Item.Brief>{i.extra}</List.Item.Brief>
                                                    </RadioItem>
                                                ))}
                                            </List>
                                            <div style={{ display: calm.state.isShow ? "block" : "none" }}>
                                                {/* <List renderHeader={() => '推荐：'}>
                                            {isRecData.map(i => (
                                                <RadioItem key={i.value} checked={isRec === i.value} onChange={() => this.recChange(i.value)}>
                                                    {i.label}
                                                </RadioItem>
                                            ))}
                                        </List> */}
                                                <List className='line_public' renderHeader={() => '置顶：'}>
                                                    {isTopData.map(i => (
                                                        <RadioItem key={i.value} checked={isTop === i.value} onChange={() => this.topChange(i.value)}>
                                                            {i.label}
                                                            {/*<List.Item.Brief>{i.extra}</List.Item.Brief>*/}
                                                        </RadioItem>
                                                    ))}
                                                </List>
                                            </div>

                                        </div>
                                        <div className="sameBack description auditTOP">审核说明:
                                    <List>
                                                <TextareaItem
                                                    ref={el => calm.autoFocusInst = el}
                                                    rows={3}
                                                    placeholder="请在此处输入审核的说明／不通过的原因"
                                                    onChange={v => _this.setState({
                                                        textareaValue: v
                                                    })}
                                                    count={30}
                                                    value={calm.state.textareaValue}
                                                />
                                            </List>
                                        </div>

                                    </div>
                                    :
                                    calm.state.type == 1 ?
                                        <div style={{ display: calm.state.flag == 1 ? "block" : "none" }}>
                                            <div className="isDangerArea priority line_public reCheckCont">
                                                <List className="line_public" renderHeader={() => '审核：'}>
                                                    {passData.map(i => (
                                                        <RadioItem key={i.value} checked={isPass === i.value} onChange={() => this.radioChange(i.value)}>
                                                            {i.label}<List.Item.Brief>{i.extra}</List.Item.Brief>
                                                        </RadioItem>
                                                    ))}
                                                </List>
                                                <List style={{ display: calm.state.isShow ? "block" : "none" }} renderHeader={() => '优先展示：'}>
                                                    {isRecData.map(i => (
                                                        <RadioItem key={i.value} checked={isRec === i.value} onChange={() => this.recChange(i.value)}>
                                                            {i.label}
                                                            {/*<List.Item.Brief>{i.extra}</List.Item.Brief>*/}
                                                        </RadioItem>
                                                    ))}
                                                </List>

                                            </div>
                                            <div className="sameBack description auditTOP">审核说明:
                                        <List>
                                                    <TextareaItem
                                                        rows={3}
                                                        ref={el => calm.autoFocusInst = el}
                                                        placeholder="请在此处输入审核的说明／不通过的原因"
                                                        onChange={v => _this.setState({
                                                            textareaValue: v
                                                        })}
                                                        count={30}
                                                        value={calm.state.textareaValue}
                                                    />
                                                </List>
                                            </div>


                                        </div>
                                        :
                                        calm.state.type == 2 ?
                                            <div style={{ display: calm.state.flag == 1 ? "block" : "none" }}>
                                                <div className="isDangerArea">
                                                    <List className="line_public reCheckCont" renderHeader={() => '审核：'}>
                                                        {passData.map(i => (
                                                            <RadioItem key={i.value} checked={isPass === i.value} onChange={() => this.radioChange(i.value)}>
                                                                {i.label}<List.Item.Brief>{i.extra}</List.Item.Brief>
                                                            </RadioItem>
                                                        ))}
                                                    </List>
                                                </div>
                                                <div className="sameBack description auditTOP">审核说明:
                                                    <List>
                                                        <TextareaItem
                                                            rows={3}
                                                            ref={el => calm.autoFocusInst = el}
                                                            placeholder="请在此处输入审核的说明／不通过的原因"
                                                            onChange={v => _this.setState({
                                                                textareaValue: v
                                                            })}
                                                            count={30}
                                                            value={calm.state.textareaValue}
                                                        />
                                                    </List>
                                                </div>

                                            </div>
                                            :
                                            ""
                            }
                        </div>
                    </div>
                    <div className="bottomBox">
                        <span className="close" onClick={calm.cancle}>取消</span>
                        <span className="bind" onClick={_this.submit}>确定</span>
                    </div>
                </div>
                {/* <div className="tagAddPanel_bg"></div> */}
            </div>
        )
    }
}