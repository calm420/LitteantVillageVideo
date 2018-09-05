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
var videoList=[];
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
            peopleList:[],
            selectedFlag:false,
            //图片数组
            imageList:[],
            //视频数组
            videoList:[],
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
        },()=>{
            this.getUserFans();
        })



        //点击上传图片区域的删除  ++ 点击删除视频
        $('#image_box').on('click', '.deleteImage_upload', function () {
            console.log($(this).next().attr('src'),'deleteThis');
            var imageList = that.state.imageList;
            var videoList = that.state.videoList;
            if(imageList.indexOf($(this).next().attr('src')) != -1){
                imageList.splice(imageList.indexOf($(this).next().attr('src')),1);
            }
            if(videoList.indexOf($(this).next().attr('src')) != -1){
                videoList.splice(videoList.indexOf($(this).next().attr('src')),1);
            }
            console.log(imageList,'imageList');
            console.log(videoList,'videoList');
            $(this).parent().remove();
        })
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
                        refreshing: false,
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
        console.log(val);
        var list = this.state.peopleList;

        if(list.indexOf(val) == -1){
            list.push(val);
        }else{
            list.splice(list.indexOf(val),1);
        }
        console.log(list,'完成后');
        this.setState({
            peopleList:list,
        })
    }

    onChangeRadio = (value) => {
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
    releaseTheme = ()=> {
        var warn='';
        if(WebServiceUtil.isEmpty($('.input_title').val())){
            warn = '标题不能为空';
        }else if(WebServiceUtil.isEmpty($('.textarea_content').val())){
            warn = '主题内容不能为空';
        }else if(WebServiceUtil.isEmpty(this.state.date)){
            warn = '截止日期不能为空';
        }
        if(warn != ''){
            Toast.fail(warn,1);
            return;
        }
        console.log($('.input_title').val(),'标题');
        console.log($('.textarea_content').val(),'内容');
        console.log(WebServiceUtil.formatYMD(this.state.date.getTime()),'日期')
        console.log(this.state.imageList,'图片列表');
        console.log(this.state.videoList,'视频列表');
        console.log(this.state.peopleList,'谁可以看列表');
        var imageList = this.state.imageList;
        var videoList = this.state.videoList;
        var friendsAttachments = [];
        for(var k in imageList){
            friendsAttachments.push(
                {
                    type:0,
                    fatherType:2,
                    path:imageList[k]
                }
            )
        }
        for(var k in videoList){
            friendsAttachments.push(
                {
                    type:1,
                    fatherType:2,
                    path:videoList[k]
                }
            )
        }
        var circleOfFriendsJson={
            title: $('.input_title').val(),
            content: $('.textarea_content').val(),
            endTime: this.state.date.getTime(),
            uid: this.state.userId,
            type:1,
            viewType:0, //0全部可见 1 部分可见
            friendsAttachments:friendsAttachments
        };
        var param = {
            "method": 'saveThemeChallenge',
            "circleOfFriendsJson": JSON.stringify(circleOfFriendsJson),
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                console.log(result,'发布结果')
                if (result.success) {

                }

            },
            onError: function (error) {
                Toast.fail(error, 1);
            }
        });
    }


    // upload_video_pic = (videoPath, videoDiv)=> {
    //     console.log(videoDiv, 'videoDiv');
    //     var video;//video标签
    //     var scale = 0.8;//第一帧图片与源视频的比例
    //     console.log(videoList.length,'videoList.length');
    //     //ｖｉｄｅｏ标签
    //     video = $(".upload_box_video")[videoList.length];//赋值标签
    //     video.setAttribute("crossOrigin", 'Anonymous');
    //     video.addEventListener("loadeddata", function () {//加载完成事件，调用函数
    //         var canvas = document.createElement('canvas');//canvas画布
    //         canvas.width = video.videoWidth * scale;
    //         canvas.height = video.videoHeight * scale;
    //         canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);//画图
    //         var image = canvas.toDataURL("image/png");
    //         var $Blob = that.getBlobBydataURI(image, 'image/jpeg');
    //         var formData = new FormData();
    //         formData.append("filePath", $Blob, "file_" + Date.parse(new Date()) + ".png");
    //         $.ajax({
    //             type: "POST",
    //             url: "https://jiaoxue.maaee.com:8890/Excoord_Upload_Server/file/upload",
    //             enctype: 'multipart/form-data',
    //             data: formData,
    //             // 告诉jQuery不要去处理发送的数据
    //             processData: false,
    //             // 告诉jQuery不要去设置Content-Type请求头
    //             contentType: false,
    //             success: function (res) {
    //                 // console.log(res, 'base64');
    //                 videoList.push({
    //                     cover: res,
    //                     videoPath: videoPath,
    //                     isCover: false,
    //                 })
    //                 videoDiv.attr('cover', res);
    //                 // console.log(videoList, 'videoList');
    //             }
    //         });
    //     })
    // }

    //首先需要 吧 base64 流转换成 blob 对象，文件对象都继承它
    getBlobBydataURI(dataURI, type) {
        var binary = atob(dataURI.split(',')[1]);
        var array = [];
        for (var i = 0; i < binary.length; i++) {
            array.push(binary.charCodeAt(i));
        }
        return new Blob([new Uint8Array(array)], {type: type});
    }

    selectFile = () => {
        var phoneType = navigator.userAgent;
        if (phoneType.indexOf('Android') > -1) {
            //Android系统,
            var data = {
                method: 'selFilesSuccess',
            };
            window.parent.Bridge.callHandler(data, function (res) {

                var type = res.substring(res.length - 1, res.length);
                console.log(type);
                if (type == 1) {
                    var imageDiv = $("<img class='upload_box_image' />").attr('src', res);
                    var imageBox = $("<span class='image_box_upload upload_box_image'><i class='deleteImage_upload'></i></span>");
                    $(imageBox).append(imageDiv);
                    $('#image_box').append(imageBox);
                    var imageList = that.state.imageList;
                    imageList.push(res);
                    that.setState({
                        imageList:imageList
                    })
                    //image ---> uploadBox
                    // var arr = document.getElementsByClassName('upload_box_image');
                    // if (arr.length != 0) {
                    //     var array = []
                    //     arr.forEach(function (v) {
                    //         array.push(v.currentSrc)
                    //     })
                    //     if (!array.includes(res)) {
                    //         $('#image_box').append(imageBox);
                    //     }
                    // } else {
                    //     $('#image_box').append(imageBox);
                    // }
                } else {//认为是视频
                    var videoDiv = $("<video class='upload_box_video' />").attr('src', res);
                    //image ---> uploadBox
                    var imageBox = $("<span class='image_box_upload'><i class='deleteImage_upload'></i></span>");
                    $(imageBox).append(videoDiv);

                    $('#image_box').append(imageBox);
                    var videoList = that.state.videoList;
                    videoList.push(res);
                    that.setState({
                        videoList:videoList
                    })
                    // that.upload_video_pic(res, videoDiv);
                }

            }, function (error) {
                console.log(error);
                this.upload_file();
            });
        } else {
            this.upload_file();
        }

    }


    //原生ｊｓ上传
    upload_file = ()=>{
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
                                $('#progress').css({display:'block'})
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
                            var imageDiv = $("<img class='upload_box_image' />").attr('src', res);
                            var imageBox = $("<span class='image_box_upload'><i class='deleteImage_upload'></i></span>");
                            $(imageBox).append(imageDiv);
                            $('#image_box').append(imageBox);
                            var imageList = that.state.imageList;
                            imageList.push(res);
                            that.setState({
                                imageList:imageList
                            })
                        } else {//认为是视频
                            console.log('回调完成')
                            var videoDiv = $("<video class='upload_box_video' />").attr('src', res);
                            var imageBox = $("<span class='image_box_upload'><i class='deleteImage_upload'></i></span>");
                            $(imageBox).append(videoDiv);
                            $('#image_box').append(imageBox);
                            var videoList = that.state.videoList;
                            videoList.push(res);
                            that.setState({
                                videoList:videoList
                            })
                            console.log('渲染完成')
                            // that.upload_video_pic(res, videoDiv);

                        }
                    }
                });
            }
        })
    }

    toSetPeople = ()=>{
        // let url = encodeURI(WebServiceUtil.mobileServiceURL + "selectedPeople?userId="+this.state.userId);
        // var data = {
        //     method: 'openNewPage',
        //     url: url
        // };
        // Bridge.callHandler(data, null, function (error) {
        //     window.location.href = url;
        // });
        document.title = '谁可以看';
        this.setState({
            selectedFlag: true,
        })
    }


    selectedComplete = ()=>{
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
            return (
                <CheckboxItem key={rowData.fansUser.uid} onChange={() => this.onChangeCheck(rowData.fansUser.uid)}>
                    {rowData.fansUser.userName}
                </CheckboxItem>
            )
        };
        return (
            <div id="themeTask" style={{height: document.body.clientHeight}}>
                <div className="themeTask-box">
                    <div className="themeTitle line_public">
                        <input type="text" className="input_title textarea_form_control" placeholder="主题标题"/>
                    </div>
                    <div className="themeTitle themeContent">
                        <textarea className="textarea_content textarea_form_controlH" name="" id="" cols="30" rows="10"
                                  placeholder="请输入主题任务内容"></textarea>
                    </div>
                    <div>
                        <input id='upload' type="file"/>
                    </div>
                    <div className="addPic-box">
                        <div id="image_box"></div>
                        <div onClick={this.selectFile} className="addPic-wrap addPic-content">
                            <img onClick={this.selectFile} className="addPic" src={require("../images/add-pic.png")} alt=""/>
                        </div>
                    </div>
                    <div>
                        <div id="progress" >
                            <div className="progress">
                                <div className="progress-bar"></div>
                            </div>
                            <div className="progressText">进度: 0%</div>
                        </div>
                    </div>
                    <div className="line_public top-10">
                        <DatePicker
                            mode="date"
                            title=""
                            extra="" //默认值
                            value={this.state.date}
                            onChange={date => this.setState({ date })}
                        >
                            <List.Item arrow="horizontal"><i className="i-icon i_AsDate"></i>截止日期</List.Item>
                        </DatePicker>
                    </div>
                    <div className='toSetPeople am-list-item' onClick={this.toSetPeople}>
                        <div className="am-list-line"><i className="i-icon i_WhoSee"></i>谁可以看<span>{this.state.peopleList.length>0?'已选'+this.state.peopleList.length+'人':'全部'}</span><div className="am-list-arrow am-list-arrow-horizontal" aria-hidden="true"></div></div>
                    </div>
                </div>
                <div className="bottom_nav">
                    <Button onClick={this.releaseTheme} className="button_btn submit_button">发布</Button>
                </div>





                <div className='selectedPeople' style={
                    this.state.selectedFlag?{left:'0%'}:{left:'100%'}
                }>
                    <Button onClick={this.selectedComplete}>完成</Button>

                    <List>
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
            </div>
        );
    }

}