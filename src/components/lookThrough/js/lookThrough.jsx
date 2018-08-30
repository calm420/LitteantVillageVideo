import React from "react";
import { Tabs, WhiteSpace, ListView, Button, List, Radio, TextareaItem, Toast, Modal, } from 'antd-mobile';
const RadioItem = Radio.RadioItem;
const alert = Modal.alert;
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
            data: {},
            clientHeight: document.body.clientHeight,
            textareaValue: "",
            showMark: true
        }
    }

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
        window.addEventListener('resize', calm.onWindowResize);
        $(".tagAddPanel_bg").hide();

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

    scroll(e) {
        calm.setState({
            scrollTop: e.target.scrollTop
        })
    }

    /**
    * 跳转未审核页面
    */
    toWaitLookThrough(id, type, index) {
        setTimeout(() => {
            $(".content").scrollTop(0)
        },100)
        calm.setState({
            textareaValue: "",
            index: index
        }, () => {
            $(".updateModel").slideDown()
            $(".tagAddPanel_bg").show();
            console.log(calm.state.textareaValue, "calm.state.textareaValue")
        })
        calm.setState({
            isShow: false
        })
        calm.setState({
            id, type
        })
        if (type == 0) {
            calm.getArticleInfoById(id)

        } else if (type == 1) {
            calm.getLittleVideoById(id)
        } else if (type == 2) {
            calm.getDiscussInfoById(id)
        }
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
    /**
     * 点击确定
     */
    sure() {

    }
    /**
     * 点击取消
     */
    cancle() {
        $(".updateModel").slideUp()
        if (calm.state.type == 1) {
            $(".updateModel video")[0].pause()
            $(".updateModel video")[0].currentTime = 0;
        }
        $(".tagAddPanel_bg").hide();

    }



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
     * 自媒体文章
     */
    getArticleInfoById(id) {
        var param = {
            "method": 'getArticleInfoById',
            "articleId": id,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                console.log(result)
                if (result.success) {
                    if (result.response.auditId > 0) {
                        calm.setState({
                            showStatus: true,
                            showMark: false
                        })
                    }
                    if (result.response.auditInfo.isPass == 1) {
                        calm.setState({
                            isShow: true,
                            isRec: result.response.isRecommend,
                            isTop: result.response.isTop
                        })
                    }
                    calm.setState({
                        data: result.response,
                        isPass: result.response.auditInfo.isPass,
                        auditUser: result.response.auditInfo.auditorUserName,
                        textareaValue: result.response.auditInfo.auditMark,
                        auditMark: result.response.auditInfo.auditMark,
                        auditingTime: result.response.auditInfo.auditingTime,
                        isRec: result.response.isRecommend,
                        isTop: result.response.isTop
                    })
                }
            },
            onError: function (error) {
                // Toast.fail(error, 1);
            }
        });
    }
    /**
     * 短时频数据
     */
    getLittleVideoById(id) {
        var param = {
            "method": 'getLittleVideoById',
            "videoId": id,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                // alert(JSON.stringify(result));
                if (result.success) {
                    if (result.response.auditId > 0) {
                        calm.setState({
                            showStatus: true,
                            showMark: false
                        })
                    }
                    if (result.response.auditInfo.isPass == 1) {
                        calm.setState({
                            isShow: true,
                            isRec: result.response.isRecommend,
                            isTop: result.response.istop
                        })
                    }
                    calm.setState({
                        data: result.response,
                        isPass: result.response.auditInfo.isPass,
                        auditUser: result.response.auditInfo.auditorUserName,
                        auditMark: result.response.auditInfo.auditMark,
                        textareaValue: result.response.auditInfo.auditMark,
                        auditingTime: result.response.auditInfo.auditingTime,
                        isTop: result.response.istop,
                        isRec: result.response.isRecommend,

                    })
                }
            },
            onError: function (error) {
                // Toast.fail(error, 1);
            }
        });
    }

    /**
     * 获取评论数据
     */
    getDiscussInfoById(id) {
        var param = {
            "method": 'getDiscussInfoById',
            "discussId": id,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {

                if (result.success) {
                    if (result.response.auditId > 0) {
                        calm.setState({
                            showStatus: true,
                            showMark: false
                        })
                    }
                    calm.setState({
                        isShow: true,
                        data: result.response,
                        isPass: result.response.auditInfo.isPass,
                        auditUser: result.response.auditInfo.auditorUserName,
                        auditMark: result.response.auditInfo.auditMark,
                        textareaValue: result.response.auditInfo.auditMark,
                        auditingTime: result.response.auditInfo.auditingTime,
                    })
                }
            },
            onError: function (error) {
                // Toast.fail(error, 1);
            }
        });
    }
    /**
     * 单选按钮的改变
     */
    redioChange = (value) => {
        console.log(this.state.isPass, "isPass")
        console.log(value, "v")
        this.state.isPass = value;
        if (value == 1) {
            calm.setState({
                isShow: true,
                // isRec:-1,
                // isTop:-1
            })
        }
        if (value == 0) {
            calm.setState({
                isShow: false,
                // isRec:"",
                // isTop:""
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
        console.log(value, "rec")
        this.setState({
            isRec: value
        })
    }

    /**
     * 是否置顶
     */
    topChange = (value) => {
        console.log(value, "top")
        this.setState({
            isTop: value
        })
    }

    /**
     * 点击提交按钮
     */
    submit() {
        calm.setState({
            textareaValue: ""
        })
        var param;
        //小视频
        if (calm.state.type == 0) {
            // if(calm.state.isPass == ""){
            //     Toast.info("1")
            //     return
            // }
            // if(calm.state.isPass == "" && calm.state.isTop == ""){
            //     Toast.info("2")
            //     return
            // }
            // if(calm.state.isPass == 1 && calm.state.isTop == ""){
            //     Toast.info("3")
            //     return
            // }
            param = {
                "method": 'saveAuditInfo',
                "auditInfoJson": {
                    targetId: calm.state.id,
                    targetType: calm.state.type,
                    isPass: calm.state.isPass,
                    auditMark: calm.state.textareaValue,
                    auditorId: calm.state.auditorId,
                    istop: calm.state.isTop,
                    // isRecommend: calm.state.isRec
                },
            };
        } else if (calm.state.type == 1) {
            // if(calm.state.isPass == ""){
            //     Toast.info("1111111")
            //     return
            // }
            // if(calm.state.isPass == "" && calm.state.isRec == ""){
            //     Toast.info("2222222")
            //     return
            // }
            // if(calm.state.isPass == 1 && calm.state.isRec == ""){
            //     Toast.info("333")
            //     return
            // }

            param = {
                "method": 'saveAuditInfo',
                "auditInfoJson": {
                    targetId: calm.state.id,
                    targetType: calm.state.type,
                    isPass: calm.state.isPass,
                    auditMark: calm.state.textareaValue,
                    auditorId: calm.state.auditorId,
                    isRecommend: calm.state.isRec
                },
            };
        } else if (calm.state.type == 2) {
            // if(calm.state.isPass == ""){
            //     Toast.info("bububu")
            //     return
            // }
            param = {
                "method": 'saveAuditInfo',
                "auditInfoJson": {
                    targetId: calm.state.id,
                    targetType: calm.state.type,
                    isPass: calm.state.isPass,
                    auditMark: calm.state.textareaValue,
                    auditorId: calm.state.auditorId,
                },
            };
        }
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                // alert(JSON.stringify(result))
                if (result.success) {
                    Toast.success('成功');
                    $(".updateModel").slideUp();
                    // $(".updateModel").hide();
                    $(".tagAddPanel_bg").hide();
                    calm.setState({
                        initDataSource: calm.initDataSource.splice(calm.state.index, 1)
                    })
                }
            },
            onError: function (error) {
                // Toast.fail(error, 1);
            }
        });
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
    reLook() {
        calm.setState({
            showMark: true
        })
    }
    render() {
       
        var _this = this;
        const row = (rowData, sectionID, rowID) => {
            // console.log(rowData,"rowData")
            rowData = rowData || {}
            return (
                <div>
                    {
                        rowData.littleVideoInfo ?
                            <div className="item my_flex" onClick={_this.toWaitLookThrough.bind(this, rowData.littleVideoInfoID, rowData.type, rowID)}>
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


        const data2 = [
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
                            onScroll={this.scroll}
                            style={{
                                height: document.body.clientHeight - 46,
                            }}
                        />
                    </div>
                </Tabs>
                <div className="updateModel" style={{ display: 'none', width: "100%", height: "500px", position: "absolute", left: "0", padding: "10px 0 0 0", bottom: "0" }}>
                    <div id="waitLookThrough">
                        {/* <div className="goBack line_public"><Icon type="left" onClick={calm.goBack}/></div> */}
                        <div className="content" ref="contentDOM">
                            {
                                calm.state.type == 0 ?
                                    <div className="sameBack sameBackNew">
                                        <div className='title'>{calm.state.data.articleTitle}</div>
                                        <div className='topMsg'>
                                            <img className="photo" src={calm.state.data.userInfo ? calm.state.data.userInfo.avatar : ""} alt="" />
                                            <span className='author'>{calm.state.data.userInfo ? calm.state.data.userInfo.userName : ""}</span>
                                            <span className='time'>{WebServiceUtil.formatYMD(calm.state.data.createTime)}</span>
                                            <span className="type">{/*类型：自媒体文章*/}<img src={require("../img/icon_media.png")} /></span>
                                        </div>
                                        <div className='textCont' dangerouslySetInnerHTML={{ __html: calm.state.data.articleContent }}></div>
                                    </div>
                                    :
                                    calm.state.type == 1 ?
                                        <div className="sameBack sameBackTop sameBackBottom">
                                            <div className='topMsg'>
                                                <img className="photo" src={calm.state.data.userInfo ? calm.state.data.userInfo.avatar : ""} alt="" />
                                                <span className='author'>{calm.state.data.userInfo ? calm.state.data.userInfo.userName : ""}</span>
                                                <span className='time'>{WebServiceUtil.formatYMD(calm.state.data.createTime)}</span>
                                                <span className="type">{/*类型：短视频*/}<img src={require("../img/icon_video.png")} /></span>
                                            </div>
                                            <div className="textCont">
                                                <div className='video_title textOver2'>{calm.state.data.videoContent}</div>
                                                <video
                                                    controls="controls"
                                                    preload="auto"
                                                    className="tag-vedio"
                                                    controlslist="nodownload nofullscreen"
                                                    x5-video-player-type="h5"
                                                    playsinline="true"
                                                    webkit-playsinline="true"
                                                    poster={calm.state.data.coverPath}
                                                    style={{ objectFit: "contain", width: "100%" }}
                                                    src={calm.state.data.videoPath}>
                                                </video>
                                            </div>
                                        </div>
                                        :
                                        calm.state.type == 2 ?
                                            <div className="sameBack sameBackTop">
                                                <div className='topMsg'>
                                                    <img className="photo" src={calm.state.data.userInfo ? calm.state.data.userInfo.avatar : ""} alt="" />
                                                    <span className='author'>{calm.state.data.discussUser ? calm.state.data.discussUser.userName : ""}</span>
                                                    <span className='time'>{WebServiceUtil.formatYMD(calm.state.data.createTime)}</span>
                                                    <span className="type">{/*类型：评论*/}<img src={require("../img/icon_comment.png")} /></span>
                                                </div>
                                                <div className="textCont">
                                                    {calm.state.data.discussContent}
                                                </div>
                                            </div>
                                            : ""
                            }
                            {
                                calm.state.type == 0 ?
                                    <div className="calm">
                                        <div style={{ display: calm.state.showStatus ? "block" : "none" }} className="review">
                                            <div className='line_public'>
                                                <span className='title'>审核人：</span>{calm.state.auditUser}
                                                <span className='time'>{WebServiceUtil.formatYMD(calm.state.auditingTime)}</span>

                                            </div>
                                            <div className='line_public'>
                                                <span className='title'>审核说明：</span>
                                                <div className='reCont'>
                                                    {calm.state.auditMark ? calm.state.auditMark : "无"}
                                                </div>
                                            </div>
                                            <div className='result'>
                                                <span className='title'>审核结果：</span>
                                                {calm.state.isPass == 1 ? <span className="pass">已通过</span> : <span>未通过</span>}
                                                {calm.state.isTop == 1 ? <span className="pass">已置顶</span> : <span>未置顶</span>}
                                                <div className="reBtn" onClick={calm.showAlert}>
                                                    重新审核
                                        </div>
                                            </div>
                                        </div>
                                        <div style={{ display: calm.state.showMark ? "block" : "none" }}>
                                            <div className="isDangerArea">
                                                <List renderHeader={() => '审核：'}>
                                                    {data2.map(i => (
                                                        <RadioItem key={i.value} checked={isPass === i.value} onChange={() => this.redioChange(i.value)}>
                                                            {i.label}
                                                            {/*<List.Item.Brief>{i.extra}</List.Item.Brief>*/}
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
                                                    <List className='toFirst' renderHeader={() => '置顶：'}>
                                                        {isTopData.map(i => (
                                                            <RadioItem key={i.value} checked={isTop === i.value} onChange={() => this.topChange(i.value)}>
                                                                {i.label}
                                                                {/*<List.Item.Brief>{i.extra}</List.Item.Brief>*/}
                                                            </RadioItem>
                                                        ))}
                                                    </List>
                                                </div>
                                            </div>
                                            <div className="sameBack description sameBackTop">审核说明:
                                            <List>
                                                    <TextareaItem
                                                        rows={3}
                                                        placeholder="请在此处输入审核的说明／不通过的原因"
                                                        onChange={v => _this.setState({
                                                            textareaValue: v
                                                        })}
                                                        value={calm.state.textareaValue}

                                                        count={30}
                                                    />
                                                </List>
                                            </div>
                                        </div>

                                    </div>

                                    :
                                    calm.state.type == 1 ?
                                        <div className="calm">
                                            <div style={{ display: calm.state.showStatus ? "block" : "none" }} className="review">
                                                <div className='line_public'>
                                                    <span className='title'>审核人：</span>{calm.state.auditUser}
                                                    <span className='time'>{WebServiceUtil.formatYMD(calm.state.auditingTime)}</span>

                                                </div>
                                                <div className='line_public'>
                                                    <span className='title'>审核说明：</span>
                                                    <div className='reCont'>
                                                        {calm.state.auditMark ? calm.state.auditMark : "无"}
                                                    </div>
                                                </div>
                                                <div className='result'>
                                                    <span className='title'>审核结果：</span>
                                                    {calm.state.isPass == 1 ? <span className="pass">已通过</span> : <span>未通过</span>}
                                                    {calm.state.isRec == 1 ? <span className="pass">已优先</span> : <span>未优先</span>}
                                                    <div className="reBtn" onClick={calm.showAlert}>
                                                        重新审核
                                            </div>
                                                    <div>
                                                    </div>

                                                </div>
                                            </div>
                                            <div style={{ display: calm.state.showMark ? "block" : "none" }}>
                                                <div className="isDangerArea priority">
                                                    <List renderHeader={() => '审核：'}>
                                                        {data2.map(i => (
                                                            <RadioItem key={i.value} checked={isPass === i.value} onChange={() => this.redioChange(i.value)}>
                                                                {i.label}
                                                                {/*<List.Item.Brief>{i.extra}</List.Item.Brief>*/}
                                                            </RadioItem>
                                                        ))}
                                                    </List>
                                                    <List className='toPriority' style={{ display: calm.state.isShow ? "block" : "none" }} renderHeader={() => '优先展示：'}>
                                                        {isRecData.map(i => (
                                                            <RadioItem key={i.value} checked={isRec === i.value} onChange={() => this.recChange(i.value)}>
                                                                {i.label}
                                                                {/*<List.Item.Brief>{i.extra}</List.Item.Brief>*/}
                                                            </RadioItem>
                                                        ))}
                                                    </List>

                                                </div>
                                                <div className="sameBack description sameBackTop">审核说明:
                                            <List>
                                                        <TextareaItem
                                                            rows={3}
                                                            placeholder="请在此处输入审核的说明／不通过的原因"
                                                            onChange={v => _this.setState({
                                                                textareaValue: v
                                                            })}
                                                            value={calm.state.textareaValue}

                                                            count={30}
                                                        />
                                                    </List>
                                                </div>
                                            </div>
                                        </div>
                                        :
                                        calm.state.type == 2 ?
                                            <div className="calm">
                                                <div style={{ display: calm.state.showStatus ? "block" : "none" }} className="review">
                                                    <div className='line_public'>
                                                        <span className='title'>审核人：</span>{calm.state.auditUser}
                                                        <span className='time'>{WebServiceUtil.formatYMD(calm.state.auditingTime)}</span>

                                                    </div>
                                                    <div className='line_public'>
                                                        <span className='title'>审核说明：</span>
                                                        <div className='reCont'>
                                                            {calm.state.auditMark ? calm.state.auditMark : "无"}
                                                        </div>
                                                    </div>
                                                    <div className='result'>
                                                        <span className='title'>审核结果：</span>
                                                        {calm.state.data.auditInfo.isPass == 1 ? <span className="pass">已通过</span> : <span>未通过</span>}
                                                        <div className="reBtn" onClick={calm.showAlert}>
                                                            重新审核
                                                </div>
                                                        <div>

                                                        </div>
                                                        <div style={{ display: calm.state.showMark ? "block" : "none" }}>
                                                            <div className="isDangerArea">
                                                                <List renderHeader={() => '审核：'}>
                                                                    {data2.map(i => (
                                                                        <RadioItem key={i.value} checked={isPass === i.value} onChange={() => this.redioChange(i.value)}>
                                                                            {i.label}
                                                                            {/*<List.Item.Brief>{i.extra}</List.Item.Brief>*/}
                                                                        </RadioItem>
                                                                    ))}
                                                                </List>
                                                            </div>
                                                            <div className="sameBack description sameBackTop">审核说明:
                                                        <List>
                                                                    <TextareaItem
                                                                        rows={3}
                                                                        placeholder="请在此处输入审核的说明／不通过的原因"
                                                                        onChange={v => _this.setState({
                                                                            textareaValue: v
                                                                        })}
                                                                        value={calm.state.textareaValue}
                                                                        count={30}
                                                                    />
                                                                </List>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            :
                                            ""
                            }
                            {/* <div className="submitBtn noPosition" style={{ marginTop: 40 }}>
                        <Button type='warning' onClick={_this.submit}>提交</Button>
                    </div> */}
                        </div>
                    </div>
                    <div className="bottomBox">
                        <span className="close" onClick={calm.cancle}>取消</span>
                        <span className="bind" onClick={_this.submit}>确定</span>
                    </div>
                </div>
                <div className="tagAddPanel_bg"></div>
            </div>
        )
    }
}