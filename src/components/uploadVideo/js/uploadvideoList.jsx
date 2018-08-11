import React from 'react';
import { ListView, WingBlank, WhiteSpace, Card, Modal, Toast, InputItem } from 'antd-mobile';
// import '../css/uploadvideoList.less'

var musicList;
const alert = Modal.alert;

export default class uploadvideoList extends React.Component {
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
            editData: {}
        };
    }

    componentDidMount() {
        document.title = '视频列表'
        Bridge.setShareAble("false");
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        console.log(locationSearch)
        var uid = locationSearch.split("&")[0].split("=")[1];
        // var pwd = locationSearch.split("&")[0].split("=")[1];
        // var uid = locationSearch.split("&")[1].split("=")[1];
        this.setState({ "uid": uid});
        // this.LittleAntLogin(uid,pwd)
        this.getLittleVideoInfoListByUserId(uid)
    }

    /**
     * 转换用户
     */
    LittleAntLogin(uid,pwd){
        var param = {
            "method": 'LittleAntLogin',
            "colAccount": uid,
            "colPasswd": pwd
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                console.log(result, "calm");
                if (result.msg == '调用成功' && result.success == true) {
                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });
    }

    /**
     * 获取视频列表
     */
    getLittleVideoInfoListByUserId(uid) {
        var _this = this;
        const dataBlob = {};
        var param = {
            "method": 'getLittleVideoInfoListByUserId',
            "userId": 8,
            "pageNo": -1,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                console.log(result, "calm");
                if (result.msg == '调用成功' && result.success == true) {
                    var arr = result.response;
                    // var pager = result.pager;
                    // for (let i = 0; i < arr.length; i++) {
                    //     var topic = arr[i];
                    //     dataBlob[`${i}`] = topic;
                    // }
                    // var isLoading = false;
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
                        // isLoadingLeft: isLoading,
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
     * 批量添加视频
     * 跳转到添加页面
     */
    addRing() {
        var url = WebServiceUtil.mobileServiceURL + "addUploadVideo?ident=" + musicList.state.uid;
        var data = {
            method: 'openNewPage',
            url: url
        };
        Bridge.callHandler(data, null, function (error) {
            window.location.href = url;
        });
    }

    /**
     * 显示删除model
     * @param id
     */
    showDelAlert(id) {
        var phoneType = navigator.userAgent;
        var phone;
        if (phoneType.indexOf('iPhone') > -1 || phoneType.indexOf('iPad') > -1) {
            phone = 'ios'
        } else {
            phone = 'android'
        }
        var _this = this;
        const alertInstance = alert('您确定移除吗?', '', [
            { text: '取消', onPress: () => console.log('cancel'), style: 'default' },
            { text: '确定', onPress: () => _this.deleteVideoMusic(id) },

        ], phone);
    }

    /**
     * 删除视频信息
     */
    deleteVideoMusic(id) {
        var _this = this;

        var param = {
            "method": 'deleteVideoMusic',
            "videoMusicId": id,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' && result.success == true) {
                    Toast.success('删除成功', 1)
                    //删除本地数据
                    musicList.state.dataSource = [];
                    musicList.state.dataSource = new ListView.DataSource({
                        rowHasChanged: (row1, row2) => row1 !== row2,
                    });
                    musicList.initData.forEach(function (v, i) {
                        if (id == v.musicId) {
                            musicList.initData.splice(i, 1);
                        }
                    });
                    musicList.setState({
                        dataSource: musicList.state.dataSource.cloneWithRows(_this.initData)
                    });
                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });
    }

    /**
     * 编辑视频信息
     */
    editVideo(id) {
        var url = WebServiceUtil.mobileServiceURL + "updateVideo?ident=" + musicList.state.uid+"&id="+id;
        var data = {
            method: 'openNewPage',
            url: url
        };
        Bridge.callHandler(data, null, function (error) {
            window.location.href = url;
        });
    }

    /**
     * 音乐上传
     */
    // uploadMp3(event) {
    //     event.stopPropagation()
    //     var data = {
    //         method: 'selectMp3',
    //     };
    //     Bridge.callHandler(data, function (res) {
    //         // 拿到照片地址,显示在页面等待上传
    //         let newArr = {};
    //         let item = res.split("?");
    //         newArr.picPath = item[0],
    //             newArr.picName = item[1].split("=")[1]

    //         musicList.state.editData.musicUrl = newArr.picPath

    //         musicList.editModelShow(false)

    //     }, function (error) {
    //         console.log(error);
    //     });
    // }

    /**
     * 封面上传
     */
    // uploadImage(event) {
    //     event.stopPropagation()
    //     var data = {
    //         method: 'selectImages',
    //     };
    //     Bridge.callHandler(data, function (res) {
    //         // 拿到照片地址,显示在页面等待上传
    //         let newArr = {};
    //         let item = res.split("?");
    //         newArr.picPath = item[0],
    //             newArr.picName = item[1].split("=")[1]
    //         musicList.state.editData.cover = newArr.picPath
    //         musicList.editModelShow(false)

    //     }, function (error) {
    //         console.log(error);
    //     });
    // }

    /**
     * 封面预览
     */
    // imgPreview(src) {
    //     var dataObj = {};
    //     dataObj.method = 'showImage';
    //     dataObj.url = src;
    //     dataObj.currentUrl = src;
    //     Bridge.callHandler(dataObj, null, function (error) {
    //         console.log(error);
    //     })
    // }

    /**
     * mp3预览
     */
    // mp3Preview(src) {

    //     var data = {
    //         method: 'playAudio',
    //         url: src
    //     };
    //     Bridge.callHandler(data, null, function (error) {

    //     });
    // }

    /**
     * 输入框改变的回调
     * @param type  musicName=歌名  musicMan=歌手
     * @param index
     * @param value
     */
    inputOnChange = (type, value) => {
        var data = this.state.editData
        if (type == 'musicName') {
            data.musicName = value
        } else if (type == 'musicMan') {
            data.musicMan = value
        }
        musicList.editModelShow(false)
    }

    // editModelShow(falg) {
    //     var data = this.state.editData

    //     if (falg) {
    //         $('.updateModel').slideDown()
    //         $('.tagAddPanel_bg').show()
    //     }

    //     var editDiv = <div className="listCont">
    //         <div>
    //             <InputItem
    //                 className="add_element"
    //                 placeholder="请输入歌曲名称"
    //                 value={data.musicName}
    //                 onChange={musicList.inputOnChange.bind(this, 'musicName')}
    //             >
    //                 <div>歌曲名称</div>
    //             </InputItem>
    //         </div>
    //         <div className="line_public flex_container"></div>
    //         <div>
    //             <InputItem
    //                 className="add_element"
    //                 placeholder="请输入歌手名称"
    //                 value={data.musicMan}
    //                 onChange={musicList.inputOnChange.bind(this, 'musicMan')}
    //             >
    //                 <div>歌手名称</div>
    //             </InputItem>
    //         </div>
    //         <div className="line_public flex_container"></div>
    //         <div className="my_flex sameBack">
    //                 <span className="textTitle">上传封面
    //                     <p style={{margin: 0, height: 5}}></p>
    //                     <span className="uploadSupport">(jpg格式)</span>
    //                 </span>
    //             <div className="upload_file">
    //                 <img onClick={musicList.imgPreview.bind(this, data.cover)}
    //                      className="imgTag" src={data.cover}/>
    //                 <div className="icon_pointer" onClick={musicList.uploadImage.bind(this,)}>修改</div>
    //             </div>

    //         </div>
    //         <div className="line_public flex_container"></div>
    //         <div className="my_flex sameBack">
    //                 <span className="textTitle">上传音乐
    //                     <p style={{margin: 0, height: 5}}></p>
    //                     <span className="uploadSupport">(MP3格式)</span>
    //                 </span>
    //             <div className="upload_file">
    //                 <div onClick={musicList.mp3Preview.bind(this, data.musicUrl)}
    //                      className="musicIcon"/>
    //                 <div className="icon_pointer" onClick={musicList.uploadMp3.bind(this,)}>修改</div>
    //             </div>
    //         </div>
    //     </div>

    //     this.setState({editDiv})
    // }

    // exitAddTags() {
    //     $('.updateModel').slideUp()
    //     $('.tagAddPanel_bg').hide()
    // }

    // addTagsForSure() {
    //     var data = musicList.state.editData

    //     var param = {
    //         "method": 'updateVideoMusic',
    //         "videoMusicId": data.musicId,
    //         "videoMusicDatas": JSON.stringify(data)
    //     };

    //     WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
    //         onResponse: function (result) {
    //             if (result.msg == '调用成功' && result.success == true) {
    //                 Toast.success('修改成功', 1)
    //                 $('.updateModel').slideUp()
    //                 $('.tagAddPanel_bg').hide()
    //                 //更改本地数据

    //                 musicList.state.dataSource = [];
    //                 musicList.state.dataSource = new ListView.DataSource({
    //                     rowHasChanged: (row1, row2) => row1 !== row2,
    //                 });
    //                 musicList.initData.forEach(function (item, index) {
    //                     if (data.musicId == item.musicId) {
    //                         // item = data   对象的拷贝
    //                         musicList.initData.splice(index, 1, data);
    //                     }
    //                 });
    //                 musicList.setState({
    //                     dataSource: musicList.state.dataSource.cloneWithRows(musicList.initData)
    //                 });
    //             }
    //         },
    //         onError: function (error) {
    //             // message.error(error);
    //         }
    //     });
    // }

    render() {
        console.log("render")
        var _this = this
        const row = (rowData, sectionID, rowID) => {
            console.log(rowData, "rowData")
            return (
                <div className="my_flex item line_public">
                    <span>{rowData.videoContent}</span>
                    {
                        rowData.videoType == 0 ?
                            <span>普通视频</span>
                            :
                            rowData.videoType == 1 ?
                                <span>挑战视频</span> :
                                rowData.videoType == 2 ?
                                    <span>广告视频</span>
                                    :
                                    ""
                    }
                    {
                        rowData.tags ? rowData.tags.map((v, i) => {
                            console.log(v, "v")
                            return (
                                <div>
                                    {
                                        rowData.videoType == 1 && v.tagType == 2 ?
                                            <div>
                                                {v.tagTitle}
                                            </div>
                                            :
                                            rowData.videoType == 0 && v.tagType == 1 ?
                                                <div>
                                                    {v.tagTitle}
                                                </div>
                                                :
                                                ""
                                    }
                                </div>
                            )
                        })
                            :
                            ""
                    }
                    <span>上传时间:{WebServiceUtil.formatYMD(rowData.createTime)}</span>
                    <div className="icon">
                        <span className="modifyBtn_common"
                            onClick={this.editVideo.bind(this, rowData.vid)}></span>
                        <span className="deleteBtn_common"
                            onClick={this.showDelAlert.bind(this, rowData.vid)}></span>
                    </div>

                </div>

            )
        };

        return (
            <div id="uploadvideoList" style={{ height: musicList.state.clientHeight }}>
                <div className='tableDiv' style={{ height: musicList.state.clientHeight }}>
                    {/*这是列表数据,包括添加按钮*/}
                    <ListView
                        ref={el => this.lv = el}
                        dataSource={this.state.dataSource}    //数据类型是 ListViewDataSource
                        renderFooter={() => (
                            <div style={{ paddingTop: 5, paddingBottom: 0, textAlign: 'center' }}>
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
                        <img src={require("../imgs/addBtn.png")} />
                    </div>
                </div>
                {/* <div className='updateModel' style={{ display: 'none' }}>
                    <div>
                        {this.state.editDiv}
                    </div>
                    <div className="bottomBox">
                        <span className="close" onClick={this.exitAddTags}>取消</span>
                        <span className="bind" onClick={this.addTagsForSure}>确定</span>
                    </div>
                </div> */}

                <div className="tagAddPanel_bg"></div>
            </div>
        );
    }
}
