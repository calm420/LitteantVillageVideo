import React from "react";
import { ListView, PullToRefresh, Modal, Toast, Accordion, List, InputItem, DatePicker, ImagePicker, TextareaItem } from 'antd-mobile';
import Input from "antd-mobile/lib/input-item/Input";
import '../css/VillageCardSystemHome.less'
var calm;
var lookUrl;
var alreadylookUrl;

const alert = Modal.alert;
function formatTime (time, format) {
    var t = new Date(time);
    var tf = function (i) { return (i < 10 ? '0' : "") + i };
    return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function (a) {
        switch (a) {
            case 'yyyy':
                return tf(t.getFullYear());
                break;
            case 'MM':
                return tf(t.getMonth() + 1);
                break;
            case 'mm':
                return tf(t.getMinutes());
                break;
            case 'dd':
                return tf(t.getDate());
                break;
            case 'HH':
                return tf(t.getHours());
                break;
            case 'ss':
                return tf(t.getSeconds());
                break;
        }
    })
}
export default class VillageCardSystemHome extends React.Component {
    constructor(props) {
        super(props);
        calm = this;
        this.state = {
            articalType: [
                {
                    title: "待审核", active: false
                },
                {
                    title: "已审核", active: false
                },
            ],
            editCardType: [
                {
                    title: "绑定村牌", active: false
                },
                {
                    title: "乡村振兴", active: false
                },
                {
                    title: "党课预告", active: false
                },
                {
                    title: "党课考勤", active: false
                },
                {
                    title: "发布通知", active: false
                },
                {
                    title: "荣誉村民", active: false
                },
                {
                    title: "学习榜", active: false
                },
            ],
            inputDivs: [],
            addInputList: [{
                inputValue: "",
            }],
            inputFirstValue: "",
            villageName: "",
            villageGroupList: [],
            accountData: {},
            courseBackImg: "",
            villageCourseList: [],
            villageAttendList: [],
            VillCourse: {},
            villageNotifyList: [],
            honorVillagerList: [],
            cardNameValue: "",
            villageCradImg: "",
            cardTitleValue: "",
            cardContentValue: "",
            uploadFileList: [],
            villageNewsHistory: [],
            courseImgUp: "",
            learningList: []
        }
    }

    componentDidMount () {
        this.buildAddList()
        Bridge.setShareAble("false");
        document.title = "后台管理系统"
        var accountData = [];
        accountData = JSON.parse(localStorage.getItem("account"));
        this.setState({
            accountData: this.makeArr(accountData, "account"),
        }, () => {
            this.setState({
                villageName: this.state.accountData.villageName
            })
            this.getVillageGroupList(this.state.accountData.villageId)
        })

        window.addEventListener('message', (e) => {
            this.onMessage(e);
        })

        if (window.location.href.indexOf("/VillageCardSystemHome") > -1) {
            //防止页面后退
            history.pushState(null, null, document.URL);
            window.addEventListener('popstate', function () {
                history.pushState(null, null, document.URL);
            });
        }

    }


    //接受消息
    onMessage (e) {
        if (e.data) {
            var iframeData = JSON.parse(e.data);
            if (iframeData.method == 'closePanelRefrshPage') {
                console.log(e.data, "e.data")
                this.getVillageNoticeList(this.state.accountData.villageId);
                this.getVillageVillageNewsByVillageId()
                $(".notifyPop").hide();
                $(".villageMask").hide();
                $(".pushNotify").attr("src", "")
                $(".pushArticalPop").hide();
                $(".pushArtical").attr("src", "")
            }
        }

    }

    getVillageNoticeList = (villageId) => {
        var param = {
            "method": "getVillageNoticeList",
            "villageId": villageId,
        };
        console.log(param, "param")

        WebServiceUtil.requestLittleAntApi6013(JSON.stringify(param), {
            onResponse: (res) => {
                if (res.success) {
                    this.setState({
                        villageNotifyList: res.response
                    })
                }

            },
            onError: function (error) {
                // Toast.fail(error, 1);
            }
        });
    }

    /**
   * 去重
   * @param arr
   * @returns {*}
   */
    makeArr = function (arr, properties) {
        for (var i = 0; i < arr.length - 1; i++) {
            for (var j = i + 1; j < arr.length; j++) {
                if (arr[i][properties] == arr[j][properties]) {
                    arr.splice(i, 1);
                    j--;
                }
            }
        }
        return arr
    }

    onChangeLeft = (key) => {
        console.log(key, "onChangeLeft");
        if (key == 0) {
            $(".allClassName").removeClass("select")
            $(".memberList").addClass("select")
            $(".rightBox").hide();
            $(".rightBoxFirst").show();
            $(".lookThrough").hide();
            $(".cardEdit").hide();
            $(".rightBoxVillageHistory").hide();

        } else if (key == 3) {
            $(".allClassName").removeClass("select")
            $(".villageHistory").addClass("select")
            $(".rightBox").hide();
            $(".rightBoxVillageHistory").show();
            $(".lookThrough").hide();
            $(".cardEdit").hide();
            this.getVillageVillageNewsByVillageId()

        } else if (key == 1) {
            $(".cardEdit").hide();
            $(".allClassName").removeClass("select")
            $(".articalLookThrough").addClass("select")
            this.setState({
                articalType: [
                    {
                        title: "待审核", active: true
                    },
                    {
                        title: "已审核", active: false
                    },
                ],
            })
            $(".rightBox").hide();
            $(".rightBoxSecond").show();
            $(".lookThrough").show();
            var url = WebServiceUtil.mobileServiceURL + "lookThrough?auditorId=" + this.state.accountData.uid;
            $(".iframeDiv").attr("src", url)
            $(".rightBoxVillageHistory").hide();
        } else if (key == 2) {
            $(".allClassName").removeClass("select")
            $(".villageCardEdit").addClass("select")
            $(".rightBoxVillageHistory").hide();
            this.setState({
                editCardType:
                    [
                        {
                            title: "绑定村牌", active: true
                        },
                        {
                            title: "乡村振兴", active: false
                        },
                        {
                            title: "党课预告", active: false
                        },
                        {
                            title: "党课考勤", active: false
                        },
                        {
                            title: "发布通知", active: false
                        },
                        {
                            title: "荣誉村民", active: false
                        },
                        {
                            title: "学习榜", active: false
                        },
                    ],
            })
            $(".rightBox").hide();
            $(".lookThrough").hide();
            $(".rightBoxThird").show();
            $(".cardEdit").show();
        }
    }
    onChangeRightContent = (key) => {
        console.log(key);
    }
    clickArticalItem = (value) => {
        if (value.title == "待审核") {
            this.setState({
                articalType: [
                    {
                        title: "待审核", active: true
                    },
                    {
                        title: "已审核", active: false
                    },
                ],
            })
            var url = WebServiceUtil.mobileServiceURL + "lookThrough?auditorId=" + this.state.accountData.uid
            $(".iframeDiv").attr("src", url)
        } else if (value.title == "已审核") {
            this.setState({
                articalType: [
                    {
                        title: "待审核", active: false
                    },
                    {
                        title: "已审核", active: true
                    },
                ],
            })
            var url = WebServiceUtil.mobileServiceURL + "alreadyLookThough?auditorId=" + this.state.accountData.uid
            $(".iframeDiv").attr("src", url)


        }
    }
    clickCardItem = (v) => {
        if (v.title == "绑定村牌") {
            this.setState({
                "cardNameValue": "",
                "cardContentValue": "",
                "cardOrderValue": "",
                "cardTitleValue": "",
                "villageCradImg": ""
            })
            $(".bindCard").show();
            $(".villageImg").hide();
            $(".dangke").hide();
            $(".dangkeAtt").hide();
            $(".pushNotify").hide();
            $(".hornorVillages").hide();
            $(".learnList").hide();
            this.setState({
                editCardType:
                    [
                        {
                            title: "绑定村牌", active: true
                        },
                        {
                            title: "乡村振兴", active: false
                        },
                        {
                            title: "党课预告", active: false
                        },
                        {
                            title: "党课考勤", active: false
                        },
                        {
                            title: "发布通知", active: false
                        },
                        {
                            title: "荣誉村民", active: false
                        },
                        {
                            title: "学习榜", active: false
                        },
                    ],
            })
        } else if (v.title == "乡村振兴") {
            this.selectUploadFile()
            $(".villageImg").show();
            $(".dangke").hide();
            $(".dangkeAtt").hide();
            $(".pushNotify").hide();
            $(".hornorVillages").hide();
            $(".learnList").hide();
            $(".bindCard").hide();
            this.setState({
                editCardType:
                    [
                        {
                            title: "绑定村牌", active: false
                        },
                        {
                            title: "乡村振兴", active: true
                        },
                        {
                            title: "党课预告", active: false
                        },
                        {
                            title: "党课考勤", active: false
                        },
                        {
                            title: "发布通知", active: false
                        },
                        {
                            title: "荣誉村民", active: false
                        },
                        {
                            title: "学习榜", active: false
                        },
                    ],
            })
        } else if (v.title == "党课预告") {
            this.getVillageCourseList(this.state.accountData.villageId)
            $(".villageImg").hide();
            $(".dangke").show();
            $(".dangkeAtt").hide();
            $(".pushNotify").hide();
            $(".hornorVillages").hide();
            $(".learnList").hide();
            $(".bindCard").hide();
            this.setState({
                editCardType:
                    [
                        {
                            title: "绑定村牌", active: false
                        },
                        {
                            title: "乡村振兴", active: false
                        },
                        {
                            title: "党课预告", active: true
                        },
                        {
                            title: "党课考勤", active: false
                        },
                        {
                            title: "发布通知", active: false
                        },
                        {
                            title: "荣誉村民", active: false
                        },
                        {
                            title: "学习榜", active: false
                        },
                    ],
            })
        } else if (v.title == "党课考勤") {
            this.getVillageAttendList(this.state.accountData.villageId)
            $(".villageImg").hide();
            $(".dangke").hide();
            $(".dangkeAtt").show();
            $(".pushNotify").hide();
            $(".hornorVillages").hide();
            $(".learnList").hide();
            $(".bindCard").hide();
            this.setState({
                editCardType:
                    [
                        {
                            title: "绑定村牌", active: false
                        },
                        {
                            title: "乡村振兴", active: false
                        },
                        {
                            title: "党课预告", active: false
                        },
                        {
                            title: "党课考勤", active: true
                        },
                        {
                            title: "发布通知", active: false
                        },
                        {
                            title: "荣誉村民", active: false
                        },
                        {
                            title: "学习榜", active: false
                        },
                    ],
            })
        } else if (v.title == "发布通知") {
            this.getVillageNoticeList(this.state.accountData.villageId);

            $(".villageImg").hide();
            $(".dangke").hide();
            $(".dangkeAtt").hide();
            $(".pushNotify").show();
            $(".hornorVillages").hide();
            $(".learnList").hide();
            $(".bindCard").hide();
            this.setState({
                editCardType:
                    [
                        {
                            title: "绑定村牌", active: false
                        },
                        {
                            title: "乡村振兴", active: false
                        },
                        {
                            title: "党课预告", active: false
                        },
                        {
                            title: "党课考勤", active: false
                        },
                        {
                            title: "发布通知", active: true
                        },
                        {
                            title: "荣誉村民", active: false
                        },
                        {
                            title: "学习榜", active: false
                        },
                    ],
            })
        } else if (v.title == "荣誉村民") {
            this.getHornerVillage(this.state.accountData.villageId)
            $(".villageImg").hide();
            $(".dangke").hide();
            $(".dangkeAtt").hide();
            $(".pushNotify").hide();
            $(".hornorVillages").show();
            $(".learnList").hide();
            $(".bindCard").hide();
            this.setState({
                editCardType:
                    [
                        {
                            title: "绑定村牌", active: false
                        },
                        {
                            title: "乡村振兴", active: false
                        },
                        {
                            title: "党课预告", active: false
                        },
                        {
                            title: "党课考勤", active: false
                        },
                        {
                            title: "发布通知", active: false
                        },
                        {
                            title: "荣誉村民", active: true
                        },
                        {
                            title: "学习榜", active: false
                        },
                    ],
            })
        } else if (v.title == "学习榜") {
            this.getLearningList(this.state.accountData.villageId)
            $(".villageImg").hide();
            $(".dangke").hide();
            $(".dangkeAtt").hide();
            $(".pushNotify").hide();
            $(".hornorVillages").hide();
            $(".learnList").show();
            $(".bindCard").hide();
            this.setState({
                editCardType:
                    [
                        {
                            title: "绑定村牌", active: false
                        },
                        {
                            title: "乡村振兴", active: false
                        },
                        {
                            title: "党课预告", active: false
                        },
                        {
                            title: "党课考勤", active: false
                        },
                        {
                            title: "发布通知", active: false
                        },
                        {
                            title: "荣誉村民", active: false
                        },
                        {
                            title: "学习榜", active: true
                        },
                    ],
            })
        }
    }

    /**
    * 获取图片路径
    */
    getImage () {
        $('#upload_image_').unbind("change");
        $('.upload_image_').bind('change', function (evt) {
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
                            console.log(ev, "ev")
                            if (ev.loaded == ev.total) {
                                $('.progress-bar')[0].style.width = '100%';
                            }
                            if ($('#progress')[0].style.display == 'none') {
                                $('#progress')[0].style.display = 'block';
                            } else {
                                console.log("jinlaile")
                                // console.log(((ev.loaded / ev.total) * 100).toFixed(0) + '%', 'ev');
                                //显示进度条
                                $('.progress-bar')[0].style.width = ((ev.loaded / ev.total) * 100).toFixed(0) + '%';
                                console.log($('.progress-bar')[0].style.width, "hhehehhe")
                                $('.progressText').text('进度: ' + ((ev.loaded / ev.total) * 100).toFixed(0) + '%')
                            }
                        };
                        return xhr;
                    },
                    success: function (res) {
                        var newArr = res.split('.');
                        if (newArr[newArr.length - 1] == "JPG") {
                            res = res.replace(/JPG/g, "jpg");;
                        }
                        if (newArr[newArr.length - 1] == "JPEG") {
                            res = res.replace(/JPEG/g, "jpeg");;
                        }
                        if (newArr[newArr.length - 1] == "MP4") {
                            res = res.replace(/MP4/g, "mp4");;
                        }
                        //拿到图片地址,显示在页面等待上传
                        var classDemeanors = res.split(',');
                        var promiseArray = [];
                        console.log(classDemeanors, '图片地址');
                        for (var k = 0; k < classDemeanors.length; k++) {
                            console.log(k);
                            if (classDemeanors[k].substr(classDemeanors[k].length - 3, 3) == 'mp4') {
                                console.log("mp4")
                                console.log(k, '视频');
                                var cut = new Promise(function (resolve, reject) {
                                    let t = k;
                                    let video = document.createElement("video");
                                    let canvas = document.createElement("canvas");
                                    video.src = classDemeanors[t];
                                    video.crossOrigin = 'Anonymous';
                                    video.addEventListener('loadeddata', function () {
                                        console.log('执行');
                                        canvas.width = video.videoWidth * 0.8;
                                        canvas.height = video.videoHeight * 0.8;
                                        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
                                        // var $Blob = canvas.toDataURL("image/png");
                                        var $Blob = calm.getBlobBydataURI(canvas.toDataURL("image/png"), 'image/jpeg');
                                        var formData = new FormData();
                                        formData.append("filePath", $Blob, "file_" + Date.parse(new Date()) + ".png");
                                        $.ajax({
                                            type: "POST",
                                            url: "https://jiaoxue.maaee.com:8890/Excoord_Upload_Server/file/upload",
                                            enctype: 'multipart/form-data',
                                            data: formData,
                                            // 告诉jQuery不要去处理发送的数据
                                            processData: false,
                                            // 告诉jQuery不要去设置Content-Type请求头
                                            contentType: false,
                                            success: function (res) {
                                                var firstImg = res;
                                                classDemeanors = classDemeanors + '&' + firstImg;
                                                resolve('成功');
                                                calm.setState({
                                                    villageHappyVideo: classDemeanors
                                                }, () => {
                                                    console.log(calm.state.villageHappyVideo, "calm.state.villageHappyVideo")
                                                    calm.addUploadFile(1, calm.state.villageHappyVideo)
                                                    setTimeout(() => {
                                                        calm.selectUploadFile();
                                                    }, 300);
                                                })
                                            },
                                            error: function (res) {
                                            }
                                        });
                                    });
                                });
                                promiseArray.push(cut);

                            } else {
                                console.log("jpg")
                                calm.setState({
                                    villageHappyImg: classDemeanors[0]
                                }, () => {
                                    calm.addUploadFile(0, classDemeanors[0])
                                    setTimeout(() => {
                                        calm.selectUploadFile();
                                    }, 300);
                                })
                            }
                        }
                        // console.log(promiseArray,'promiseArray')
                        Promise.all(promiseArray).then(function (e) {
                            console.log("890-")

                        })
                    }
                });
            }
        });
    }

    /**
   * 首先需要 吧 base64 流转换成 blob 对象，文件对象都继承它
   * @param dataURI
   * @param type
   * @returns {*}
   */
    getBlobBydataURI (dataURI, type) {
        var binary = atob(dataURI.split(',')[1]);
        var array = [];
        for (var i = 0; i < binary.length; i++) {
            array.push(binary.charCodeAt(i));
        }
        return new Blob([new Uint8Array(array)], { type: type });
    }
    /**
    * 获取图片路径
    */
    courseImgUp () {
        $('#upload_video_').unbind("change");
        $('.upload_image_course').bind('change', function (evt) {
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
                            console.log(ev, "ev")
                            if (ev.loaded == ev.total) {
                                $('.progress-bar')[0].style.width = '100%';
                            }
                            if ($('#progress')[0].style.display == 'none') {
                                $('#progress')[0].style.display = 'block';
                            } else {
                                console.log("jinlaile")
                                // console.log(((ev.loaded / ev.total) * 100).toFixed(0) + '%', 'ev');
                                //显示进度条
                                $('.progress-bar')[0].style.width = ((ev.loaded / ev.total) * 100).toFixed(0) + '%';
                                console.log($('.progress-bar')[0].style.width, "hhehehhe")
                                $('.progressText').text('进度: ' + ((ev.loaded / ev.total) * 100).toFixed(0) + '%')
                            }
                        };
                        return xhr;
                    },
                    success: function (res) {
                        console.log(res, "res1111")
                        calm.setState({
                            courseImgUp: res
                        })
                    }
                });
            }
        });
    }
    /**
    * 获取图片路径
    */
    getImageCard () {
        $('#cradImg').unbind("change");
        $('.cradImg').bind('change', function (evt) {
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
                            console.log(ev, "ev")
                            if (ev.loaded == ev.total) {
                                $('.progress-bar')[0].style.width = '100%';
                            }
                            if ($('#progress')[0].style.display == 'none') {
                                $('#progress')[0].style.display = 'block';
                            } else {
                                console.log("jinlaile")
                                // console.log(((ev.loaded / ev.total) * 100).toFixed(0) + '%', 'ev');
                                //显示进度条
                                $('.progress-bar')[0].style.width = ((ev.loaded / ev.total) * 100).toFixed(0) + '%';
                                console.log($('.progress-bar')[0].style.width, "hhehehhe")
                                $('.progressText').text('进度: ' + ((ev.loaded / ev.total) * 100).toFixed(0) + '%')
                            }
                        };
                        return xhr;
                    },
                    success: function (res) {
                        console.log(res, "res1111")
                        calm.setState({
                            villageCradImg: res
                        })
                    }
                });
            }
        });
    }

    //添加乡村振兴图片
    addUploadFile = (type, url) => {
        console.log(url, "uuuu")
        var param = {
            "method": 'addUploadFile',
            "url": url,
            "villageId": this.state.accountData.villageId,
            "uploaderId": this.state.accountData.uid,
            "type": type == 0 ? 0 : 1
        };
        WebServiceUtil.requestLittleAntApi6013(JSON.stringify(param), {
            onResponse: result => {
            },
            onError: function (error) {
                Toast.fail(error, 1);
            }
        });
    }

    selectUploadFile = () => {
        var param = {
            "method": 'selectUploadFile',
            "villageId": this.state.accountData.villageId,
        };
        WebServiceUtil.requestLittleAntApi6013(JSON.stringify(param), {
            onResponse: result => {
                this.setState({
                    uploadFileList: result.response
                })
            },
            onError: function (error) {
                Toast.fail(error, 1);
            }
        });
    }


    //删除上传图片
    deleteUploadFile = (v) => {
        var param = {
            "method": 'deleteUploadFile',
            "id": v.id,
        };

        WebServiceUtil.requestLittleAntApi6013(JSON.stringify(param), {
            onResponse: result => {
                if (result.success) {
                    Toast.info("删除成功", 1)
                    this.selectUploadFile()
                }
            },
            onError: function (error) {
                Toast.fail(error, 1);
            }
        });
    }
    /**
    * 编辑课程图片上传
    */
    courseImgUpdate () {
        $('#courseImgUpdate').unbind("change");
        $('.courseImgUpdate').bind('change', function (evt) {
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
                            console.log(ev, "ev")
                            if (ev.loaded == ev.total) {
                                $('.progress-bar')[0].style.width = '100%';
                            }
                            if ($('#progress')[0].style.display == 'none') {
                                $('#progress')[0].style.display = 'block';
                            } else {
                                console.log("jinlaile")
                                // console.log(((ev.loaded / ev.total) * 100).toFixed(0) + '%', 'ev');
                                //显示进度条
                                $('.progress-bar')[0].style.width = ((ev.loaded / ev.total) * 100).toFixed(0) + '%';
                                console.log($('.progress-bar')[0].style.width, "hhehehhe")
                                $('.progressText').text('进度: ' + ((ev.loaded / ev.total) * 100).toFixed(0) + '%')
                            }
                        };
                        return xhr;
                    },
                    success: function (res) {
                        console.log(res, "res1111")
                        calm.setState({
                            courseImgUpdate: res
                        })
                    }
                });
            }
        });
    }



    addInput = () => {
        this.state.addInputList.push({
            inputValue: "",
        })
        this.buildAddList()
    }
    //组名称改变
    inputOnChange = (index, value) => {
        this.state.addInputList[index].inputValue = value;
        this.buildAddList()
    }




    delList (index) {
        this.state.addInputList.splice(index, 1);
        this.buildAddList()
    }

    /**
    * 根据数
    */
    buildAddList () {
        var listArr = this.state.addInputList;
        var arr = [];
        listArr.forEach((v, i) => {
            console.log(v, "v")
            arr.push(<div className="listCont">
                <div>
                    <InputItem
                        placeholder="请输入组名称"
                        onChange={this.inputOnChange.bind(this, i)}
                        value={this.state.addInputList[i].inputValue}
                    >
                    </InputItem>
                    <span className="village-delete" onClick={calm.delList.bind(this, i)} style={{ display: i == 0 ? "none" : "inline-block" }}></span>
                </div>
            </div>)
        })
        this.setState({ inputDivs: arr })
    }

    submitInput = () => {
        var inputArr = []
        this.state.addInputList.forEach((v, i) => {
            inputArr.push(v.inputValue)
        })

        var submitFlag = true;
        for (var i = 0; i < inputArr.length; i++) {
            if (inputArr[i].length == 0) {
                submitFlag = false
                break
            }
        }
        if (!submitFlag) {
            Toast.fail('数据存在空值，请检查', 2)
            return
        }

        var param = {
            "method": 'createVillageGroup',
            "groupNames": inputArr.join(","),
            "villageId": this.state.accountData.villageId
        };
        WebServiceUtil.requestLittleAntApi6013(JSON.stringify(param), {
            onResponse: result => {
                this.getVillageGroupList(this.state.accountData.villageId)
                $(".villageMask").hide();
                $(".villageMaskInner").hide();
            },
            onError: function (error) {
                Toast.fail(error, 1);
            }
        });
    }

    inputTheirstFOnChange = (value) => {
        this.setState({
            inputFirstValue: value
        })
        console.log(value, "vvv")
    }


    execClick = () => {
        document.execCommand("copy");
    }


    execCopy = (event) => {
        var thisDiv = document.getElementById("textDiv2");
        if (this.isIE()) {
            if (window.clipboardData) {
                window.clipboardData.setData("Text", thisDiv.textContent);
                Toast.info("复制成功", 1)
                // alert(window.clipboardData.getData("Text"));
            }
        } else {
            event.preventDefault();
            if (event.clipboardData) {
                event.clipboardData.setData("text/plain", thisDiv.textContent);
                Toast.info("复制成功", 1)
                // alert(event.clipboardData.getData("text"));
            }
        }
    }

    isIE = () => {
        var input = window.document.createElement("input");
        //"!window.ActiveXObject" is evaluated to true in IE11
        if (window.ActiveXObject === undefined) return null;
        if (!window.XMLHttpRequest) return 6;
        if (!window.document.querySelector) return 7;
        if (!window.document.addEventListener) return 8;
        if (!window.atob) return 9;
        //"!window.document.body.dataset" is faster but the body is null when the DOM is not
        //ready. Anyway, an input tag needs to be created to check if IE is being
        //emulated
        if (!input.dataset) return 10;
        return 11;
    }

    inputOnvillageNameChange = (value) => {
        this.setState({
            villageName: value
        })
    }

    editorVillageName = () => {
        $(".editorPop").show();
        $(".villageMask").show();
    }

    editorCodeName = () => {
        $(".codePop").show();
        $(".villageMask").show();
    }

    editorGroupName = () => {
        var arrList = []
        this.state.villageGroupList.map((v, i) => {
            console.log(v, "v")
            arrList.push({
                inputValue: v.groupName
            })
        })
        console.log(arrList, "arrList")
        $(".villageMask").show();
        $(".popBox").show();
        $(".btnGroup").show();
        $(".btnSure").hide();
    }

    cancelGroupInput = () => {
        $(".villageMask").hide();
        $(".popBox").hide();
    }

    sureVillageName = () => {
        $(".villageMask").hide();
        $(".editorPop").hide();
        console.log(this.state.villageName)
    }
    cancelVillageName = () => {
        $(".villageMask").hide();
        $(".editorPop").hide();
        console.log("cancel", this.state.villageName)
    }
    sureCodeName = () => {
        $(".villageMask").hide();
        $(".codePop").hide();
        console.log(this.state.villageName)
    }
    cancelCodeName = () => {
        $(".villageMask").hide();
        $(".codePop").hide();
        console.log("cancel", this.state.villageName)
    }


    addCourse = () => {
        this.setState({
            courseNameChangeValue: "",
            teacherChangeValue: "",
            coursePlaceChangeValue: "",
            date: "",
            dateEnd: "",
            courseImgUp: "",
        })
        $(".coursePop").show();
        $(".villageMask").show();
    }

    sureCourseData = () => {
        if (this.state.courseNameChangeValue == "" || this.state.courseNameChangeValue == undefined) {
            Toast.info("请输入课程名称", 1)
            return
        }
        if (this.state.teacherChangeValue == "" || this.state.teacherChangeValue == undefined) {
            Toast.info("请输入教师名称", 1)
            return
        }
        if (this.state.coursePlaceChangeValue == "" || this.state.coursePlaceChangeValue == undefined) {
            Toast.info("请输入上课地点", 1)
            return
        }
        if (this.state.date == "" || this.state.date == undefined) {
            Toast.info("请选择上课时间", 1)
            return
        }
        if (this.state.dateEnd == "" || this.state.dateEnd == undefined) {
            Toast.info("请选择下课时间", 1)
            return
        }
        if (this.state.courseImgUp == "" || this.state.courseImgUp == undefined) {
            Toast.info("请上传课程封面", 1)
            return
        }
        this.createVillageCourse()

    }

    createVillageCourse = () => {
        var param = {
            "method": 'createVillageCourse',
            "villageId": this.state.accountData.villageId,
            "courseName": this.state.courseNameChangeValue,
            "tearcherName": this.state.teacherChangeValue,
            "classTime": formatTime(this.state.date, "yyyy-MM-dd HH:mm"),
            "endTime": formatTime(this.state.dateEnd, "yyyy-MM-dd HH:mm"),
            "classAddress": this.state.coursePlaceChangeValue,
            "backgroundImg": this.state.courseImgUp
        };
        WebServiceUtil.requestLittleAntApi6013(JSON.stringify(param), {
            onResponse: result => {
                this.getVillageCourseList(this.state.accountData.villageId)
                $(".coursePop").hide();
                $(".villageMask").hide();
            },
            onError: function (error) {
                Toast.fail(error, 1);
            }
        });
    }

    getVillageCourseList = (villageId) => {
        var param = {
            "method": 'getVillageCourseList',
            "villageId": villageId,
        };
        console.log(param, "param")
        WebServiceUtil.requestLittleAntApi6013(JSON.stringify(param), {
            onResponse: result => {
                console.log(result, "reree")
                this.setState({
                    villageCourseList: result.response
                })
            },
            onError: function (error) {
                Toast.fail(error, 1);
            }
        });
    }

    canceCourseData = () => {
        $(".coursePop").hide();
        $(".villageMask").hide();
    }


    inputOnCourseNameChange = (value) => {
        this.setState({
            courseNameChangeValue: value
        })
    }
    inputOnTeacherChange = (value) => {
        this.setState({
            teacherChangeValue: value
        })
    }
    inputOnCoursePlaceChange = (value) => {
        this.setState({
            coursePlaceChangeValue: value
        })
    }


    sumPeople = () => {
        this.setState({
            attType: "add",
            sumPeopleNameValue: ""
        }, () => {
            $(".attPop").show();
            $(".villageMask").show();
        })

    }

    sumPeopleName = () => {
        if (this.state.sumPeopleNameValue == "") {
            Toast.info("人数不能为空", 1)
            return
        }
        if (this.state.attType == "add") {
            this.createVillageAttend()
        } else {
            this.updateAttend()
        }
    }
    cancelPeopleName = () => {
        $(".attPop").hide();
        $(".villageMask").hide();
    }


    appendImage = (imagePath) => {
        var editorImageDiv = $('<image className="editor_image" />').attr('src', imagePath);
        editorImageDiv.attr('cover', imagePath);
        $('#editor_box').append(editorImageDiv);
    }

    inputSumPeopleNameChange = (value) => {
        this.setState({
            sumPeopleNameValue: value
        })
    }

    pushNotifyData = () => {
        $(".notifyPop").show();
        $(".villageMask").show();
        var url = "http://192.168.50.73:6443/richTextEditorVillage/?loginUserId=" + this.state.accountData.villageId
        $(".pushNotify").attr("src", url)
    }
    pushNotifyDataArtical = () => {
        $(".notifyArticalPop").show();
        $(".villageArticalMask").show();
        var url = "http://192.168.50.73:6443/richTextEditorVillageArtical/?loginUserId=" + this.state.accountData.villageId
        $(".pushArtical").attr("src", url)
    }

    updateGroupName = (v) => {
        this.setState({
            groupPeopleNameValue: v.groupName,
            currentGroupId: v.id
        })
        $(".groupNamePop").show();
        $(".villageMask").show();
    }


    showListAlert = (v) => {
        var phoneType = navigator.userAgent;
        var phone;
        if (phoneType.indexOf('iPhone') > -1 || phoneType.indexOf('iPad') > -1) {
            phone = 'ios'
        } else {
            phone = 'android'
        }
        var _this = this;
        const alertInstance = alert('您确定删除该组吗?', '', [
            { text: '取消', onPress: () => console.log('cancel'), style: 'default' },
            { text: '确定', onPress: () => _this.deleteGroupName(v) },

        ], phone);
    }

    deleteGroupName = (v) => {
        this.setState({
            currentGroupId: v.id
        }, () => {
            var param = {
                "method": 'deleteVillageGroup',
                "id": this.state.currentGroupId,
            };
            console.log(param, "param")
            WebServiceUtil.requestLittleAntApi6013(JSON.stringify(param), {
                onResponse: result => {
                    this.getVillageGroupList(this.state.accountData.villageId)
                },
                onError: function (error) {
                    Toast.fail(error, 1);
                }
            });

        })
        console.log(v, "v")
    }

    sureGroupName = () => {
        var param = {
            "method": 'updateVillageGroup',
            "id": this.state.currentGroupId,
            "groupName": this.state.groupPeopleNameValue
        };
        WebServiceUtil.requestLittleAntApi6013(JSON.stringify(param), {
            onResponse: result => {
                $(".villageMask").hide();
                $(".villageMaskInner").hide();
                this.getVillageGroupList(this.state.accountData.villageId)
            },
            onError: function (error) {
                Toast.fail(error, 1);
            }
        });

    }

    cancelGroupName = () => {
        $(".groupNamePop").hide();
        $(".villageMask").hide();
    }


    getVillageGroupList = (villageId) => {
        var param = {
            "method": "getVillageGroupList",
            "villageId": villageId,
        };
        WebServiceUtil.requestLittleAntApi6013(JSON.stringify(param), {
            onResponse: (res) => {
                if (res.success) {
                    this.setState({
                        villageGroupList: res.response
                    })
                }

            },
            onError: function (error) {
                // Toast.fail(error, 1);
            }
        });
    }

    inputGroupNameChange = (value) => {
        this.setState({
            groupPeopleNameValue: value
        })
    }

    upDateVillCourse = (v) => {
        this.setState({
            villCourseId: v.id,
            VillCourse: v,
            updateCoursePlaceValue: v.classAddress,
            courseImgUpdate: v.backgroundImg,
            dateUpdateValue: v.classTime,
            dateUpdateValueEnd: v.endTime ? v.endTime : "",
            updateCourseNameValue: v.courseName,
            updateTeacherValue: v.teacherName,
        }, () => {
            console.log(this.state.VillCourse, "VillCourse")
        })
        $(".courseUpdatePop").show();
        $(".villageMask").show();
    }

    sureCourseDataUpdate = () => {
        this.updateVillageCourse();
    }

    canceCourseDataUpdate = () => {
        $(".courseUpdatePop").hide();
        $(".villageMask").hide();
    }

    updateCourseNameChange = (value) => {
        this.setState({
            updateCourseNameValue: value
        })
    }
    updateTeacherChange = (value) => {
        this.setState({
            updateTeacherValue: value
        })
    }
    updateCoursePlaceChange = (value) => {
        this.setState({
            updateCoursePlaceValue: value
        })
    }

    updateVillageCourse = () => {
        var param = {
            "method": "updateVillageCourse",
            "id": this.state.villCourseId,
            "courseName": this.state.updateCourseNameValue,
            "tearcherName": this.state.updateTeacherValue,
            "classTime": WebServiceUtil.formatAllTime(this.state.dateUpdateValue),
            "endTime": WebServiceUtil.formatAllTime(this.state.dateUpdateValueEnd),
            "classAddress": this.state.updateCoursePlaceValue,
            "backgroundImg": this.state.courseImgUpdate,
        };
        console.log(param, "param")
        WebServiceUtil.requestLittleAntApi6013(JSON.stringify(param), {
            onResponse: (res) => {
                if (res.success) {
                    this.getVillageCourseList(this.state.accountData.villageId)
                    $(".courseUpdatePop").hide();
                    $(".villageMask").hide();
                }

            },
            onError: function (error) {
                // Toast.fail(error, 1);
            }
        });
    }

    showCourseAlert = (v) => {
        var phoneType = navigator.userAgent;
        var phone;
        if (phoneType.indexOf('iPhone') > -1 || phoneType.indexOf('iPad') > -1) {
            phone = 'ios'
        } else {
            phone = 'android'
        }
        var _this = this;
        const alertInstance = alert('您确定删除该课程吗?', '', [
            { text: '取消', onPress: () => console.log('cancel'), style: 'default' },
            { text: '确定', onPress: () => _this.deleteVillCourse(v) },

        ], phone);
    }


    deleteVillCourse = (v) => {
        var param = {
            "method": "deleteVillageCourse",
            "id": v.id,
        };
        console.log(param, "param")
        WebServiceUtil.requestLittleAntApi6013(JSON.stringify(param), {
            onResponse: (res) => {
                if (res.success) {
                    this.getVillageCourseList(this.state.accountData.villageId)
                }
            },
            onError: function (error) {
                // Toast.fail(error, 1);
            }
        });
    }

    getVillageAttendList = () => {
        var param = {
            "method": "getVillageAttendList",
            "villageId": this.state.accountData.villageId,
        };
        console.log(param, "param")
        WebServiceUtil.requestLittleAntApi6013(JSON.stringify(param), {
            onResponse: (res) => {
                if (res.success) {
                    this.setState({
                        villageAttendList: res.response
                    })
                }

            },
            onError: function (error) {
                // Toast.fail(error, 1);
            }
        });
    }
    createVillageAttend = () => {
        var param = {
            "method": "createVillageAttend",
            "peopleNumber": this.state.sumPeopleNameValue,
            "villageId": this.state.accountData.villageId,
        };
        console.log(param, "param")
        WebServiceUtil.requestLittleAntApi6013(JSON.stringify(param), {
            onResponse: (res) => {
                if (res.success) {
                    $(".attPop").hide();
                    $(".villageMask").hide();
                    this.getVillageAttendList(this.state.accountData.villageId)
                }

            },
            onError: function (error) {
                // Toast.fail(error, 1);
            }
        });
    }
    updateVillageAttend = (v) => {
        console.log(v, "vo")
        this.setState({
            attType: "update",
            sumPeopleNameValue: v.peopleNumber,
            updateAttendId: v.id,
        }, () => {
            $(".attPop").show();
            $(".villageMask").show();
        })
    }
    updateAttend = () => {
        var param = {
            "method": "updateVillageAttend",
            "id": this.state.updateAttendId,
            "peopleNumber": this.state.sumPeopleNameValue,
        };
        console.log(param, "param")
        WebServiceUtil.requestLittleAntApi6013(JSON.stringify(param), {
            onResponse: (res) => {
                if (res.success) {
                    $(".attPop").hide();
                    $(".villageMask").hide();
                    this.getVillageAttendList(this.state.accountData.villageId);
                }

            },
            onError: function (error) {
                // Toast.fail(error, 1);
            }
        });
    }

    showAttAlert = (v) => {
        var phoneType = navigator.userAgent;
        var phone;
        if (phoneType.indexOf('iPhone') > -1 || phoneType.indexOf('iPad') > -1) {
            phone = 'ios'
        } else {
            phone = 'android'
        }
        var _this = this;
        const alertInstance = alert('您确定删除该考勤吗?', '', [
            { text: '取消', onPress: () => console.log('cancel'), style: 'default' },
            { text: '确定', onPress: () => _this.deleteVillageAttend(v) },

        ], phone);
    }

    deleteVillageAttend = (v) => {
        var param = {
            "method": "deleteVillageAttend",
            "id": v.id,
        };
        console.log(param, "param")
        WebServiceUtil.requestLittleAntApi6013(JSON.stringify(param), {
            onResponse: (res) => {
                if (res.success) {
                    this.getVillageAttendList(this.state.accountData.villageId)
                }
            },
            onError: function (error) {
                // Toast.fail(error, 1);
            }
        });
    }

    showNotifyAlert = (v) => {
        var phoneType = navigator.userAgent;
        var phone;
        if (phoneType.indexOf('iPhone') > -1 || phoneType.indexOf('iPad') > -1) {
            phone = 'ios'
        } else {
            phone = 'android'
        }
        var _this = this;
        const alertInstance = alert('您确定删除该通知吗?', '', [
            { text: '取消', onPress: () => console.log('cancel'), style: 'default' },
            { text: '确定', onPress: () => _this.toDelectNotify(v) },

        ], phone);
    }

    toDelectNotify = (v) => {
        var param = {
            "method": "deleteVillageNotice",
            "id": v.id,
        };
        console.log(param, "param")
        WebServiceUtil.requestLittleAntApi6013(JSON.stringify(param), {
            onResponse: (res) => {
                if (res.success) {
                    this.getVillageNoticeList(this.state.accountData.villageId);
                }
            },
            onError: function (error) {
                // Toast.fail(error, 1);
            }
        });
    }


    getHornerVillage = (villageId) => {
        var param = {
            "method": 'getHonorVillager',
            "villageId": villageId,
        };
        WebServiceUtil.requestLittleAntApi6013(JSON.stringify(param), {
            onResponse: result => {
                console.log(result)
                if (result.success) {
                    if (result.response.length === 0) {
                        // Toast.info('该村暂无荣誉村民!', 2);
                        this.setState({ showHornerEmpty: true })
                    } else {
                        let honorVillagerList = result.response;
                        this.setState({ honorVillagerList })
                        this.setState({ showHornerEmpty: false })
                    }

                }
            },
            onError: function (error) {
                Toast.fail(error, 1);
            }
        });
    }
    getLearningList = (villageId) => {
        var param = {
            "method": 'getLearningList',
            "villageId": villageId,
        };
        WebServiceUtil.requestLittleAntApi6013(JSON.stringify(param), {
            onResponse: result => {
                console.log(result)
                if (result.success) {
                    if (result.response.length === 0) {
                        this.setState({
                            showLearnEmpty: true
                        })
                    } else {
                        let learningList = result.response;
                        this.setState({ learningList });
                        this.setState({
                            showLearnEmpty: false
                        })
                    }

                }
            },
            onError: function (error) {
                Toast.fail(error, 1);
            }
        });
    }

    cardNameChange = (value) => {
        this.setState({
            cardNameValue: value
        })
    }

    cardTitleChange = (value) => {
        this.setState({
            cardTitleValue: value
        })
    }
    cardOrderChange = (value) => {
        this.setState({
            cardOrderValue: value
        })
    }

    cardNameChange = (value) => {
        this.setState({
            cardNameValue: value
        })
    }

    textareaOnChange = (value) => {
        this.setState({
            cardContentValue: value
        })
    }

    getVillageVillageNewsByVillageId = () => {
        var param = {
            "method": 'getVillageVillageNewsByVillageId',
            "villageId": this.state.accountData.villageId,
            "pageNo": -1,
        };
        WebServiceUtil.requestLittleAntApi6013(JSON.stringify(param), {
            onResponse: result => {
                console.log(result)
                if (result.success) {
                    this.setState({
                        villageNewsHistory: result.response
                    })
                }
            },
            onError: function (error) {
                Toast.fail(error, 1);
            }
        });
    }

    updateCardInfo = () => {

        if (this.state.cardNameValue == "") {
            Toast.info("请输入县级名称", 1)
            return
        }
        if (this.state.villageCradImg == "") {
            Toast.info("请上传照片", 1)
            return
        }
        if (this.state.cardTitleValue == "") {
            Toast.info("请输入标题", 1)
            return
        }

        if (this.state.cardContentValue == "") {
            Toast.info("请输入内容", 1)
            return
        }
        if (this.state.cardOrderValue == "") {
            Toast.info("请输入村牌序号", 1)
            return
        }
        var param = {
            "method": 'createVillageBrand',
            "villageId": this.state.accountData.villageId,
            "countyName": this.state.cardNameValue,
            "content": this.state.cardContentValue,
            "brandMac": this.state.cardOrderValue,
            "title": this.state.cardTitleValue,
            "backgroundImg": this.state.villageCradImg,
        };
        WebServiceUtil.requestLittleAntApi6013(JSON.stringify(param), {
            onResponse: result => {
                console.log(result)
                if (result.success) {
                    Toast.info("绑定成功", 1)
                    this.setState({
                        "cardNameValue": "",
                        "cardContentValue": "",
                        "cardOrderValue": "",
                        "cardTitleValue": "",
                        "villageCradImg": ""
                    })

                }
            },
            onError: function (error) {
                Toast.fail(error, 1);
            }
        });
    }


    exitLoginAlert = () => {
        var phoneType = navigator.userAgent;
        var phone;
        if (phoneType.indexOf('iPhone') > -1 || phoneType.indexOf('iPad') > -1) {
            phone = 'ios'
        } else {
            phone = 'android'
        }
        var _this = this;
        const alertInstance = alert('您确定退出登录吗?', '', [
            { text: '取消', onPress: () => console.log('cancel'), style: 'default' },
            { text: '确定', onPress: () => _this.exitLogin() },

        ], phone);
    }


    exitLogin = () => {
        var url = WebServiceUtil.mobileServiceURL + "villageCardSystemLogin";
        window.location.href = url;
    }


    addArtical = () => {
        $(".pushArticalPop").show();
        $(".villageMask").show();
        var url = "http://192.168.50.73:6443/richTextEditorVillageArtical/?loginUserId=" + this.state.accountData.villageId
        $(".pushArtical").attr("src", url)
    }


    showAlertHistory = (v) => {
        var phoneType = navigator.userAgent;
        var phone;
        if (phoneType.indexOf('iPhone') > -1 || phoneType.indexOf('iPad') > -1) {
            phone = 'ios'
        } else {
            phone = 'android'
        }
        var _this = this;
        const alertInstance = alert('您确定删除该村史村情吗?', '', [
            { text: '取消', onPress: () => console.log('cancel'), style: 'default' },
            { text: '确定', onPress: () => _this.deleteHistory(v) },

        ], phone);
    }
    deleteHistory = (v) => {
        var param = {
            "method": 'deleteVillageNews',
            "id": v.id,
        };
        console.log(param, "param")
        WebServiceUtil.requestLittleAntApi6013(JSON.stringify(param), {
            onResponse: result => {
                Toast.info("删除成功", 1)
                this.getVillageVillageNewsByVillageId()
            },
            onError: function (error) {
                Toast.fail(error, 1);
            }
        });
    }

    seeArticalDetail = (v) => {
        $(".villageHistoryPop").show();
        $(".villageMask").show();
        $(".villageHeader").html(v.title)
        $(".villageContent").html(v.content)
    }

    closePop = () => {
        $(".villageHistoryPop").hide();
        $(".popBox").hide();
        $(".editorPop").hide();
        $(".coursePop").hide();
        $(".codePop").hide();
        $(".courseUpdatePop").hide();
        $(".villageMask").hide();
        $(".villageNotifyPop").hide();
        $(".attPop").hide();
        $(".pushArticalPop").hide();
        $(".groupNamePop").hide();
        $(".villageHistoryPop").hide();
    }

    seeNotifyDetail = (v) => {
        $(".villageNotifyPop").show();
        $(".villageMask").show();
        $(".notifyHeader").html(v.noticeTitle)
        $(".notifyContent").html(v.noticeContent)
    }
    render () {
        return (
            <div id="VillageCardSystemHome" style={{
                height: document.body.clientHeight
            }}>
                <div id="progress" style={{ display: "none" }}>
                    <div className="progress">
                        <div className="progress-bar" style={{ width: 0 }}></div>
                    </div>
                    <div className="progressText">进度: 0%</div>
                </div>

                <div className='my_flex wrap'>
                    <div className='leftBox'>
                        <div className='myMsg my_flex'>
                            <div className="villagelogo">
                                <img src={require("../img/home-user.png")} alt="" />
                                <span>村村向上</span>
                            </div>
                        </div>
                        <div className='leftAccordion'>
                            <div>
                                <div className="select memberList allClassName" onClick={this.onChangeLeft.bind(this, 0)}><i className="home-Members"></i>成员列表</div>
                                <div className="villageHistory allClassName" onClick={this.onChangeLeft.bind(this, 3)}><i className="home-history"></i>新村新貌</div>
                                <div className="articalLookThrough allClassName" onClick={this.onChangeLeft.bind(this, 1)}><i className="home-audit"></i>文章审核</div>
                                <div className="lookThrough" style={{ display: "none" }}>
                                    {
                                        this.state.articalType.map((v, i) => {
                                            return <div className={v.active ? "haha" : "hehe"} onClick={this.clickArticalItem.bind(this, v)}>{v.title}</div>
                                        })
                                    }
                                </div>
                                <div className="villageCardEdit allClassName" onClick={this.onChangeLeft.bind(this, 2)}><i className="home-editor"></i>村牌编辑</div>
                                <div className="cardEdit" style={{ display: "none" }}>
                                    {
                                        this.state.editCardType.map((v, i) => {
                                            return <div className={v.active ? "haha" : "hehe"} onClick={this.clickCardItem.bind(this, v)}>{v.title}</div>
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                        <div className='quiteBtn'>
                            管理员
                            <span onClick={this.exitLoginAlert}></span>
                        </div>
                    </div>
                    <div className='rightBox rightBoxFirst'>
                        <div className="rightHeader my_flex">
                            <span>{this.state.villageName}</span>
                            <div className='btn'>
                                {/* <span onClick={this.editorVillageName}>编辑名称</span> */}
                                <span onClick={this.editorGroupName}>新增小组</span>
                                <span style={{display:"none"}} onClick={this.editorCodeName}>邀请码</span>
                            </div>
                        </div>
                        <div className="rightContent">
                            {
                                this.state.villageGroupList.map((v, i) => {
                                    return (
                                        <div className="right-item my_flex">
                                            <div className="item-left text_hidden">{v.groupName}</div>
                                            <div className="operation">
                                                <span className="village-edit" onClick={this.updateGroupName.bind(this, v)}></span>
                                                <span className="village-delete" onClick={this.showListAlert.bind(this, v)}></span>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                    <div className="rightBox rightBoxVillageHistory" style={{ display: "none" }}>
                        <div className="rightHeader my_flex">
                            <span>
                                {this.state.villageName}
                            </span>
                            <div className="btn">
                                <span onClick={this.addArtical}>
                                    发布文章
                                    </span>
                            </div>
                        </div>
                        <div className="rightContent">
                            {this.state.villageNewsHistory.map((v, i) => {
                                return (
                                    <div className="right-item my_flex" >
                                        <div className="item-left text_hidden" onClick={this.seeArticalDetail.bind(this, v)}><span className="Information-show">{v.title}</span></div>
                                        {/* <div dangerouslySetInnerHTML={{ __html:v.content }}>
                                             </div> */}
                                        <div className="operation">
                                            <span className="village-delete" onClick={this.showAlertHistory.bind(this, v)}></span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                        <div>

                        </div>
                    </div>
                    <div className="rightBox rightBoxSecond" style={{ display: "none" }}>
                        <div className="rightHeader my_flex">
                            <span>
                                {this.state.villageName}
                            </span>
                        </div>
                        <iframe src="" className="iframeDiv" frameborder="0"></iframe>
                    </div>
                    <div className="rightBox rightBoxThird" style={{ display: "none" }}>
                        <div className="bindCard" >
                            <div className="editCont editCont-Notitle">
                                <div className="bindCard-item">
                                    <div className="bindCard-itemLeft">县级名称</div>
                                    <InputItem
                                        placeholder="请输入名称"
                                        onChange={this.cardNameChange}
                                        value={this.state.cardNameValue}
                                    />
                                </div>
                                <div className="bindCard-item">
                                    <div className="bindCard-itemLeft">上传照片</div>
                                    <div className="parentDiv">
                                        <button className="editBtn"></button>
                                        <input className="calm40 cradImg" name="cradImg" id="cradImg" onClick={this.getImageCard} type="file" accept="image/jpg/png/jpeg" class="hidd" />
                                        <span style={{ display: this.state.villageCradImg == "" ? "none" : "inline-block" }} className="photo-add">
                                            <img src={this.state.villageCradImg} />
                                        </span>
                                    </div>
                                </div>
                                <div className="bindCard-item">
                                    <div className="bindCard-itemLeft">乡村标题</div>
                                    <InputItem
                                        placeholder="村标题"
                                        onChange={this.cardTitleChange}
                                        value={this.state.cardTitleValue}
                                    />
                                </div>
                                <div className="bindCard-item">
                                    <div className="bindCard-itemLeft">简介内容</div>
                                    <TextareaItem
                                        rows={2}
                                        placeholder="输入内容"
                                        labelNumber={2}
                                        value={this.state.cardContentValue}
                                        onChange={calm.textareaOnChange}
                                    />
                                </div>
                                <div className="bindCard-item">
                                    <div className="bindCard-itemLeft">村牌序号</div>
                                    <InputItem
                                        placeholder="村牌序号"
                                        onChange={this.cardOrderChange}
                                        value={this.state.cardOrderValue}
                                    />
                                </div>
                            </div>

                            <div className="submitBtn">
                                <span onClick={this.updateCardInfo}>绑定</span>
                            </div>
                        </div>
                        <div className="villageImg" style={{ display: "none" }}>
                            <div className="rightHeader my_flex">
                                <span>{this.state.villageName}</span>
                                <div className="btn">
                                    <span>
                                        上传
                                        <input type="file" id="upload" style={{ display: "none" }} />
                                        <div className="parentDiv file-input">
                                            <input className="calm40 upload_image_ upload-topBtn" name="upload_image_" id="upload_image_" onClick={this.getImage} type="file" accept="image/jpg/png/jpeg" class="hidd" />
                                        </div>
                                    </span>
                                </div>
                            </div>
                            <div className="rightContent">
                                <div id="image_box">
                                    {
                                        calm.state.uploadFileList.map((v, i) => {
                                            var arr = v.url.split("&");
                                            var type;
                                            if (arr.length == 2) {
                                                type = arr[0].split(".");
                                                type = type[type.length - 1]
                                            } else {
                                                type = arr[0][arr.length - 1]
                                            }
                                            console.log(type, "V")
                                            return (
                                                <div className="item-imageBox">
                                                    {
                                                        type == "mp4" ?
                                                            <div className="item-imageBoxN">
                                                                <video src={v.url.split("&")[0]}></video>
                                                                <span className="village-imgDelete" onClick={this.deleteUploadFile.bind(this, v)}></span>
                                                            </div>
                                                            :
                                                            <div className="item-imageBoxN">
                                                                <img src={v.url} alt="" />
                                                                <span className="village-imgDelete" onClick={this.deleteUploadFile.bind(this, v)}></span>
                                                            </div>
                                                    }

                                                </div>
                                            )
                                        })
                                    }

                                </div>
                            </div>
                        </div>
                        <div className="dangke" style={{ display: "none" }}>

                            <div className="rightHeader my_flex">
                                <span>
                                    {this.state.villageName}
                                </span>
                                <div className="btn">
                                    <span onClick={this.addCourse}>
                                        添加课程
                                    </span>
                                </div>
                            </div>
                            <div className="rightContent">
                                {this.state.villageCourseList.map((v, i) => {
                                    return (
                                        <div className="right-item my_flex">
                                            <img src={v.backgroundImg} alt="" />
                                            <div className="flex_1 content">
                                                <div className="title text_hidden">{v.courseName}</div>
                                                <div className="content-main text_hidden">{v.teacherName}</div>
                                                <div className="time text_hidden">
                                                    <span>{v.classAddress}</span>
                                                    <span className="timeRight">{WebServiceUtil.formatAllTime(v.classTime)}</span>
                                                </div>
                                            </div>
                                            <div className="operation">
                                                <span className="village-edit" onClick={this.upDateVillCourse.bind(this, v)}></span>
                                                <span className="village-delete" onClick={this.showCourseAlert.bind(this, v)}></span>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                        <div className="dangkeAtt" style={{ display: "none" }}>

                            <div className="rightHeader my_flex">
                                <span>
                                    {this.state.villageName}
                                </span>
                                <div className="btn">
                                    <span onClick={this.sumPeople}>
                                        打卡
                                    </span>
                                </div>
                            </div>
                            <div className="rightContent">
                                {this.state.villageAttendList.map((v, i) => {
                                    return (
                                        <div className="right-item my_flex">
                                            <div className="item-left text_hidden">实到人数{v.peopleNumber}</div>
                                            <div className="operation">
                                                <span className="village-edit" onClick={this.updateVillageAttend.bind(this, v)}></span>
                                                <span className="village-delete" onClick={this.showAttAlert.bind(this, v)}></span>
                                            </div>
                                        </div>
                                    )
                                })}

                            </div>
                        </div>
                        <div className="pushNotify" style={{ display: "none" }}>
                            <div className="rightHeader my_flex">
                                <span>
                                    {this.state.villageName}
                                </span>
                                <div className="btn">
                                    <span onClick={this.pushNotifyData}>
                                        发布通知
                                    </span>
                                </div>
                            </div>
                            <div className="rightContent">
                                {
                                    this.state.villageNotifyList.map((v, i) => {
                                        return (
                                            <div className="right-item my_flex" >
                                                <div className="item-left text_hidden" onClick={this.seeNotifyDetail.bind(this, v)}>
                                                    <span className="Information-show">{v.noticeTitle}</span>
                                                </div>
                                                <div className="operation">
                                                    <span className="village-delete" onClick={this.showNotifyAlert.bind(this, v)}></span>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                        <div className="hornorVillages" style={{ display: "none" }}>
                            <div className="rightHeader my_flex">
                                <span>
                                    {this.state.villageName}
                                </span>
                            </div>
                            <div className="rightContent">
                                <div className="emptyDiv">
                                    <div style={{ display: this.state.showHornerEmpty ? "block" : "none" }}>
                                        <div className="emptyIcon"></div>
                                        暂无荣誉村名哟
                                    </div>
                                </div>
                                <div style={{ display: this.state.showHornerEmpty ? "none" : "block" }}>
                                    {
                                        this.state.honorVillagerList.map((v, i) => {
                                            return (
                                                <div className="item-imageBox">
                                                    <div className="item-imageBoxN">
                                                        <img src={v.avatar} />
                                                        <span className="ranking">{i + 1}</span>
                                                    </div>
                                                    <div className="hornor-name">{v.userName}</div>
                                                </div>
                                            );
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="learnList" style={{ display: "none" }}>
                            <div className="rightHeader my_flex">
                                <span>
                                    {this.state.villageName}
                                </span>
                            </div>
                            <div className="rightContent">

                                    {
                                        this.state.learningList.map((v, i) => {
                                            return (
                                                <div className="right-item">
                                                <table className="learnListTable">
                                                    <tr>
                                                        <td className="learnListName text_hidden">{"第" + (i + 1) + "名"}</td>
                                                        <td className="learnListGroup text_hidden">{v.gradeName}</td>
                                                        <td className="learnListNumber text_hidden">{v.sum}</td>
                                                    </tr>
                                                </table>
                                                </div>
                                            );
                                        })
                                    }

                                <div className="emptyDiv">
                                    <div style={{ display: this.state.showLearnEmpty ? "block" : "none" }}>
                                        <div className="emptyIcon"></div>
                                        暂无学习榜
                                    </div>

                                </div>

                            </div>
                        </div>
                    </div>
                </div>


                <div className="villageMask" onClick={this.closePop} style={{ display: "none" }} ></div>
                {/* 编辑分组 */}
                <div className='popBox villageMaskInner' style={{ display: "none" }} >
                    <div className="popBox-wrap">
                        <div className="editHeader">
                            编辑分组
                        </div>
                        <div className="editCont">
                            <div>
                                {this.state.inputDivs}
                                <span className="editBtn" onClick={this.addInput}>
                                </span>

                            </div>
                        </div>
                        <div className='submitBtn btnGroup' style={{ display: "none" }}>
                            <div className="my_flex">
                                <span onClick={this.submitInput}>确定</span>
                                <span onClick={this.cancelGroupInput}>取消</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 编辑名称 */}
                <div className="editorPop villageMaskInner" style={{ display: "none" }}>
                    <div className="editHeader">
                        编辑名称
                    </div>
                    <InputItem
                        placeholder="请输入村名称"
                        onChange={this.inputOnvillageNameChange}
                        value={this.state.villageName}
                    >
                    </InputItem>
                    <div className='submitBtn'>
                        <div className='my_flex'>
                            <span onClick={this.sureVillageName}>确定</span>
                            <span onClick={this.cancelVillageName}>取消</span>
                        </div>
                    </div>
                </div>

                {/* 邀请码 */}
                <div className="codePop villageMaskInner" style={{ display: "none" }}>
                    <div className="editHeader">
                        邀请码
                                </div>
                    <div className="editCont">
                        <div id="textDiv2" className="InviteCode">{this.state.accountData.villageId}</div>
                        <a className="copyBtn" onClick={this.execClick} onCopy={this.execCopy}>复制</a>
                        <div className='submitBtn'>
                            <div className='my_flex'>
                                <span onClick={this.sureCodeName}>确定</span>
                                <span onClick={this.cancelCodeName}>取消</span>
                            </div>
                        </div>
                    </div>
                </div>


                {/* 添加课程 */}
                <div className="coursePop villageMaskInner" style={{ display: "none" }}>
                    <div className="editHeader">
                        添加课程
                    </div>
                    <div className="editCont">
                        <div className="bindCard-item">
                            <div className="bindCard-itemLeft">课程名称</div>
                            <InputItem
                                placeholder="请输入组课程名称"
                                onChange={this.inputOnCourseNameChange}
                                value={this.state.courseNameChangeValue}
                            />
                        </div>
                        <div className="bindCard-item">
                            <div className="bindCard-itemLeft">授课教师</div>
                            <InputItem
                                placeholder="请输入授课教师"
                                onChange={this.inputOnTeacherChange}
                                value={this.state.teacherChangeValue}
                            />
                        </div>
                        <div className="bindCard-item">
                            <div className="bindCard-itemLeft">上课地点</div>
                            <InputItem
                                placeholder="请输入上课地点"
                                onChange={this.inputOnCoursePlaceChange}
                                value={this.state.coursePlaceChangeValue}
                            />
                        </div>
                        <div className="bindCard-item">
                            <div className="bindCard-itemLeft">上课时间</div>
                            <div className="bindCard-itemRight">
                                <div className="Date-Picker">
                                    <DatePicker
                                        value={this.state.date}
                                        onChange={date => this.setState({ date })}
                                    >
                                        <List.Item arrow="horizontal"></List.Item>
                                    </DatePicker>
                                </div>
                            </div>
                        </div>
                        <div className="bindCard-item">
                            <div className="bindCard-itemLeft">结束时间</div>
                            <div className="bindCard-itemRight">
                                <div className="Date-Picker">
                                    <DatePicker
                                        value={this.state.dateEnd}
                                        onChange={date => this.setState({ dateEnd: date })}
                                    >
                                        <List.Item arrow="horizontal"></List.Item>
                                    </DatePicker>
                                </div>
                            </div>
                        </div>
                        <div className="bindCard-item">
                            <div className="bindCard-itemLeft">课程封面</div>
                            <div className="bindCard-itemRight">
                                <div className="parentDiv">
                                    <button className="editBtn"></button>
                                    <input className="calm40 upload_image_course" name="upload_image_" id="upload_image_course" onClick={this.courseImgUp} type="file" accept="image/jpg/png/jpeg" class="hidd" />
                                    <span style={{ display: this.state.courseImgUp == "" ? "none" : "inline-block" }} className="photo-add">
                                        <img src={this.state.courseImgUp} />
                                    </span>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className='submitBtn'>
                        <div className='my_flex'>
                            <span onClick={this.sureCourseData}>确定</span>
                            <span onClick={this.canceCourseData}>取消</span>
                        </div>
                    </div>
                </div>

                {/* 编辑课程 */}
                <div className="courseUpdatePop villageMaskInner" style={{ display: "none" }}>
                    <div className="editHeader">
                        编辑课程
                    </div>
                    <div className="editCont">
                        <div className="bindCard-item">
                            <div className="bindCard-itemLeft">课程名称</div>
                            <InputItem
                                placeholder="请输入组课程名称"
                                onChange={this.updateCourseNameChange}
                                value={this.state.updateCourseNameValue}
                            />
                        </div>
                        <div className="bindCard-item">
                            <div className="bindCard-itemLeft">授课教师</div>
                            <InputItem
                                placeholder="请输入授课教师"
                                onChange={this.updateTeacherChange}
                                value={this.state.updateTeacherValue}
                            />
                        </div>
                        <div className="bindCard-item">
                            <div className="bindCard-itemLeft">上课地点</div>
                            <InputItem
                                placeholder="请输入上课地点"
                                onChange={this.updateCoursePlaceChange}
                                value={this.state.updateCoursePlaceValue}
                            />
                        </div>
                        <div className="bindCard-item">
                            <div className="bindCard-itemLeft">开课时间</div>
                            <div className="bindCard-itemRight">
                                <div className="Date-Picker">
                                    <DatePicker
                                        extra={WebServiceUtil.formatAllTime(this.state.dateUpdateValue)}
                                        value={this.state.dateUpdate}
                                        onChange={date => this.setState({ dateUpdate: date, dateUpdateValue: formatTime(date, "yyyy-MM-dd HH:mm") })}
                                    >
                                        <List.Item arrow="horizontal"></List.Item>
                                    </DatePicker>
                                </div>
                            </div>
                        </div>
                        <div className="bindCard-item">
                            <div className="bindCard-itemLeft">结束时间</div>
                            <div className="bindCard-itemRight">
                                <div className="Date-Picker">
                                    <DatePicker
                                        extra={WebServiceUtil.formatAllTime(this.state.dateUpdateValueEnd)}
                                        value={this.state.dateUpdateEnd}
                                        onChange={date => this.setState({ dateUpdateEnd: date, dateUpdateValueEnd: formatTime(date, "yyyy-MM-dd HH:mm") })}
                                    >
                                        <List.Item arrow="horizontal"></List.Item>
                                    </DatePicker>
                                </div>
                            </div>
                        </div>
                        <div className="bindCard-item">
                            <div className="bindCard-itemLeft">课程封面</div>
                            <div className="bindCard-itemRight">
                                <div className="parentDiv">
                                    <button className="editBtn"></button>
                                    <input className="calm40 courseImgUpdate" name="courseImgUpdate" id="courseImgUpdate" onClick={this.courseImgUpdate} type="file" accept="image/jpg/png/jpeg" class="hidd" />
                                    <span
                                        // style={{ display: this.state.courseImgUpdate == "" ? "none" : "inline-block" }}
                                        className="photo-add">
                                        <img src={this.state.courseImgUpdate} />
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='submitBtn'>
                        <div className='my_flex'>
                            <span onClick={this.sureCourseDataUpdate}>确定</span>
                            <span onClick={this.canceCourseDataUpdate}>取消</span>
                        </div>
                    </div>
                </div>
                {/* 打卡*/}
                <div className="attPop villageMaskInner" style={{ display: "none" }}>
                    <div className="editHeader">
                        打卡
                    </div>
                    <div className="editCont">
                        <div className="bindCard-item">
                            <div className="bindCard-itemLeft">实到人数</div>
                            <InputItem
                                placeholder="请输入签到人数"
                                onChange={this.inputSumPeopleNameChange}
                                value={this.state.sumPeopleNameValue}
                            />
                        </div>
                    </div>
                    <div className='submitBtn'>
                        <div className='my_flex'>
                            <span onClick={this.sumPeopleName}>确定</span>
                            <span onClick={this.cancelPeopleName}>取消</span>
                        </div>
                    </div>
                </div>

                {/* 发布通知 */}
                <div className="notifyPop villageMaskInner" style={{ display: "none" }}>
                    <iframe src="" className="pushNotify" frameborder="0"></iframe>
                </div>
                {/* 发布文章 */}
                <div className="pushArticalPop villageMaskInner" style={{ display: "none" }}>

                    <iframe src="" className="pushArtical" frameborder="0"></iframe>
                </div>

                {/* 修改组名 */}
                <div className="groupNamePop villageMaskInner" style={{ display: "none" }}>
                    <div className="editHeader">
                        编辑组名
                    </div>
                    <div className="editCont">
                        <div className="bindCard-item">
                            <div className="bindCard-itemLeft">组名</div>
                            <InputItem
                                placeholder="请输入组名"
                                onChange={this.inputGroupNameChange}
                                value={this.state.groupPeopleNameValue}
                            />
                        </div>
                    </div>
                    <div className='submitBtn'>
                        <div className='my_flex'>
                            <span onClick={this.sureGroupName}>确定</span>
                            <span onClick={this.cancelGroupName}>取消</span>
                        </div>
                    </div>
                </div>

                {/* 新村新貌详情 */}
                <div className="villageHistoryPop villageMaskInner" style={{ display: "none" }}>
                    <div className="editHeader">
                        <div className="villageHeader">
                        </div>
                    </div>
                    <div className="editCont editCont-Nobottom">
                        <div className="villageContent">
                        </div>
                    </div>

                </div>
                {/* 通知详情 */}
                <div className="villageNotifyPop villageMaskInner" style={{ display: "none" }}>
                    <div className="editHeader">
                        <div className="notifyHeader">
                        </div>
                    </div>
                    <div className="editCont editCont-Nobottom">
                        <div className="notifyContent">
                        </div>
                    </div>
                </div>
            </div >
        )
    }
}