import React from 'react';
import {
    Toast, DatePicker, ListView, TextareaItem, Button, List, Picker, Tag, Radio
} from 'antd-mobile';
import '../css/articleDetail.less';

const RadioItem = Radio.RadioItem;
const Item = List.Item;
const Brief = Item.Brief;

const dataSource = new ListView.DataSource({
    rowHasChanged: (row1, row2) => row1 !== row2,
});

var theLike;
export default class articleDetail extends React.Component {

    constructor(props) {
        super(props);
        this.initDataSource = [];
        theLike = this;
        this.state = {
            dataSource: dataSource.cloneWithRows(this.initDataSource),
            defaultPageNo: 1,
            clientHeight: document.body.clientHeight,
            isLoading: true,
            hasMore: true,
            data: {
                userInfo: {}
            },
            commitText: '',
            collection: false,  //是否收藏
            value: 0,
            reportFlag: false,
            reportButtonFlag: false,
            checkVersion:false, //是否显示举报按钮
        }
    }

    componentDidMount() {
        Bridge.setShareAble("false");
        document.title = '校园自媒体';
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var artId = searchArray[0].split('=')[1];
        var userId = searchArray[1].split('=')[1];
        var type = searchArray[2].split('=')[1];
        var machineType = searchArray[3].split('=')[1];
        var version = searchArray[4].split('=')[1];
        console.log(machineType);
        console.log(version);

        this.setState({
            artId: artId,
            userId: userId,
            type: type,
            machineType: machineType,
            version: version
        }, () => {
            this.getArticleInfoById();
            this.getUserLikeLog();
            this.getDiscussInfoList();
            this.getUserFavorite();
        })


        $("#text").keydown(function (event) {
            console.log(this, "this")
            if (event.keyCode == 13) {
                // alert('你按下了Enter');
                theLike.saveDiscussInfo();

            }
        })
    }


    /**
     * 获取评论列表
     * **/
    getDiscussInfoList() {
        var param = {
            "method": 'getDiscussInfoList',
            "videoId": this.state.artId,
            "pageNo": this.state.defaultPageNo,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                console.log(result, '评论列表');
                if (result.success) {
                    this.state.rsCount = result.pager.rsCount;
                    if (this.initDataSource.length == 0 && result.response.length == 0) {
                        this.initDataSource = this.initDataSource.concat([{
                            // avatar:null,
                            // teacher:{},
                            demoFlag: true,
                        }])
                    } else {
                        this.initDataSource = this.initDataSource.concat(result.response);
                    }
                    // this.initDataSource = this.initDataSource.concat(result.response);
                    this.setState({
                        dataSource: dataSource.cloneWithRows(this.initDataSource),
                        isLoading: false
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
            this.getDiscussInfoList();
        });
    };


    // 判断用户是否已经点赞
    getUserLikeLog() {
        var JsonParameter = {
            userId: this.state.userId,
            targetId: this.state.artId,
            targetType: 0, //自媒体
            // followTargetId:'',
            // followType:''
        }
        var param = {
            "method": 'getUserLikeLog',
            'JsonParameter': JsonParameter
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                if (result.success) {
                    var data = JSON.parse(result.response);
                    console.log(data.currentUserIsLike, '是否点赞');
                    this.setState({
                        likeFlag: data.currentUserIsLike
                    })
                }
            },
            onError: function (error) {
                Toast.fail(error, 1);
            }
        });
    }


    /**
     * 按文章id获取详情信息
     * **/
    getArticleInfoById() {
        var headers = {};
        if (this.state.machineType != '' && this.state.version != '') {
            headers = {
                "machineType": 'ios',
                "version": 100
            }
        }
        var param = {
            "method": 'getArticleInfoById',
            "articleId": this.state.artId,
        };
        WebServiceUtil.requestLittleAntApiWithHead(JSON.stringify(param), JSON.stringify(headers), {
            onResponse: result => {
                console.log(result, "detail");
                if (result.success) {
                    this.setState({
                        data: result.response,
                        checkVersion: result.isIosCheckVersion //是否显示举报按钮
                    }, () => {
                        if(this.state.checkVersion){
                            this.setState({
                                reportFlag: true,
                                reportButtonFlag: false,
                            })
                        }
                        $(".ql-image").click(function (e) {
                            console.log(123);
                            console.log(e);
                        });
                    })
                    //文章阅读量+1
                    this.addArticleReadCount()
                }
            },
            onError: function (error) {
                Toast.fail(error, 1);
            }
        });
    }


    /**
     * 阅读量+1
     * **/
    addArticleReadCount() {
        var param = {
            "method": 'addArticleReadCount',
            "articleId": this.state.artId,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                // console.log(result);
                if (result.success) {
                    //文章阅读量+1
                } else {
                    Toast.info('+1?');
                }
            },
            onError: function (error) {
                Toast.fail(error, 1);
            }
        });
    }


    //点赞

    likeFlag() {
        this.setState({
            likeFlag: !this.state.likeFlag
        }, () => {
            console.log(this.state.likeFlag ? '点赞' : '取消点赞');
            var param = {
                "method": 'changeArticleLikeCount',
                "userId": this.state.userId,
                "articleId": this.state.artId,
                "changeType": this.state.likeFlag ? 0 : 1,//  0点赞 1 取消
            };
            WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
                onResponse: result => {
                    console.log(result, '点赞之后');
                    if (result.success) {
                        console.log(this.state.likeFlag);
                        // this.state.data.likeCount = result.response;
                        var data = this.state.data;
                        data.likeCount = result.response;
                        this.setState({
                            data: data
                        })

                    } else {
                        Toast.info('+1?');
                    }
                },
                onError: function (error) {
                    Toast.fail(error, 1);
                }
            });
        })
    }

    // 判断是否收藏
    getUserFavorite() {
        var param = {
            "method": 'getUserFavorite',
            "userId": this.state.userId,
            "targetId": this.state.artId,
            "targetType": 0
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                console.log(result, '是否收藏');
                if (result.success) {
                    this.setState({
                        collection: result.response ? true : false,
                    })
                } else {
                    Toast.info('+1?');
                }
            },
            onError: function (error) {
                Toast.fail(error, 1);
            }
        });
    }

    changePent() {
        var userFavoriteInfoJson = {
            userId: this.state.userId,
            targetId: this.state.artId,
            targetType: 0
        }
        var param = {
            "method": 'changeUserFavoriteInfo',
            "userFavoriteInfoJson": userFavoriteInfoJson,
            "changeType": this.state.collection ? 1 : 0,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                console.log(result, '点击收藏/取消');
                if (result.success) {
                    this.setState({
                        collection: !this.state.collection
                    })
                } else {
                    Toast.info('+1?');
                }
            },
            onError: function (error) {
                Toast.fail(error, 1);
            }
        });
    }

    //评论
    saveDiscussInfo() {
        console.log(theLike.state.commitText, 'commitText')
        if (theLike.state.commitText == '') {
            Toast.info('请输入评论内容!', 1)
            return;
        }
        var param = {
            "method": 'saveDiscussInfo',
            "targetId": theLike.state.artId,
            "targetType": 0,
            "discussContent": theLike.state.commitText,
            "userId": theLike.state.userId
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                console.log(result, "pinglun");
                if (result.success) {
                    Toast.info('评论成功!', 1);
                    theLike.initDataSource = [];
                    theLike.setState({
                        dataSource: dataSource.cloneWithRows(theLike.initDataSource),
                        defaultPageNo: 1,
                        clientHeight: document.body.clientHeight,
                        isLoading: true,
                        hasMore: true,
                        commitText: ''
                    }, () => {
                        theLike.getDiscussInfoList();
                    })
                } else {
                    Toast.info('评论失败!', 1);
                }
            },
            onError: function (error) {
                Toast.fail(error, 1);
            }
        });
    }

    //评论框输入事件
    commitChange(val) {
        this.setState({
            commitText: val
        })
    }

    //举报
    toReport() {
        this.setState({
            reportButtonFlag:true,
        })
    }


    onChange_report = (value) => {
        this.setState({
            value,
        });
    };

    reportSubmit() {
        this.setState({
            reportFlag: false,
            reportButtonFlag:false,
        },()=>{
            Toast.success('您的举报已收到，感谢您的反馈!',1);
        })
    }

    cancelBox = ()=>{
        this.setState({
            reportFlag: true,
            reportButtonFlag: false,
        })
    }

    render() {
        const data_report = [
            {value: 0, label: '广告及垃圾信息'},
            {value: 1, label: '抄袭或未授权转载'},
            {value: 3, label: '欺诈、色情或发布敏感信息'},
            {value: 4, label: '违法犯罪'},
            {value: 5, label: '不实信息'},
            {value: 6, label: '其他'},
        ];
        const row = (rowData, sectionID, rowID) => {
            return (
                <div style={
                    rowData.demoFlag ? {display: 'none'} : {}
                }>
                    <List className="listCont line_public ">
                        <Item align="top" thumb={rowData.discussUser ? rowData.discussUser.avatar : ""} multipleLine>
                            {rowData.discussUser ? rowData.discussUser.userName : ""}
                            <Brief>{rowData.discussContent}</Brief>
                        </Item>
                        {/*<Item extra={WebServiceUtil.formatYMD(rowData.createTime)} align="top" thumb={rowData.discussUser.avatar} multipleLine>*/}
                        {/*{rowData.discussUser.userName} <Brief>{rowData.discussContent}</Brief>*/}
                        {/*</Item>*/}
                    </List>
                </div>
            )
        };
        // var articleContent = this.state.data.articleContent
        return (
            <div id="articleDetail" style={{height: document.body.clientHeight}}>
                <div className="inner">
                    <div className="commit">
                        <div id={this.state.reportFlag?'textAndReport':'textNo'}>
                            <TextareaItem
                                id="text"
                                placeholder="请输入评论内容"
                                data-seed="logId"
                                ref={el => this.autoFocusInst = el}
                                autoHeight
                                value={this.state.commitText}
                                onChange={this.commitChange.bind(this)}
                            />
                            <div className="pent" onClick={this.changePent.bind(this)}>
                                <img
                                    src={this.state.collection ? require("../images/fillPent.png") : require("../images/pent.png")}
                                    alt=""/>
                            </div>
                            <div style={
                                this.state.reportFlag?{display:'inline-block'}:{display:'none'}
                            } className="report" onClick={this.toReport.bind(this)}>
                                <img onClick={this.toReport.bind(this)} src={require("../images/report.png")} alt=""/>
                            </div>
                            {/*<Button type="primary" onClick={this.saveDiscussInfo.bind(this)}>评论</Button>*/}
                        </div>
                    </div>
                    <ListView
                        ref={el => this.lv = el}
                        dataSource={this.state.dataSource}    //数据类型是 ListViewDataSource
                        renderSectionHeader={sectionData => (
                            <div className="p15">
                                <div className="title">{this.state.data.articleTitle}</div>
                                <div className="at">
                                    <div
                                        className="author">{this.state.data.author}</div>
                                    <div
                                        className="createTime">{WebServiceUtil.formatYMD(this.state.data.createTime)}</div>
                                </div>
                                <div className="content"
                                     dangerouslySetInnerHTML={{__html: this.state.data.articleContent}}></div>
                                <div className="content_bottom">
                                    <div className="like" onClick={this.likeFlag.bind(this)} style={
                                        this.state.likeFlag ? {
                                            borderColor: '#FE5C50',
                                            color: '#FE5C50'
                                        } : {borderColor: '#999', color: '#999'}
                                    }>
                                        <div className={this.state.likeFlag ? 'likeActive' : 'noLike'}>
                                            {/*<img src={this.state.likeFlag?require("../images/praise.png"):require("../images/praise_active.png")} alt=""/>*/}
                                            {this.state.data.likeCount}
                                        </div>

                                    </div>
                                </div>
                            </div>
                        )}
                        renderFooter={() => (
                            <div style={{paddingTop: 5, paddingBottom: 0, textAlign: 'center'}}>
                                {this.state.isLoading ? '正在加载...' : '已经全部加载完毕'}
                            </div>)}
                        renderRow={row}   //需要的参数包括一行数据等,会返回一个可渲染的组件为这行数据渲染  返回renderable
                        className="am-list commentList"
                        pageSize={30}    //每次事件循环（每帧）渲染的行数
                        //useBodyScroll  //使用 html 的 body 作为滚动容器   bool类型   不应这么写  否则无法下拉刷新
                        scrollRenderAheadDistance={200}   //当一个行接近屏幕范围多少像素之内的时候，就开始渲染这一行
                        onEndReached={this.onEndReached}  //当所有的数据都已经渲染过，并且列表被滚动到距离最底部不足onEndReachedThreshold个像素的距离时调用
                        onEndReachedThreshold={10}  //调用onEndReached之前的临界值，单位是像素  number类型
                        initialListSize={30}   //指定在组件刚挂载的时候渲染多少行数据，用这个属性来确保首屏显示合适数量的数据
                        scrollEventThrottle={20}     //控制在滚动过程中，scroll事件被调用的频率
                        // useBodyScroll={true}
                        style={{
                            height: document.body.clientHeight - 53,
                        }}
                    />

                    {/*举报 start*/}
                    <div className="positionBox" style={
                        this.state.reportButtonFlag?{display:'block'}:{display:'none'}
                    }>
                        <div className="cancelReport" onClick={this.cancelBox}>X</div>
                        {/*<div className="box_head">请选择举报原因</div>*/}
                        <List renderHeader={() => '请选择举报原因'}>
                            {data_report.map(i => (
                                <RadioItem key={i.value} checked={this.state.value === i.value}
                                           onChange={() => this.onChange_report(i.value)}>
                                    {i.label}
                                </RadioItem>
                            ))}
                        </List>
                        <Button type="primary" onClick={this.reportSubmit.bind(this)}>提交</Button>
                    </div>
                    <div className="postionBox_mask"
                         style={
                             this.state.reportButtonFlag?{display:'block',height:this.state.clientHeight}:{display:'none',height:this.state.clientHeight}
                         }
                         onClick={this.cancelBox}></div>
                    {/*举报 end*/}
                </div>

            </div>
        );
    }

}