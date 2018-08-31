import React from 'react';
import { Button, Toast, List, Icon, Modal, TextareaItem, Radio, InputItem, Tag } from 'antd-mobile';
import '../css/addUploadVideo.less'

const RadioItem = Radio.RadioItem;
var calm;
const typeDate = [
    { value: 0, label: '普通类型' },
    { value: 2, label: '广告视频' },
    { value: 1, label: '挑战视频' },
];

const alert = Modal.alert;


export default class addUploadVideo extends React.Component {
    constructor(props) {
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var uid = locationSearch.split("&")[0].split("=")[1];
        super(props);
        calm = this;
        this.state = {
            clientHeight: document.body.clientHeight,
            addVideoList: [{
                videoUrl: '',
                coverPath: '',
                videoContent: '',
                userId: uid,
                videoType: 0,
                isRecommend: 0,
                show: false,
                tagText: [],
                cheData: {},
                firstUrl: "",
                height: "",
                width: ""

            }],
            tagData: [],
            tagChangeData: [],
            searchValue: "",
            tagIndex: "",
            challengeData: [],
            cheData: {},
            challengeValue: "",
            challengeIndex: "",
            showTextOrList: true,
            chaContent: "",
            showDelete: false,
            isNewTag: 0   //0不是   1是

        };
    }

    componentDidMount() {
        document.title = '添加视频'
        Bridge.setShareAble("false");
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var uid = locationSearch.split("&")[0].split("=")[1];
        this.setState({ "uid": uid });
        this.buildAddList()

        // $('#upload_video').click(function () {
        //     $('#upload_video_').click();
        // });


    }
    /**
     * 获取视频路径
     */
    getVideo(i) {
        // console.log(i, "iiii")
        // console.log($('.progressText'), "$('.progressText')")
        console.log($('.upload_video_').eq(i),"hah")
        $('.upload_video_').eq(i).unbind("change");
        $('.upload_video_').eq(i).bind('change', function (evt) {
            // var newFile = getFileURL(document.getElementById('upload_video_').files[0])
            console.log($('.upload_video_').val(), "evt")
            console.log(evt.target.files[0],"evt")
            if (evt.target.files[0]) {
                var formData = new FormData();
                formData.append("file" + 0, evt.target.files[0]);
                formData.append("name" + 0, evt.target.files[0].name);
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
                            console.log('上传完成隐藏进度条');
                            $('.progressText').text('上传完成');
                            setTimeout(function () {
                                $('#progress')[0].style.display = 'none';
                                $('.progress-bar')[0].style.width = '0%';
                                $('.progressText').text('进度: 0%');
                            }, 500);
                        };
                        xhr.upload.onprogress = function (ev) {
                            console.log(ev)
                            console.log(ev.loaded, "ev")
                            console.log(ev.total, "ev")
                            if(ev.loaded == ev.total){
                                $('.progress-bar')[0].style.width = '100%';
                            }
                            if ($('#progress')[0].style.display == 'none') {
                                $('#progress')[0].style.display = 'block';
                            } else {
                                // console.log(((ev.loaded / ev.total) * 100).toFixed(0) + '%', 'ev');
                                //显示进度条
                                $('.progress-bar')[0].style.width = ((ev.loaded / ev.total) * 100).toFixed(0) + '%';
                                $('.progressText').text('进度: ' + ((ev.loaded / ev.total) * 100).toFixed(0) + '%')
                            }
                        };
                        return xhr;
                    },
                    success: function (res) {
                        console.log(res, "res")
                        console.log(i,"iuy")
                        calm.state.addVideoList[i].videoUrl = res;
                        calm.buildAddList();
                        calm.upload_video_pic(i)
                        calm.buildAddList()
                        //返回在线图片地址
                    }
                });
            }
        });
    }
    /**
     * 获取图片路径
     */
    getImage(i) {
        console.log(i,"点击")
        $('#upload_video_').eq(i).unbind("change");
        $('.upload_image_').eq(i).bind('change', function (evt) {
            console.log("chufale")
            if (evt.target.files[0]) {
                var formData = new FormData();
                formData.append("file" + 0, evt.target.files[0]);
                formData.append("name" + 0, evt.target.files[0].name);
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
                            setTimeout(function () {
                                $('#progress')[0].style.display = 'none';
                                $('.progress-bar')[0].style.width = '0%';
                                $('.progressText').text('进度: 0%');
                            }, 500);
                        };
                        xhr.upload.onprogress = function (ev) {
                            console.log(ev,"ev")
                            if(ev.loaded == ev.total){
                                $('.progress-bar')[0].style.width = '100%';
                            }
                            if ($('#progress')[0].style.display == 'none') {
                                $('#progress')[0].style.display = 'block';
                            } else {
                                console.log("jinlaile")
                                // console.log(((ev.loaded / ev.total) * 100).toFixed(0) + '%', 'ev');
                                //显示进度条
                                $('.progress-bar')[0].style.width = ((ev.loaded / ev.total) * 100).toFixed(0) + '%';
                                console.log($('.progress-bar')[0].style.width,"hhehehhe")
                                $('.progressText').text('进度: ' + ((ev.loaded / ev.total) * 100).toFixed(0) + '%')
                            }
                        };
                        return xhr;
                    },
                    success: function (res) {
                        console.log(res, "res1111")
                        console.log(i,"iuy")
                        calm.state.addVideoList[i].coverPath = res;
                        calm.buildAddList();
                        // calm.upload_video_pic(i)
                        // calm.buildAddList()
                        //返回在线图片地址
                    }
                });
            }
        });
    }
    /**
     * 封面预览
     */
    imgPreview(src) {
        var dataObj = {};
        dataObj.method = 'showImage';
        dataObj.url = src;
        dataObj.currentUrl = src;
        Bridge.callHandler(dataObj, null, function (error) {
            console.log(error);
        })
    }

    /**
     * mp4预览
     */
    mp4Preview(v) {
        var data = {
            method: 'playVideo',
            url: v.videoUrl
        };
        Bridge.callHandler(data, null, function (error) {

        });
    }
    /**
     * 封面上传
     */
    uploadImage(index, event) {
        event.stopPropagation()
        var data = {
            method: 'selectImages',
        };
        Bridge.callHandler(data, function (res) {
            // 拿到照片地址,显示在页面等待上传
            let newArr = {};
            let item = res.split("?");
            newArr.picPath = item[0],
                newArr.picName = item[1].split("=")[1]
            calm.state.addVideoList[index].coverPath = newArr.picPath
            calm.buildAddList()

        }, function (error) {
            console.log(error);
        });
    }
    /**
     * 类型的改变
     */
    onChangeRadio = (index, value) => {
        if (value != 1) {
            calm.setState({
                showDelete: false
            })
            calm.state.addVideoList[index].cheData = {};
        }
        if (value == 1) {
            calm.state.addVideoList[index].show = true;
        } else {
            calm.state.addVideoList[index].show = false;
        }
        calm.state.addVideoList[index].videoType = value
        calm.buildAddList()

    };

    /**
     * 视频上传
     */
    uploadMp4(index, event) {
        event.stopPropagation()
        var data = {
            method: 'selectVideo',
        };
        Bridge.callHandler(data, function (res) {
            // 拿到照片地址,显示在页面等待上传
            let newArr = {};
            let item = res.split("?");
            newArr.picPath = item[0],
                newArr.picName = item[1].split("=")[1]
            calm.state.addVideoList[index].videoUrl = newArr.picPath;
            calm.buildAddList()
            calm.upload_video_pic(index)
            calm.buildAddList()

        }, function (error) {
            console.log(error);
        });
    }

    /**
     * 添加标签
     */
    addTag(index) {
        $(`.calmTagDiv`).slideDown();
        $(`.tagBack`).show();
        calm.setState({
            tagIndex: index
        })
    }


    /**
     * 添加挑战
     */
    addChan(index) {
        $('.calmChaDiv').slideDown();
        $('.tagBack').show();
        calm.setState({
            challengeIndex: index
        })
    }

    /**
     * 删除标签
     */
    deleteTag(item, index) {
        calm.state.addVideoList[index].tagText.forEach((v, i) => {
            if (item.tagTitle == v.tagTitle) {
                calm.state.addVideoList[index].tagText.splice(i, 1)
            }
        })
        calm.buildAddList();
    }


    /**
     * 删除挑战
     */
    deleteCha(index) {
        calm.state.addVideoList[index].cheData = {};
        calm.setState({
            showDelete: false
        }, () => {
            calm.buildAddList();

        })
    }
    //首先需要 吧 base64 流转换成 blob 对象，文件对象都继承它
    getBlobBydataURI(dataURI, type) {
        var binary = atob(dataURI.split(',')[1]);
        var array = [];
        for (var i = 0; i < binary.length; i++) {
            array.push(binary.charCodeAt(i));
        }
        return new Blob([new Uint8Array(array)], { type: type });
    }

    upload_video_pic(index) {
        var video;//video标签
        var scale = 0.8;//第一帧图片与源视频的比例
        // var videoList = $(".upload_box_video");
        // console.log(videoList,'videoList');
        // for(var i=0;i<videoList.length;i++){
        //
        // }
        //ｖｉｄｅｏ标签
        video = $('.upload_box_video').eq(index)[0];//赋值标签
        video.setAttribute("crossOrigin", 'Anonymous');
        video.addEventListener("loadeddata", function () {//加载完成事件，调用函数
            var canvas = document.createElement('canvas');//canvas画布
            canvas.width = video.videoWidth * scale;
            canvas.height = video.videoHeight * scale;
            canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);//画图
            var image = canvas.toDataURL("image/png");
            var $Blob = calm.getBlobBydataURI(image, 'image/jpeg');
            var formData = new FormData();
            formData.append("filePath", $Blob, "file_" + Date.parse(new Date()) + ".png");
            calm.state.addVideoList[index].width = video.videoWidth;
            calm.state.addVideoList[index].height = video.videoHeight;
            $.ajax({
                type: "POST",
                url: "https://jiaoxue.maaee.com:8890/Excoord_Upload_Server/file/upload",
                enctype: 'multipart/form-data',
                data: formData,
                // 告诉jQuery不要去处理发送的数据
                processData: false,
                // 告诉jQuery不要去设置Content-Type请求头
                contentType: false,
                // xhr: function () {        //这是关键  获取原生的xhr对象  做以前做的所有事情
                //     var xhr = jQuery.ajaxSettings.xhr();
                //     xhr.upload.onload = function () {
                //         console.log('huoqudangqiansuoluetu!');
                //         console.log(xhr);
                //     };
                //     xhr.upload.onprogress = function (ev) {
                //         console.log('yyyyyyyyy!');
                //         console.log(xhr);
                //     };
                //     return xhr;
                // },
                success: function (res) {
                    console.log(res, 'base64');
                    calm.state.addVideoList[index].firstUrl = res;
                    calm.buildAddList();
                }
            });
        })
    }

    /**
     * 根据数据数组构建批量上传列表
     */
    buildAddList() {
        var listArr = this.state.addVideoList
        var arr = [];
        listArr.forEach(function (v, i) {
            var useIndex = i;
            arr.push(<div className="listCont">
                {/*删除按钮*/}
                <div className="icon_delete" onClick={calm.showListAlert.bind(this, i)}
                    style={{ display: listArr.length == 1 ? 'none' : 'block' }}></div>
                <div className="my_flex sameBack">
                    <span className="textTitle">封面
                        <p style={{ margin: 0, height: 3 }}></p>
                        <span className="uploadSupport">(jpg格式)</span>
                    </span>
                    {calm.state.addVideoList[i].coverPath.length == 0 ?
                        <div className="parentDiv">
                            <button className="uploadBtn">上传封面</button>
                            <input className="calm40 upload_image_" name="upload_image_" id="upload_image_" onClick={calm.getImage.bind(this, useIndex)} type="file" accept="image/jpg" class="hidd" />
                        </div>
                        :
                        <div className="upload_file">
                            <img onClick={calm.imgPreview.bind(this, calm.state.addVideoList[i].coverPath)}
                                className="imgTag" src={calm.state.addVideoList[i].coverPath} />
                            <div>
                                <div className="icon_pointer">更换</div>
                                <input className="calm20 upload_image_" name="upload_image_" id="upload_image_" onClick={calm.getImage.bind(this, useIndex)} type="file" accept="image/jpg" class="hidd" />
                            </div>
                        </div>
                    }

                </div>
                <div className="line_public flex_container"></div>
                <div className="my_flex sameBack">
                    <span className="textTitle">视频
                        <p style={{ margin: 0, height: 3 }}></p>
                        <span className="uploadSupport">(MP4格式)</span>
                    </span>
                    {calm.state.addVideoList[i].videoUrl.length == 0 ?
                        <div className="parentDiv">
                            <button className="uploadBtn">上传视频</button>
                            <input className="calm40 upload_video_"  name="upload_video_" id="upload_video_" onClick={calm.getVideo.bind(this, i)} type="file" accept="video/*" class="hidd" />
                        </div>
                        :
                        <div className="upload_file">
                            <video className="upload_box_video"
                                onClick={calm.mp4Preview.bind(this, calm.state.addVideoList[i])}
                                src={calm.state.addVideoList[i].videoUrl}></video>
                            <div>
                                <div className="icon_pointer">更换</div>
                                <input className="calm20 upload_video_" name="upload_video_" id="upload_video_" onClick={calm.getVideo.bind(this, i)} type="file" accept="video/*" class="hidd" />
                            </div>
                        </div>

                    }
                </div>
                <div className="line_public flex_container"></div>
                <div className="sameBack videoType my_flex">
                    <span className="textTitle">类型</span>
                    <List>
                        {typeDate.map(item => (
                            <RadioItem
                                key={item.value}
                                checked={calm.state.addVideoList[i].videoType === item.value}
                                onChange={() => calm.onChangeRadio(i, item.value)}>
                                {item.label}
                            </RadioItem>
                        ))}
                    </List>
                </div>
                <div className="line_public flex_container"></div>
                <div className="my_flex sameBack">
                    <span className="textTitle">描述</span>
                    <TextareaItem
                        className="add_element"
                        placeholder="请输入心情描述"
                        value={calm.state.addVideoList[i].videoContent}
                        onChange={calm.inputOnChange.bind(this, i)}
                        rows={5}
                        count={50}
                    />
                </div>
                <div className="line_public flex_container"></div>
                <div style={{ display: calm.state.addVideoList[i].show ? "block" : "none" }}>
                    <div className="my_flex sameBack">
                        <div className="textTitle">挑战</div>
                        <div className='tagBtn' style={{ display: !(calm.state.showDelete) ? "block" : "none" }} onClick={calm.addChan.bind(this, i)}>添加挑战</div>
                        <div className='challengeTag' style={{ display: calm.state.showDelete ? "block" : "none" }} >
                            <div className='tagTitle textOver'>
                                <span className="del_tag" onClick={calm.deleteCha.bind(this, i)}>删除</span>
                                <span className='preIcon'>#</span>
                                {calm.state.addVideoList[i].cheData.label}</div>
                            <div className='tagText'>
                                {calm.state.addVideoList[i].cheData.extra}
                            </div>
                        </div>

                    </div>
                    <div className="line_public flex_container"></div>
                </div>
                <div className='my_flex sameBack'>
                    <div className="textTitle">标签</div>
                    <div className='my_flex tagDiv'>
                        {
                            calm.state.addVideoList[i].tagText.map((v, i) => {
                                return (
                                    <div className="spanTag">
                                        <span className="textOver">{v.tagTitle}</span>
                                        <span className="del_tag" onClick={calm.deleteTag.bind(this, v, useIndex)}></span>
                                    </div>
                                )
                            })
                        }

                        {
                            calm.state.addVideoList[i].tagText.length == 3 ?
                                ""
                                :
                                <div className='tagBtn' onClick={calm.addTag.bind(this, i)}>添加标签</div>

                        }
                    </div>
                </div>

            </div>)
        })
        this.setState({ addListArr: arr })
    }

    /**
     * 输入框改变的回调
     * @param type  videoContent心情
     * @param index
     * @param value
     */
    inputOnChange = (index, value) => {
        calm.state.addVideoList[index].videoContent = value
        calm.buildAddList()
    }

    /**
     * 添加视频项
     */
    addList = () => {
        if (this.state.addVideoList.length == 10) {
            Toast.fail('最大只允许一次上传十个视频', 2)
            return
        }
        this.state.addVideoList.push({
            videoUrl: '',
            coverPath: '',
            videoContent: '',
            tagValue: '',
            videoType: 0,
            isRecommend: 0,
            userId: calm.state.uid,
            show: false,
            tagText: [],
            cheData: {},
            firstUrl: "",
            height: "",
            width: ""

        })
        this.buildAddList()
    }

    /**
     * 删除音乐model
     * @param src
     * @param id
     * @param event
     */
    showListAlert = (v) => {

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
            { text: '确定', onPress: () => _this.delList(v) },

        ], phone);
    }

    /**
     * 删除音视频项
     * @param index
     * @returns {function()}
     */
    delList(index) {
        this.state.addVideoList.splice(index, 1);
        this.buildAddList()
    }


    //取消编辑
    cancelEditor() {
        var data = {};
                    data.method = '取消成功';
                    data.type = 2;
                    window.parent.postMessage(JSON.stringify(data), '*');
                    window.location.reload();
        console.log('取消成功');
    }

    /**
     * 保存视频信息
     */
    batchLittleVideoInfo(type) {
        console.log(type, 'in upload type');
        var newArr = []
        calm.state.addVideoList.forEach(function (v, i) {
            if ($.isEmptyObject(v.cheData)) {
                newArr.push({
                    status: type,
                    coverPath: v.coverPath,
                    videoPath: v.videoUrl,
                    firstUrl: v.firstUrl,
                    width: v.width,
                    height: v.height,
                    videoType: v.videoType,   // 视频类型0:普通视频 1:话题/挑战视频 2:广告视频 非空
                    userId: v.userId,
                    videoContent: v.videoContent,   // 心情描述 
                    tags: []
                })
            } else {
                newArr.push({
                    status: type,
                    coverPath: v.coverPath,
                    videoPath: v.videoUrl,
                    firstUrl: v.firstUrl,
                    width: v.width,
                    height: v.height,
                    videoType: v.videoType,   // 视频类型0:普通视频 1:话题/挑战视频 2:广告视频 非空
                    userId: v.userId,
                    videoContent: v.videoContent,   // 心情描述 
                    tags: [
                        {
                            tagTitle: v.cheData.label,
                            tagType: 2,   //挑战
                            tagContent: v.cheData.extra
                        }
                    ]
                })
            }
        })
        newArr.forEach((v, i) => {
            v.tags = v.tags.concat(calm.state.addVideoList[i].tagText)
        })


        var submitFlag = true;
        for (var i = 0; i < newArr.length; i++) {
            if (newArr[i].coverPath.length == 0 || newArr[i].videoPath.length == 0 || newArr[i].videoContent.length == 0) {
                submitFlag = false
                break
            }
        }
        if (!submitFlag) {
            Toast.fail('数据存在空值，请检查', 2)
            return
        }
        
        var calmFlag = true;
        for (var i = 0; i < newArr.length; i++) {
            if ( newArr[i].width.length == 0 || newArr[i].height.length == 0 || newArr[i].firstUrl.length == 0) {
                calmFlag = false
                break
            }
        }
        if (!calmFlag) {
            Toast.fail('视频参数错误，请重新上传', 2)
            return
        }

        var param = {
            "method": 'batchLittleVideoInfo',
            "videoJson": JSON.stringify(newArr),
        };
        console.log(newArr, "param")
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' && result.success == true) {
                    // Toast.success('成功');
                    // 关闭当前窗口，并刷新上一个页面
                    // var data = {
                    //     method: 'finishForRefresh',
                    // };
                    // Bridge.callHandler(data, null, function (error) {
                    //     console.log(error);
                    // });
                    var data = {};
                    data.method = '发布成功';
                    data.type = type;
                    window.parent.postMessage(JSON.stringify(data), '*');
                    window.location.reload();
                }
            },
            onError: function (error) {
                // message.error(error);
                Toast.fail(type == 0 ? '保存失败' : '发布失败');
            }
        });
    }



    /**
     * 挑战搜索框
     */
    chaInputChange = (value) => {
        calm.setState({
            challengeValue: value,
            showTextOrList: true,
            chaChangeValue: ""
        }, () => {
            calm.getChasByContent()
        })
    }

    /**
     * 挑战搜索结果
     */
    getChasByContent() {
        if (calm.state.challengeValue == "") {
            Toast.info("请输入搜索的关键词")
            return;
        }
        calm.setState({ challengeData: [] }, () => {
            var param = {
                "method": 'getTagsByContent',
                "tagContent": calm.state.challengeValue,
                "tagType": 2,
                "pageNo": -1
            }
            WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
                onResponse: function (result) {
                    if (result.msg == '调用成功' || result.success == true) {
                        if (!WebServiceUtil.isEmpty(result.response)) {
                            var arr = []
                            result.response.forEach(function (v, i) {
                                var str = v.tagContent
                                if (v.tagId == 0) {
                                    arr.push({
                                        value: v.tagId,
                                        label: v.tagTitle,
                                        extra: <div>{str}<div className='blueTxt'>点击发起</div></div>

                                    })
                                    return;
                                }
                                arr.push(
                                    {
                                        value: v.tagId,
                                        label: v.tagTitle,
                                        extra: v.tagContent
                                    })
                            })
                            calm.setState({ challengeData: arr })
                        }
                    } else {
                        Toast.fail(result.msg, 5);
                    }
                },
                onError: function (error) {
                    // message.error(error);
                }
            });
        })

    }

    /**
     * 挑战点击确定回调
     */
    submitChaArr() {
        $(`.calmChaDiv`).slideUp();
        $(`.tagBack`).hide();
        if (calm.state.cheData.value != 0) {
            calm.state.addVideoList[calm.state.challengeIndex].cheData = calm.state.cheData;
        }
        if (calm.state.cheData.value == 0) {
            calm.state.addVideoList[calm.state.challengeIndex].cheData.label = calm.state.cheData.label;
            calm.state.addVideoList[calm.state.challengeIndex].cheData.extra = calm.state.chaContent;
        }
        calm.setState({
            showDelete: true
        }, () => {
            calm.buildAddList()

        })
        // $('.deleteCha').show();
        calm.setState({ challengeData: [], challengeValue: "", showTextOrList: true, chaContent: "", chaChangeValue: "" })


    }

    /** 
     * 挑战取消回调
    */
    cancelChaSubmit() {
        $(`.calmChaDiv`).slideUp();
        $(`.tagBack`).hide();
        calm.setState({ challengeData: [] })
        calm.setState({ challengeValue: '' })
        calm.setState({ chaContent: "" })
        calm.setState({ showTextOrList: true })
    }

    /** 
  * 标签搜索框
  */
    searchInputChange = (value) => {
        calm.setState({
            searchValue: value
        }, () => {
            calm.getTagsByContent()
        })
    }

    /**
    * 标签点击确定的回调
    */
    submitTagArr() {
        $(`.calmTagDiv`).slideUp();
        $(`.tagBack`).hide();
        var tagTextData = []
        calm.state.tagChangeData.forEach((v, i) => {
            if (v.tagId == 0) {
                tagTextData.push({
                    tagTitle: v.tagTitle,
                    tagType: 1,
                })
            } else {
                tagTextData.push({
                    tagTitle: v.tagTitle,
                    tagType: 1,
                    tagId: v.tagId
                })
            }

        })
        calm.state.addVideoList[calm.state.tagIndex].tagText = calm.state.addVideoList[calm.state.tagIndex].tagText.concat(tagTextData);

        var arr = calm.state.addVideoList[calm.state.tagIndex].tagText;
        calm.state.addVideoList[calm.state.tagIndex].tagText = calm.makeArr(arr, "tagTitle")
        calm.buildAddList();
        calm.setState({ tagData: [], tagChangeData: [], searchValue: "" })
    }

    /**
    * 取消标签
    */
    cancelSubmit() {
        $(`.calmTagDiv`).slideUp();
        $(`.tagBack`).hide();
        calm.setState({ tagData: [] })
        calm.setState({ searchValue: '' })
    }

    /**
  * 搜索关键字结果
  */
    getTagsByContent() {
        if (calm.state.searchValue == "") {
            Toast.info("请输入搜索的关键词")
            return;
        }
        calm.setState({ tagData: [] }, () => {
            var param = {
                "method": 'getTagsByContent',
                "tagContent": calm.state.searchValue,
                "tagType": 1,
                "pageNo": -1
            }
            WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
                onResponse: function (result) {
                    if (result.msg == '调用成功' || result.success == true) {
                        if (!WebServiceUtil.isEmpty(result.response)) {
                            var arr = []
                            result.response.forEach(function (v, i) {
                                if (v.tagId == 0) {
                                    // calm.setState({
                                    //     isNewTag:0
                                    // })
                                    calm.setState.isNewTag = 0;
                                    arr.push(<Tag
                                        selected={false}
                                        onChange={calm.tagChange.bind(this, v)}
                                    >{v.tagTitle}</Tag>)
                                    return
                                }
                                calm.setState({
                                    isNewTag: 0
                                })
                                arr.push(<Tag
                                    selected={false}
                                    onChange={calm.tagChange.bind(this, v)}
                                >{v.tagTitle}</Tag>)
                            })
                            calm.setState({ tagData: arr })
                        }
                    } else {
                        Toast.fail(result.msg, 5);
                    }
                },
                onError: function (error) {
                    // message.error(error);
                }
            });
        })

    }
    /**
     * 标签改变
     */
    tagChange(data, status) {
        if (status) {
            calm.state.tagChangeData.push(data);
        } else {
            calm.state.tagChangeData.forEach((v, i) => {
                if (v.id == data.id) {
                    calm.state.tagChangeData.splice(i, 1)
                }
            })
        }
    }
    /**
    * 去重
    * @param arr
    * @returns {*}
    */
    makeArr(arr, properties) {
        for (var i = 0; i < arr.length - 1; i++) {
            for (var j = i + 1; j < arr.length; j++) {
                if (arr[i][properties] == arr[j][properties]) {
                    arr.splice(j, 1);
                    j--;
                }
            }
        }
        return arr
    }



    /**
     * 挑战改变
     */
    chaChange(i) {


        calm.setState({
            challengeValue: i.label
        }, () => {

        })

        if (i.value == 0) {
            calm.setState({
                showTextOrList: false
            })
        }
        calm.setState({
            cheData: i,
            chaChangeValue: i.value,
        });

    };

    /**
     * 挑战内容
     */
    chaOnChange = (value) => {
        calm.setState({
            chaContent: value
        })
    }


    render() {
        return (
            <div id="addUploadVideo">
                <div id="progress" style={{ display: "none" }}>
                    <div className="progress">
                        <div className="progress-bar" style={{ width: "0%" }}></div>
                    </div>
                    <div className="progressText">进度: 0%</div>
                </div>
                <div className="addList">
                    {this.state.addListArr}
                    <div className="addBtn sameBack" onClick={this.addList}>
                        <span>添加视频<Icon type="plus" /></span>
                    </div>
                </div>
                {/* 添加标签 */}
                <div className="tagBack" style={{
                    display: "none",
                }}></div>
                <div className={`calmTagDiv tagCont`}
                    style={{
                        display: "none",
                    }}
                >
                    {/* {useIndex} */}
                    <div className="tagInput">
                        <InputItem
                            placeholder="请输入标签"
                            onChange={calm.searchInputChange}
                            value={calm.state.searchValue}
                        >
                        </InputItem>

                        {/* <div className="searchIcon" onClick={calm.searchARBookTag}></div> */}
                    </div>
                    <div className="classTags">
                        {
                            calm.state.tagData
                        }
                    </div>
                    <div className="bottomBox">
                        <span className="close" onClick={calm.cancelSubmit}>取消</span>
                        <span className="bind" onClick={calm.submitTagArr}>确 定</span>
                    </div>
                </div>
                {/* 添加挑战 */}
                <div className={`calmChaDiv tagCont`}
                    style={{
                        display: "none",
                    }}
                >
                    {
                        calm.state.showTextOrList ?
                            ""
                            :
                            <div className='startTitle'>发起挑战<span className='preIcon'>#</span></div>
                    }
                    <div className="tagInput">
                        <InputItem
                            placeholder="请输入挑战"
                            onChange={calm.chaInputChange}
                            value={calm.state.challengeValue}
                        >
                        </InputItem>
                    </div>
                    <div className='challenge'>
                        {
                            calm.state.showTextOrList ?
                                <List>
                                    {calm.state.challengeData.map(i => (
                                        <RadioItem className={calm.state.chaChangeValue === i.value ? 'checked' : ''} key={i.value} checked={calm.state.chaChangeValue === i.value} onChange={() => calm.chaChange(i)}>
                                            <div className='topTitle textOver'><span className='preIcon'>#</span>{i.label}</div><div className='text textOver_line3'>{i.extra}</div>
                                        </RadioItem>
                                    ))}
                                </List>
                                :
                                <TextareaItem
                                    className="add_element"
                                    placeholder="请输入挑战的表述"
                                    value={calm.state.chaContent}
                                    onChange={calm.chaOnChange.bind(this)}
                                    rows={5}
                                    count={50}
                                />

                        }
                    </div>
                    <div className="bottomBox">
                        <span className="close" onClick={calm.cancelChaSubmit}>取消</span>
                        <span className="bind" onClick={calm.submitChaArr}>确 定</span>
                    </div>
                </div>
                <div className='submitBtn'>
                    <Button type="warning" onClick={this.batchLittleVideoInfo.bind(this, 1)}>提交</Button>
                    <Button type="warning" onClick={this.batchLittleVideoInfo.bind(this, 0)}>保存</Button>
                    <Button type="warning" onClick={this.cancelEditor.bind(this)}>取消编辑</Button>
                </div>

            </div>
        );
    }
}

