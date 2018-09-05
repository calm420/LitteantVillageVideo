import React from 'react';
import {
    Toast, DatePicker, PullToRefresh, ListView, Button, List, Picker, Tag, Tabs
} from 'antd-mobile';
import '../css/articleList.less';

var dataSource = new ListView.DataSource({
    rowHasChanged: (row1, row2) => row1 !== row2,
});
var that;
export default class articleList extends React.Component {

    constructor(props) {
        super(props);
        that = this;
        this.initDataSource = [];
        this.state = {
            dataSource: dataSource.cloneWithRows(this.initDataSource),
            defaultPageNo: 1,
            clientHeight: document.body.clientHeight,
            isLoading: true,
            hasMore: true,
            commit_count: 0,
            detail: {
                type: 1,
                userInfo: {},
                friendsAttachments: []
            },
            commitFlag: false,
            domImage:[]
        }
    }

    componentDidMount() {
        document.title = '';
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var userId = searchArray[0].split('=')[1];
        var cid = searchArray[1] ? searchArray[1].split('=')[1] : '';
        this.setState({
            userId: userId,
            cid: cid
        }, () => {
            this.gitCircleOfFriendsById();
            this.getDiscussInfoList();
            $(document).on('click','.delete_upload_image',function(){
                console.log('delete');
                console.log(that.state.domImage);
                console.log($(this).prev().attr('src'))
                var dom = that.state.domImage;
                for(var i=0;i< dom.length;i++){
                    if(dom[i].key == $(this).prev().attr('src')){
                        dom.splice(i,1);
                    }
                }
                that.setState({
                    domImage:dom
                })
                // for(var k in dom){
                //     if(dom[k].key == $(this).prev().attr('src')){
                //     }
                // }
            })
        })
    }


    /**
     * 获取评论列表
     * **/
    getDiscussInfoList() {
        var param = {
            "method": 'getDiscussInfoList',
            "type": 2,
            "videoId": this.state.cid,
            "pageNo": this.state.defaultPageNo,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                console.log(result, 'getDiscussInfoList')
                if (result.success) {
                    if (result.response.length <= 0) {
                        this.initDataSource = [{type: '无数据'}]
                    } else {
                        this.initDataSource = this.initDataSource.concat(result.response);
                    }
                    this.setState({
                        dataSource: dataSource.cloneWithRows(this.initDataSource),
                        isLoading: true,
                        commit_count: result.pager.rsCount
                    })
                    if ((this.initDataSource.length >= result.pager.rsCount)) {
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


    /**
     *  ListView数据全部渲染完毕的回调
     */
    onEndReached = (event) => {
        var _this = this;
        var currentPageNo = this.state.defaultPageNo;
        if (!this.state.isLoading && !this.state.hasMore) {
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


    /**
     * 按id查询详情
     * **/
    gitCircleOfFriendsById() {
        var param = {
            "method": 'gitCircleOfFriendsById',
            "id": this.state.cid,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                console.log(result, 'gitCircleOfFriendsById')
                if (result.success) {
                    this.setState({
                        detail: result.response
                    })
                    if (result.response.type == 0) {
                        document.title = '错题本';
                    } else {
                        document.title = '主题任务';
                    }
                }

            },
            onError: function (error) {
                Toast.fail(error, 1);
            }
        });
    }


    lookAll() {
        console.log('查看全部')
    }

    setCommit = ()=>{
        this.setState({
            commitFlag: true
        })
    }

    closeCommitBox = ()=>{
        this.setState({
            commitFlag: false
        })
    }

    sendCommit = () =>{
        console.log('发送')
    }


    selectedImage = () =>{
        console.log('selectedImage');
        var url = 'http://img.zcool.cn/community/0117e2571b8b246ac72538120dd8a4.jpg@1280w_1l_2o_100sh.jpg';
        var dom = this.state.domImage;
        dom.push(<div key={url} className="image_item"><img className="appendImage_item" src={url} alt=""/><div className='delete_upload_image'><img
            src={require('../images/close_r.png')} alt=""/></div></div>);
        // dom.key = url;
        this.setState({
            domImage:dom
        })
    }

    render() {
        const row = (rowData, sectionID, rowID) => {
            var dom = '';
            // console.log(rowData.type, 'rowData.type')
            if (rowData.type == '无数据') {
                dom = <div></div>
            } else {
                dom = <div className="list_item" style={{marginTop:'0'}}>
                    <div className="circleList circleList-comment line_public">
                    <div className="list_head">
                        <div className="headPic">
                            <img src={rowData.discussUser.avatar} alt=""/>
                        </div>
                        <div className="courseList">
                            <div className="userName">{this.state.detail.userInfo.userName}</div>
                            <span className="tag-course tag-course-blue">语文</span>
                        </div>
                        <div className="createTime">{this.timeDifference(rowData.createTime)}</div>
                    </div>
                    <div className="list_content content_detail-comment">{rowData.discussContent}</div>
                </div>
                </div>
            }
            return dom
        };
        return (
            <div id="themeTaskDetail" style={{height: document.body.clientHeight}}>
                <div id="articleList">
                {/*主题计划*/}
                <div style={
                    this.state.detail.type == 1 ? {display: 'block'} : {display: 'none'}
                }>
                    <ListView
                        ref={el => this.lv = el}
                        dataSource={this.state.dataSource}    //数据类型是 ListViewDataSource
                        renderSectionHeader={sectionData => (
                            <div className="list_item" style={{marginTop:'0'}}>
                                <div className="circleList">
                                <div className="list_head">
                                    <div className="headPic"><img src={this.state.detail.userInfo.avatar} alt=""/></div>
                                    <div className="courseList">
                                        <div className="userName">{this.state.detail.userInfo.userName}</div>
                                        <span className="tag-course tag-course-blue">语文</span>
                                    </div>
                                    <div className="time"></div>
                                </div>
                                <div className="content_detail">{this.state.detail.content}</div>
                                <div className="image_detail">
                                    {this.state.detail.friendsAttachments.map((value, index) => {
                                        if (value.type == 0) {
                                            return <img src={value.path} alt=""  style={{width: '200', height: '113'}} />
                                        } else {
                                            return <div className="video_tag">
                                                <video style={{width: '100%', height: '100%'}} src={value.path} alt=""/>
                                                <div className="video_tag_play"></div>
                                            </div>
                                        }
                                    })}
                                </div>
                                <div className="asOfDate">
                                    截止时间:{WebServiceUtil.formatAllTime(this.state.detail.endTime)}</div>
                                <div className="detail_bottom">
                                    <div className="list_bottom_item"><i className="i-share"></i></div>
                                    <div className="list_bottom_item"><i className="i-praise"></i><span>8</span></div>
                                </div>
                            </div>
                                <div className="commit_title">
                                    <div className="insetPeople">
                                        <div>参与的人</div>
                                        <div className="lookAll" onClick={this.lookAll.bind(this)}>查看全部<i></i></div>
                                    </div>
                                    <div className="people_image_list">
                                        <img
                                            src="http://img.zcool.cn/community/0117e2571b8b246ac72538120dd8a4.jpg@1280w_1l_2o_100sh.jpg"
                                            alt=""/>
                                        <img
                                            src="http://img.zcool.cn/community/0117e2571b8b246ac72538120dd8a4.jpg@1280w_1l_2o_100sh.jpg"
                                            alt=""/>
                                        <img
                                            src="http://img.zcool.cn/community/0117e2571b8b246ac72538120dd8a4.jpg@1280w_1l_2o_100sh.jpg"
                                            alt=""/>
                                        <img
                                            src="http://img.zcool.cn/community/0117e2571b8b246ac72538120dd8a4.jpg@1280w_1l_2o_100sh.jpg"
                                            alt=""/>
                                        <img
                                            src="http://img.zcool.cn/community/0117e2571b8b246ac72538120dd8a4.jpg@1280w_1l_2o_100sh.jpg"
                                            alt=""/>
                                        <img
                                            src="http://img.zcool.cn/community/0117e2571b8b246ac72538120dd8a4.jpg@1280w_1l_2o_100sh.jpg"
                                            alt=""/>
                                        <img
                                            src="http://img.zcool.cn/community/0117e2571b8b246ac72538120dd8a4.jpg@1280w_1l_2o_100sh.jpg"
                                            alt=""/>
                                    </div>
                                </div>
                                <div className="commit_title commit_title-comment">全部评论({this.state.commit_count})</div>
                            </div>
                        )}
                        renderFooter={this.state.isLoadingHidden ? '' : () => (
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
                            height: document.body.clientHeight,
                        }}
                    />
                </div>

                {/*错题本*/}
                <div style={
                    this.state.detail.type == 0 ? {display: 'block'} : {display: 'none'}
                }>
                    <ListView
                        ref={el => this.lv = el}
                        dataSource={this.state.dataSource}    //数据类型是 ListViewDataSource
                        renderSectionHeader={sectionData => (
                            <div className="list_item" style={{marginTop:'0'}}>
                            <div className="circleList">
                                <div className="list_head">
                                    <div className="headPic"><img src={this.state.detail.userInfo.avatar} alt=""/></div>
                                    <div className="courseList">
                                        <div className="userName">{this.state.detail.userInfo.userName}</div>
                                        <span className="tag-course tag-course-blue">语文</span>
                                    </div>
                                    <div className="time"></div>

                                </div>
                                <div className="content_detail">{this.state.detail.content}</div>
                                <div className="image_detail">
                                    <div>
                                        <span>题干</span>
                                        <div>
                                            {this.state.detail.friendsAttachments.map((value, index) => {
                                                if (value.fatherType == 0) {
                                                    if (value.type == 0) {
                                                        return <img src={value.path} alt="" style={{width: '200px', height: '113px'}} />
                                                    } else {
                                                        return <div className="video_tag">
                                                            <video style={{width: '200px', height: '113px'}}
                                                                   src={value.path} alt=""/>
                                                            <div className="video_tag_play"></div>
                                                        </div>
                                                    }
                                                }

                                            })}
                                        </div>
                                    </div>
                                    <div>
                                        <span>正解</span>
                                        <div>
                                            {this.state.detail.friendsAttachments.map((value, index) => {
                                                if (value.fatherType == 1) {
                                                    if (value.type == 0) {
                                                        return <img src={value.path} alt=""  style={{width: '200', height: '113'}} />
                                                    } else {
                                                        return <div className="video_tag">
                                                            <video style={{width: '200', height: '113'}}
                                                                   src={value.path} alt=""/>
                                                            <div className="video_tag_play"></div>
                                                        </div>
                                                    }
                                                }

                                            })}
                                        </div>
                                    </div>
                                </div>
                                <div className="asOfDate">
                                    截止时间:{WebServiceUtil.formatAllTime(this.state.detail.endTime)}</div>
                                <div className="detail_bottom">
                                    <div className="list_bottom_item"><i className="i-share"></i></div>
                                    <div className="list_bottom_item"><i className="i-praise"></i><span>8</span></div>
                                </div>
                            </div>
                                <div className="commit_title">全部评论({this.state.commit_count})</div>
                            </div>
                        )}
                        renderFooter={this.state.isLoadingHidden ? '' : () => (
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
                            height: document.body.clientHeight,
                        }}
                    />
                </div>
                <div className="input_box">
                    <img
                        className="commit_line"
                        src={require('../images/commit_line.png')}
                        alt=""
                        onClick={this.setCommit}
                    />
                </div>
                <div className="commit_box" style={
                    this.state.commitFlag?{display:'block'}:{display:'none'}
                }>
                    <div>
                        <div className="import">
                            <input type="text" id="commit" placeholder="请输入评论内容"/>
                            <div id="appendImage">
                                {this.state.domImage}
                            </div>
                        </div>
                        <div className="send">
                            <div onClick={this.selectedImage}>
                                <img className="AddImage" src={require('../images/AddImage.png')} alt=""/>
                            </div>
                            <span className="btn-blue" onClick={this.sendCommit}>发送</span>
                        </div>
                    </div>
                </div>
                <div className="mask" style={
                    this.state.commitFlag?{display:'block'}:{display:'none'}
                } onClick={this.closeCommitBox}></div>
            </div>
            </div>
        );
    }

}