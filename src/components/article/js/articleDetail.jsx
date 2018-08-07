import React from 'react';
import {
    Toast, DatePicker, ListView,TextareaItem, Button, List, Picker, Tag
} from 'antd-mobile';
import '../css/articleDetail.less';
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
            data:{
                userInfo:{}
            },
            commitText:''
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
        this.setState({
            artId: artId,
            userId:userId,
        }, () => {
            this.getArticleInfoById();
            this.getUserLikeLog();
            this.getDiscussInfoList();
        })


        $("#text").keydown(function(event) {
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
    getDiscussInfoList(){
        var param = {
            "method": 'getDiscussInfoList',
            "videoId": this.state.artId,
            "pageNo": this.state.defaultPageNo,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                console.log(result,'评论列表');
                if (result.success) {
                    this.state.rsCount = result.pager.rsCount;
                    this.initDataSource = this.initDataSource.concat(result.response);
                    this.setState({
                        dataSource: dataSource.cloneWithRows(this.initDataSource),
                        isLoading:true
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
    getUserLikeLog(){
        var JsonParameter = {
            userId: this.state.userId,
            targetId: this.state.artId,
            targetType: 0, //自媒体
            // followTargetId:'',
            // followType:''
        }
        var param = {
            "method": 'getUserLikeLog',
            'JsonParameter':JsonParameter
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                if (result.success) {
                    var data = JSON.parse(result.response);
                    console.log(data.currentUserIsLike,'是否点赞');
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
        var param = {
            "method": 'getArticleInfoById',
            "articleId": this.state.artId,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                console.log(result,"detail");
                if (result.success) {
                    this.setState({
                        data: result.response
                    },()=>{
                        $(".ql-image").click(function(e){
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
                }else{
                    Toast.info('+1?');
                }
            },
            onError: function (error) {
                Toast.fail(error, 1);
            }
        });
    }

    likeFlag(){
        // console.log('like');
        this.setState({
            likeFlag: !this.state.likeFlag
        },()=>{
            var param = {
                "method": 'changeArticleLikeCount',
                "userId": this.state.userId,
                "articleId": this.state.artId,
                "changeType": this.state.likeFlag?0:1,//  0点赞 1 取消
            };
            WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
                onResponse: result => {
                    // console.log(result);
                    if (result.success) {

                    }else{
                        Toast.info('+1?');
                    }
                },
                onError: function (error) {
                    Toast.fail(error, 1);
                }
            });
        })
    }

    //评论
    saveDiscussInfo(){
        console.log(theLike.state.commitText,'commitText')
        if(theLike.state.commitText == ''){
            Toast.info('请输入评论内容!',1)
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
                console.log(result,"pinglun");
                if (result.success) {
                    Toast.info('评论成功!',1);
                    theLike.initDataSource = [];
                    theLike.setState({
                        dataSource: dataSource.cloneWithRows(theLike.initDataSource),
                        defaultPageNo: 1,
                        clientHeight: document.body.clientHeight,
                        isLoading: true,
                        hasMore: true,
                        commitText:''
                    },()=>{
                        theLike.getDiscussInfoList();
                    })
                }else{
                    Toast.info('评论失败!',1);
                }
            },
            onError: function (error) {
                Toast.fail(error, 1);
            }
        });
    }


    //评论框输入事件
    commitChange(val){
        this.setState({
            commitText:val
        })
    }



    render() {
        const row = (rowData, sectionID, rowID) => {
            return (
                <div>
                    <List className="listCont line_public ">
                        <Item align="top" thumb={rowData.discussUser.avatar} multipleLine>
                            {rowData.discussUser.userName} <Brief>{rowData.discussContent}</Brief>
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
            <div id="articleDetail">
                <div className="inner">
                    <div className="p15">
                        <div className="title">{this.state.data.articleTitle}</div>
                        <div className="at">
                            <div className="author">{this.state.data.articleTitle}</div>
                            <div className="createTime">{WebServiceUtil.formatYMD(this.state.data.createTime)}</div>
                        </div>
                        <div className="content" dangerouslySetInnerHTML={{__html:this.state.data.articleContent}}></div>
                        <div className="content_bottom" >
                            <div className="like" onClick={this.likeFlag.bind(this)} style={
                                this.state.likeFlag?{borderColor:'#999',color:'#999'}:{borderColor:'#4285F4',color:'#4285F4'}
                            }>
                                <div className={this.state.likeFlag?'noLike':'likeActive'}>
                                    {/*<img src={this.state.likeFlag?require("../images/praise.png"):require("../images/praise_active.png")} alt=""/>*/}
                                    {this.state.data.likeCount}
                                </div>

                            </div>
                        </div>
                    </div>
                        <div className="commit">
                            <div className="">
                                <TextareaItem
                                    id="text"
                                    placeholder="请输入评论内容"
                                    data-seed="logId"
                                    ref={el => this.autoFocusInst = el}
                                    autoHeight
                                    value={this.state.commitText}
                                    onChange={this.commitChange.bind(this)}
                                />
                                {/*<Button type="primary" onClick={this.saveDiscussInfo.bind(this)}>评论</Button>*/}
                            </div>
                        </div>
                            <ListView
                                ref={el => this.lv = el}
                                dataSource={this.state.dataSource}    //数据类型是 ListViewDataSource
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
                                style={{
                                    height: document.body.clientHeight,
                                }}
                            />

                </div>

            </div>
        );
    }

}