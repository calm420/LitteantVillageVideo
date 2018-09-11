import React from 'react';
import {
    Toast, DatePicker, ListView, Button, List, Checkbox, Radio, Tag, Tabs
} from 'antd-mobile';
import '../css/themeTask.less';

var dataSource = new ListView.DataSource({
    rowHasChanged: (row1, row2) => row1 !== row2,
});
const CheckboxItem = Checkbox.CheckboxItem;
const RadioItem = Radio.RadioItem;
var that;
var videoList = [];
export default class articleList extends React.Component {

    constructor(props) {
        super(props);
        that = this;
        this.initDataSource = [];
        this.state = {
            dataSource: dataSource.cloneWithRows(this.initDataSource),
            defaultPageNo: 1,
            clientHeight: document.body.clientHeight,
            radioValue: 0,
            peopleList: [],
            selectedFlag: false,
            //图片数组
            imageList: [],
            //视频数组
            videoList: [],
            peopleFlag:true
        }
    }

    componentDidMount() {
        document.title = '发布主题';
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var uid = locationSearch.split("&")[0].split("=")[1];
        // var people = locationSearch.split("&")[1].split("=")[1];
        this.setState({
            userId: uid
        }, () => {
            this.getUserFans();
        })


        $(document).on('click', '.upload_box_video', function () {
            that.playVideo($(this).attr('videoPath'));
        })
        $(document).on('click', '.showImage', function () {
            that.showImage($(this).attr('src'));
        })
        //点击上传图片区域的删除  ++ 点击删除视频
        $('#image_box').on('click', '.deleteImage_upload', function () {
            console.log($(this).next().attr('src'), 'deleteThis');
            var imageList = that.state.imageList;
            var videoList = that.state.videoList;
            if (imageList.indexOf($(this).next().attr('src')) != -1) {
                imageList.splice(imageList.indexOf($(this).next().attr('src')), 1);
            }
            if (videoList.indexOf($(this).next().attr('src')) != -1) {
                videoList.splice(videoList.indexOf($(this).next().attr('src')), 1);
            }
            console.log(imageList, 'imageList');
            console.log(videoList, 'videoList');
            $(this).parent().remove();
        })
    }

    //客户端打开预览图片
    showImage(url) {
        // console.log(that.state.imageList);
        // console.log(url);
        var data = {
            method: 'showPhoto',
            photos: that.state.imageList.join(','),
            currentPhoto: url
        };
        window.parent.Bridge.callHandler(data, null, function (error) {
            Toast.info('打开图片失败!', 1);
        });
    }

    //調用全屏視頻播放
    playVideo(url) {
        console.log(url);
        var data = {
            method: 'playChatVideo',
            playUrl: url
        };
        window.parent.Bridge.callHandler(data, function () {
        }, function (error) {
            Toast.info('開啓視頻失敗!');
        });
    }

    /**
     * 根据用户ｉｄ获取粉丝列表
     * **/
    getUserFans() {
        var param = {
            "method": 'getUserFans',
            "userId": this.state.userId,
            "targetType": 0,
            "pageNo": this.state.defaultPageNo,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                console.log(result, '粉丝列表')

                if (result.success) {
                    this.initDataSource = this.initDataSource.concat(result.response);
                    this.setState({
                        dataSource: dataSource.cloneWithRows(this.initDataSource),
                        isLoading: true,
                    })
                    if (this.initDataSource.length >= result.pager.rsCount) {
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

    onChangeCheck = (val) => {
        console.log(val,'vallllll');
        var list = this.state.peopleList;

        if (list.indexOf(val) == -1) {
            list.push(val);
        } else {
            list.splice(list.indexOf(val), 1);
        }
        console.log(list, '完成后');
        this.setState({
            peopleList: list,
        })
    }


    closeWindow(){
        var data = {
            method: 'finishForRefresh',
        };
        Bridge.callHandler(data, null, function (error) {
            console.log(error);
        });
    }

    onChangeRadio = (value) => {
        console.log(value)
        if(value == 0){
            that.setState({
                peopleFlag:true,
            })
        }else{
            that.setState({
                peopleFlag:false,
            })
        }
        that.setState({
            radioValue: value
        })
    }

    /**
     *  ListView数据全部渲染完毕的回调
     */
    onEndReached = (event) => {
        var currentPageNo = this.state.defaultPageNo;
        if (!this.state.isLoading && !this.state.hasMore) {
            return;
        }
        currentPageNo += 1;
        this.setState({
            isLoading: true,
            defaultPageNo: currentPageNo,
        }, () => {
            this.getUserFans();
        });
    };

    /**
     * 按查询条件获取列表
     * **/
    releaseTheme = () => {
        var warn = '';
        // WebServiceUtil.isEmpty($('.input_title').val())
        if (false) {
            warn = '标题不能为空';
        } else if (WebServiceUtil.isEmpty($('.textarea_content').val())) {
            warn = '主题内容不能为空';
        } else if (WebServiceUtil.isEmpty(this.state.date)) {
            warn = '截止日期不能为空';
        }
        if (warn != '') {
            Toast.fail(warn, 1);
            return;
        }
        console.log($('.input_title').val(), '标题');
        console.log($('.textarea_content').val(), '内容');
        console.log(WebServiceUtil.formatYMD(this.state.date.getTime()), '日期')
        console.log(this.state.imageList, '图片列表');
        console.log(this.state.videoList, '视频列表');
        console.log(this.state.peopleList, '谁可以看列表');
        var imageList = this.state.imageList;
        var videoList = this.state.videoList;
        var friendsAttachments = [];
        for (var k in imageList) {
            friendsAttachments.push(
                {
                    type: 0,
                    fatherType: 2,
                    path: imageList[k]
                }
            )
        }
        for (var k in videoList) {
            friendsAttachments.push(
                {
                    type: 1,
                    fatherType: 2,
                    path: videoList[k].url,
                    coverPath: videoList[k].coverPath
                }
            )
        }
        var circleOfFriendsJson = {
            title: $('.input_title').val(),
            content: $('.textarea_content').val(),
            endTime: this.state.date.getTime(),
            uid: this.state.userId,
            type: 1,
            viewType: this.state.peopleList.length>0?1:0, //0全部可见 1 部分可见
            Whitelist: this.state.peopleList,
            friendsAttachments: friendsAttachments
        };
        var param = {
            "method": 'saveThemeChallenge',
            "circleOfFriendsJson": JSON.stringify(circleOfFriendsJson),
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                console.log(result, '发布结果')
                if (result.success) {
                    Toast.success('發布成功');
                    this.closeWindow();
                }

            },
            onError: function (error) {
                Toast.fail(error, 1);
            }
        });
    }

    selectFile = () => {
        var noom = '';
        // var phoneType = navigator.userAgent;
        // if (phoneType.indexOf('Android') > -1) {
            //Android系统,
            var data = {
                method: 'selectedImage',
            };
            window.parent.Bridge.callHandler(data, function (res) {
                var newArr = res.split("?");
                var url = newArr[0];
                var type = newArr[1].split("=")[1];
                if(noom=='') {
                    if (type == 1) {
                        var imageDiv = $("<img class='upload_box_image showImage' />").attr('src', url);
                        var imageBox = $("<span class='image_box_upload upload_box_image'><i class='deleteImage_upload'></i></span>");
                        $(imageBox).append(imageDiv);
                        $('#image_box').append(imageBox);
                        var imageList = that.state.imageList;
                        imageList.push(url);
                        that.setState({
                            imageList: imageList
                        })
                    } else {
                        var firstImage = newArr[2].split("=")[1];
                        var videoDiv = $("<img class='upload_box_video' />").attr({'src':firstImage,'videoPath':url});
                        //image ---> uploadBox
                        var imageBox = $("<span class='image_box_upload'><i class='deleteImage_upload'></i></span>");
                        $(imageBox).append(videoDiv);
                        $('#image_box').append(imageBox);
                        var videoList = that.state.videoList;
                        videoList.push({url:url,coverPath:firstImage});
                        that.setState({
                            videoList: videoList
                        })
                    }
                    noom = res;
                } else if(noom==res) {
                    return;
                }

            }, function (error) {
                console.log(error);
                Toast.info('客戶端方法報錯');
                that.upload_file();
                that.upload_file();
            });
        // } else {
        //     var data = {
        //         method: 'selectedImage',
        //     };
        //     window.parent.Bridge.callHandler(data, function (res) {
        //         var newArr = res.split("?");
        //         var url=newArr[0];
        //         var type = newArr[1].split("=")[1];
        //         // Toast.info(url);
        //         if(noom=='') {
        //             if (type == 1) {
        //                 var imageDiv = $("<img class='upload_box_image showImage' />").attr('src', url);
        //                 var imageBox = $("<span class='image_box_upload upload_box_image'><i class='deleteImage_upload'></i></span>");
        //                 $(imageBox).append(imageDiv);
        //                 $('#image_box').append(imageBox);
        //                 var imageList = that.state.imageList;
        //                 imageList.push(url);
        //                 that.setState({
        //                     imageList: imageList
        //                 })
        //             } else {
        //                 var firstImage = newArr[2].split("=")[1];
        //                 var videoDiv = $("<img class='upload_box_video' />").attr({'src':firstImage,'videoPath':url});
        //                 //image ---> uploadBox
        //                 var imageBox = $("<span class='image_box_upload'><i class='deleteImage_upload'></i></span>");
        //                 $(imageBox).append(videoDiv);
        //                 $('#image_box').append(imageBox);
        //                 var videoList = that.state.videoList;
        //                 videoList.push({url:url,coverPath:firstImage});
        //                 that.setState({
        //                     videoList: videoList
        //                 })
        //             }
        //             noom = res;
        //         } else if(noom==res) {
        //             return;
        //         }
        //
        //     }, function (error) {
        //         console.log(error);
        //         that.upload_file();
        //         that.upload_file();
        //
        //     });
        // }

    }

    //原生ｊｓ上传
    upload_file = () => {
        $("#upload").click();
        //取消加绑定change事件解决change事件无法控制
        $("#upload").off("change");
        $("#upload").change(function () {
            if (this.files[0]) {
                var formData = new FormData();
                formData.append("file" + 0, this.files[0]);
                formData.append("name" + 0, this.files[0].name);
                $.ajax({
                    type: "POST",
                    url: "https://jiaoxue.maaee.com:8890/Excoord_Upload_Server/file/upload",
                    enctype: 'multipart/form-data',
                    data: formData,
                    // 告诉jQuery不要去处理发送的数据
                    processData: false,
                    // 告诉jQuery不要去设置Content-Type请求头
                    contentType: false,
                    xhr: function () {        //这是关键  获取原生的xhr对象  做以前做的所有事情
                        var xhr = jQuery.ajaxSettings.xhr();
                        xhr.upload.onload = function () {
                            // console.log('上传完成隐藏进度条');
                            $('.progressText').text('上传完成')
                            // setTimeout(function(){
                            $('#progress')[0].style.display = 'none';
                            $('.progress-bar')[0].style.width = '0%';
                            $('.progressText').text('进度: 0%');
                            // },500);
                            console.log('上传完成')
                        };
                        xhr.upload.onprogress = function (ev) {
                            // $('#progress')[0].style.display = 'block';
                            if ($('#progress').css('display') == 'none') {
                                $('#progress').css({display: 'block'})
                            } else {
                                //显示进度条
                                $('.progress-bar')[0].style.width = ((ev.loaded / ev.total) * 100).toFixed(0) + '%';
                                $('.progressText').text('进度: ' + ((ev.loaded / ev.total) * 100).toFixed(0) + '%')
                            }
                        };
                        return xhr;
                    },
                    success: function (res) {
                        //返回在线图片地址
                        var type = res.substring(res.length - 3, res.length);
                        if (type == 'jpg' || type == 'png' || type == 'gif' || type == 'peg' || type == 'JPG' || type == 'PNG' || type == 'PEG' || type == 'GIF') {
                            var imageDiv = $("<img class='upload_box_image showImage' />").attr('src', res);
                            var imageBox = $("<span class='image_box_upload'><i class='deleteImage_upload'></i></span>");
                            $(imageBox).append(imageDiv);
                            $('#image_box').append(imageBox);
                            var imageList = that.state.imageList;
                            imageList.push(res);
                            that.setState({
                                imageList: imageList
                            })
                        } else {//认为是视频
                            console.log('回调完成')
                            var videoDiv = $("<video class='upload_box_video' />").attr('src', res);
                            var imageBox = $("<span class='image_box_upload'><i class='deleteImage_upload'></i></span>");
                            $(imageBox).append(videoDiv);
                            $('#image_box').append(imageBox);
                            var videoList = that.state.videoList;
                            videoList.push({url:res,coverPath: "http://img.zcool.cn/community/0117e2571b8b246ac72538120dd8a4.jpg@1280w_1l_2o_100sh.jpg"});
                            that.setState({
                                videoList: videoList
                            })
                            console.log('渲染完成')
                            // that.upload_video_pic(res, videoDiv);

                        }
                    }
                });
            }
        })
    }

    toSetPeople = () => {
        document.title = '谁可以看';
        this.setState({
            selectedFlag: true,
        })
    }

    selectedComplete = () => {
        document.title = '发布主题';
        this.setState({
            selectedFlag: false,
        })
    }

    render() {
        const data = [
            {value: 0, label: '全部可见'},
            {value: 1, label: '部分可见'},
        ];
        const {radioValue} = this.state;
        const row = (rowData, sectionID, rowID) => {
            console.log(rowData);
            return (
                <CheckboxItem key={rowData.fansUser.uid} onChange={() => this.onChangeCheck(rowData.fansUser.uid)}>
                    {rowData.fansUser.userName}
                </CheckboxItem>
            )
        };
        return (
            <div id="themeTask" style={{height: document.body.clientHeight}}>
                <div className="themeTask-box">
                    {/*<div className="themeTitle line_public">*/}
                        {/*<input type="text" className="input_title textarea_form_control" placeholder="主题标题"/>*/}
                    {/*</div>*/}
                    <div className="themeTitle themeContent">
                        <textarea className="textarea_content textarea_form_controlH" name="" id="" cols="30" rows="10"
                                  placeholder="请输入主题任务内容"></textarea>
                    </div>
                    <div>
                        <input id='upload' type="file"/>
                    </div>
                    <div className="addPic-box">
                        <div id="image_box"></div>
                        <div className="addPic-wrap addPic-content">
                            <img onClick={this.selectFile} className="addPic" src={require("../images/add-pic.png")}
                                 alt=""/>
                        </div>
                    </div>
                    <div>
                        <div id="progress">
                            <div className="progress">
                                <div className="progress-bar"></div>
                            </div>
                            <div className="progressText">进度: 0%</div>
                        </div>
                    </div>
                    <div className="line_public top-10">
                        <DatePicker
                            // mode="date"
                            title=""
                            extra="" //默认值
                            value={this.state.date}
                            onChange={date => this.setState({date})}
                        >
                            <List.Item arrow="horizontal"><i className="i-icon i_AsDate"></i>截止日期</List.Item>
                        </DatePicker>
                    </div>
                    <div className='toSetPeople am-list-item' onClick={this.toSetPeople}>
                        <div className="am-list-line"><i
                            className="i-icon i_WhoSee"></i>谁可以看<span>{this.state.peopleFlag?'全部':this.state.peopleList.length > 0 ? '已选' + this.state.peopleList.length + '人' : '全部'}</span>
                            <div className="am-list-arrow am-list-arrow-horizontal" aria-hidden="true"></div>
                        </div>
                    </div>
                </div>
                <div className="bottom_nav">
                    <Button onClick={this.releaseTheme} className="button_btn submit_button">发布</Button>
                </div>


                <div className='selectedPeople' style={
                    this.state.selectedFlag ? {left: '0%'} : {left: '100%'}
                }>
                    <div className="selectedPeople-cont">
                        <List className="selectedPeople_border">
                            {data.map(i => (
                                <RadioItem key={i.value} checked={radioValue === i.value}
                                           onChange={() => this.onChangeRadio(i.value)}>
                                    {i.label}
                                </RadioItem>
                            ))}
                        </List>
                    <ListView
                        ref={el => this.lv = el}
                        dataSource={this.state.dataSource}    //数据类型是 ListViewDataSource
                        renderFooter={() => (
                            <div style={{paddingTop: 5, paddingBottom: 46, textAlign: 'center'}}>
                                {this.state.isLoading ? '正在加载...' : '已经全部加载完毕'}
                            </div>)}
                        renderRow={row}   //需要的参数包括一行数据等,会返回一个可渲染的组件为这行数据渲染  返回renderable
                        className="am-list"
                        pageSize={30}    //每次事件循环（每帧）渲染的行数
                        //useBodyScroll  //使用 html 的 body 作为滚动容器   bool类型   不应这么写  否则无法下拉刷新
                        scrollRenderAheadDistance={200}   //当一个行接近屏幕范围多少像素之内的时候，就开始渲染这一行
                        onEndReached={this.onEndReached}  //当所有的数据都已经渲染过，并且列表被滚动到距离最底部不足onEndReachedThreshold个像素的距离时调用+39*
                        onEndReachedThreshold={10}  //调用onEndReached之前的临界值，单位是像素  number类型
                        initialListSize={30}   //指定在组件刚挂载的时候渲染多少行数据，用这个属性来确保首屏显示合适数量的数据
                        scrollEventThrottle={20}     //控制在滚动过程中，scroll事件被调用的频率
                        style={
                            this.state.radioValue ? {display: 'block', height: this.state.clientHeight} : {
                                display: 'none',
                                height: this.state.clientHeight
                            }
                        }
                    />
                    </div>
                    <div className="bottom_nav">
                        <Button onClick={this.selectedComplete} className="button_btn submit_button">完成</Button>
                    </div>
                </div>
            </div>
        );
    }

}