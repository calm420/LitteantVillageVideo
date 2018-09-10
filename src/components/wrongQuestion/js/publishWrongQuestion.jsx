import React from 'react';
import { List, TextareaItem, Tag, InputItem, Radio, Modal, Toast } from 'antd-mobile';
import { createForm } from 'rc-form';
import '../css/publishWrongQuestion.less'

const RadioItem = Radio.RadioItem;
const alert = Modal.alert;
const prompt = Modal.prompt;
var calm;
export default class publishWrongQuestion extends React.Component {
    constructor(props) {
        super(props);
        calm = this;
        this.state = {
            clientHeight: document.body.clientHeight,
            addNoteValue: "",
            tagData: [],
            tagText: [],
            projectData: [],
            tagChangeData: [],
            searchValue: "",
            theQuestionArr: [
                // {
                //     type: 0, //图片
                //     fatherType: 0,
                //     path: "http://60.205.86.217/upload8/2018-08-30/14/b02a7828-e89b-493e-a0ee-65a05b8f0da2.jpg"
                // }
            ],
            theQustionVideo: [
                // {
                //     type: 1,  //视频
                //     fatherType: 0,
                //     path: "http://60.205.86.217/upload8/2018-08-30/14/0e6f6e14-1a14-4f52-8096-431cd59ff6c3.mp4",
                //     coverPath: "http://60.205.86.217/upload8/2018-08-30/14/b02a7828-e89b-493e-a0ee-65a05b8f0da2.jpg"
                // }
            ],
            theAnswerArr: [
                // {
                //     type: 0, //图片
                //     fatherType: 1,
                //     path: "http://60.205.86.217/upload8/2018-08-30/14/b02a7828-e89b-493e-a0ee-65a05b8f0da2.jpg"
                // }
            ],
            theAnswerVideo: [
                //     {
                //     type: 1,  //视频
                //     fatherType: 1,
                //     path: "http://60.205.86.217/upload8/2018-08-30/14/0e6f6e14-1a14-4f52-8096-431cd59ff6c3.mp4",
                //     coverPath: "http://60.205.86.217/upload8/2018-08-30/14/b02a7828-e89b-493e-a0ee-65a05b8f0da2.jpg"
                // }
            ],
            alreadySelectData: [],
            activeData: [],
            noActiveData: [],
            allProjectData: [],
            activeStr: "",
            newB: [],
            newBStr: "",
            showDelete: 0
        }
    }

    componentDidMount() {
        document.title = '错题本';
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var userId = searchArray[0].split('=')[1];
        calm.setState({
            userId
        })
        calm.getProject(userId);
        /**
        * 防止软键盘挡住页面
        */
        var winHeight = $(window).height(); // 获取当前页面高度  
        $(window).resize(function () {
            var resizeHeight = $(this).height();
            if (winHeight - resizeHeight > 50) {
                // 软键盘弹出  
                $('body').css('height', winHeight + 'px');
            } else {
                //软键盘收起
                $('body').css('height', '100%');
            }
        });
        window.addEventListener('resize', this.onWindwoResize);
    }
    onWindwoResize() {
        $('body').height(calm.state.clientHeight).scrollTop(160)
    }

    //調用全屏視頻播放
    playVideo(url, event) {
        console.log(url);
        event.stopPropagation();
        var data = {
            method: 'playChatVideo',
            playUrl: url
        };
        window.parent.Bridge.callHandler(data, function () {
        }, function (error) {
            Toast.info('開啓視頻失敗!');
        });
    }

    //客户端打开预览图片
    showImage(rowData, url, event) {
        event.stopPropagation();
        var images = [];
        for (var k in rowData) {
            if (rowData[k].type == 0) {
                images.push(rowData[k].path);
            }
        }
        var data = {
            method: 'showPhoto',
            photos: images.join(","),
            currentPhoto: url
        };
        console.log(data)

        window.parent.Bridge.callHandler(data, function () {
        }, function (error) {
            Toast.info('打开图片失败!', 1);
        });
    }
    /**
     * 获取科目
     */
    getProject(userId) {
        var param = {
            "method": "getCourseByUserId",
            "userId": userId
        }
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                console.log(result, "result")
                if (result.success) {
                    calm.setState({
                        projectData: result.response
                    })
                }

            },
            onError: function (error) {
                Toast.fail(error, 1);
            }
        });
    }

    /**false
     * 去选择标签
     */
    nextStep() {
        if (calm.state.theQuestionArr.length == 0 && calm.state.theQustionVideo.length == 0) {
            Toast.info("请上传题干");
            return
        }

        $(".rightTag").show();
        $(".leftWrongQuestion").hide();
        $(".tabWrap .wrongQuestion").removeClass('active');
        $(".tabWrap .tag").addClass('active');
    }

    /**
     * 返回错题
     */
    backWrongQuestion() {
        $(".projectManage").hide();
        $(".rightTag").hide();
        $(".leftWrongQuestion").show();
        $(".tabWrap .tag").removeClass('active');
        $(".tabWrap .wrongQuestion").addClass('active');
    }

    upload_video_pic() {
        var video;//video标签
        var scale = 0.8;//第一帧图片与源视频的比例
        // var videoList = $(".upload_box_video");
        // console.log(videoList,'videoList');
        // for(var i=0;i<videoList.length;i++){
        //
        // }
        //ｖｉｄｅｏ标签
        console.log($('.upload_box_video'), "$('.upload_box_video')")
        video = $('.upload_box_video')[0];//赋值标签
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
                }
            });
        })
    }

    /**
     * 提交
     */
    saveWrongTopicBook() {

        var ImgArr = calm.state.theQuestionArr.concat(calm.state.theAnswerArr)
        var VidoeArr = calm.state.theQustionVideo.concat(calm.state.theAnswerVideo)
        var param = {
            "method": "saveWrongTopicBook",
            "circleOfFriendsJson": {
                "friendsAttachments": ImgArr.concat(VidoeArr),
                "fTags": calm.state.tagText,
                "uid": calm.state.userId,
                "type": 0,
                "mastery": calm.state.mastery,//0不懂   1略懂    2基本懂   3完全懂
                "mark": calm.state.addNoteValue,
                "cid": calm.state.cid //科目IDs
            }
        }
        console.log(param)
        // if(param.circleOfFriendsJson.friendsAttachments.length == 0){
        //     Toast.info("请选择科目")
        //     return
        // }
        if (param.circleOfFriendsJson.cid == undefined) {
            Toast.info("请选择科目", 1, "", false)
            return
        }
        if (param.circleOfFriendsJson.mastery == undefined) {
            Toast.info("请选择掌握程度")
            return
        }
        if (param.circleOfFriendsJson.fTags.length == 0) {
            Toast.info("请选择标签")
            return
        }
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                if (result.success) {
                    Toast.info("提交成功");
                    //关闭当前窗口，不刷新上一个页面
                    var data = {
                        method: 'finishForRefresh',
                    };
                    Bridge.callHandler(data, null, function (error) {
                        console.log(error);
                    });
                }
            },
            onError: function (error) {
                Toast.fail(error, 1);
            }
        });

        console.log(calm.state.addNoteValue, "value")
    }


    /**
     * 掌握程度
     */
    underChange = (item) => {
        console.log('value', item);
        this.setState({
            understandValue: item.value,
            mastery: item.label
        });
    };
    /**
     * 选择科目
     */
    projectChange = (item) => {
        this.setState({
            projectValue: item.courseName,
            cid: item.cid
        });
    };

    /**
     * 更多科目
     */
    moreProject() {
        calm.getCourseByUserId(calm.state.userId);
        calm.getCourseByUserIdAndDefianceCourse(calm.state.userId);
        $(".projectManage").slideDown();
        $(`.tagBack`).show();
        // var url = encodeURI(WebServiceUtil.mobileServiceURL + "projectManage?userId=" + calm.state.userId);
        // var data = {
        //     method: 'openNewPage',
        //     url: url
        // };
        // Bridge.callHandler(data, null, function (error) {
        //     window.location.href = url;
        // });
    }

    /**
     * 添加标签
     */
    addTag() {
        if (calm.state.cid == undefined) {
            Toast.info("请先选择科目", 1, "", false)
            return
        }
        $(`.calmTagDiv`).slideDown();
        $(`.tagBack`).show();
    }


    /**
     * 标签搜索框
     */
    searchInputChange = (value) => {
        calm.setState({
            searchValue: value
        }, () => {
            calm.getTagsByTagTitle()
        })
    }

    /**
     * 搜索关键字结果
     */
    getTagsByTagTitle() {
        if (calm.state.searchValue == "") {
            Toast.success("请输入搜索的关键词", 1, "", false)
            return;
        }
        calm.setState({ tagData: [] }, () => {
            var param = {
                "method": 'getTagsByTagTitle',
                "tagTitle": calm.state.searchValue,
                "pageNo": -1
            }
            WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
                onResponse: function (result) {
                    console.log(result, "resu")
                    if (result.msg == '调用成功' || result.success == true) {
                        if (!WebServiceUtil.isEmpty(result.response)) {
                            var arr = []
                            result.response.forEach(function (v, i) {
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
                if (v.tagId == data.tagId) {
                    calm.state.tagChangeData.splice(i, 1)
                    calm.setState({
                        tagChangeData: calm.state.tagChangeData
                    })
                }
            })
        }
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
     * 标签点击确定的回调
     */
    submitTagArr() {
        $(`.calmTagDiv`).slideUp();
        $(`.tagBack`).hide();
        var tagTextData = []
        console.log(calm.state.tagChangeData, "改变的标签")
        calm.state.tagChangeData.forEach((v, i) => {
            tagTextData.push({
                cid: calm.state.cid,
                tagTitle: v.tagTitle,
                uid: calm.state.userId,
            })
        })
        console.log(tagTextData, "tagTextData")
        calm.state.tagText = calm.state.tagText.concat(tagTextData);
        var arr = calm.state.tagText;
        calm.state.tagText = calm.makeArr(arr, "tagTitle")
        calm.setState({ tagData: [], tagChangeData: [], searchValue: "" })
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
     * 删除标签
     */
    deleteTag(item) {
        calm.state.tagText.forEach((v, i) => {
            if (item.tagTitle == v.tagTitle) {
                calm.state.tagText.splice(i, 1)
            }
            calm.setState({
                tagText: calm.state.tagText
            })
        })
    }

    /**
     * 添加题干
     */
    addTheQusetion() {
        var noom = "";
        var data = {
            method: 'toTakePhoto',
        };
        Bridge.callHandler(data, function (res) {
            // 拿到照片地址,显示在页面等待上传
            // var res = 'http:suhdjghjaasd?type=1'
            if (noom == "") {
                var newArr = res.split("?");
                var type = newArr[1].split("=")[1]
                // calm.upload_video_pic()
                if (type == 1) {
                    var imgUrl = newArr[0];
                    calm.state.theQuestionArr.push({
                        type: 0, //图片
                        fatherType: 0, //题干
                        path: imgUrl
                    })
                }
                if (type == 2) {
                    var videoUrl = newArr[0];
                    var firstUrl = newArr[2].split("=")[1]
                    calm.state.theQustionVideo.push(
                        {
                            type: 1,  //视频
                            fatherType: 0, //题干
                            path: videoUrl,
                            coverPath: firstUrl
                        }
                    );
                }
                calm.setState({
                    theQuestionArr: calm.state.theQuestionArr,
                    theQustionVideo: calm.state.theQustionVideo
                })
                noom = res;
            } else if (noom == res) {
                return
            }
        }, function (error) {
        });
    }

    /**
     * 上传答案
     */
    addTheAnswer() {
        var tempClam = "";
        var data = {
            method: 'toTakePhoto',
        };
        Bridge.callHandler(data, function (res) {
            if (tempClam == "") {
                // 拿到照片地址,显示在页面等待上传
                var newArr = res.split("?");
                var type = newArr[1].split("=")[1]
                if (type == 1) {
                    var imgUrl = newArr[0];
                    calm.state.theAnswerArr.push({
                        type: 0, //图片
                        fatherType: 1, //答案
                        path: imgUrl
                    })
                }
                if (type == 2) {
                    var videoUrl = newArr[0];
                    var firstUrl = newArr[2].split("=")[1]
                    calm.state.theAnswerVideo.push({
                        type: 1,  //视频
                        fatherType: 1,
                        path: videoUrl, //答案
                        coverPath: firstUrl
                    });
                }
                calm.setState({
                    theAnswerArr: calm.state.theAnswerArr,
                    theAnswerVideo: calm.state.theAnswerVideo
                })
                tempClam = res;
            } else if (tempClam == res) {
                return
            }

        }, function (error) {
            console.log(error);
        });
    }

    /**
     * 删除问题
     */
    deleteQuestion(i) {
        calm.state.theQuestionArr.splice(i, 1);
        calm.setState({
            theQuestionArr: calm.state.theQuestionArr
        })
        if (calm.state.theQuestionArr.length == 0 || calm.state.theQustionVideo == 0) {
            $(".addButtonFirst").addClass("empty")
        }

    }

    /**
     * 删除答案
     */
    deleteAnswer(i) {
        calm.state.theAnswerArr.splice(i, 1);
        calm.setState({
            theAnswerArr: calm.state.theAnswerArr
        })
        if (calm.state.theAnswerArr.length == 0 || calm.state.theAnswerVideo == 0) {
            $(".addButtonSecond").addClass("empty")
        }
    }

    /**
     * 删除答案视频
     */
    deleteAnswerVideo(i) {
        calm.state.theAnswerVideo.splice(i, 1);
        calm.setState({
            theAnswerVideo: calm.state.theAnswerVideo
        })
        if (calm.state.theAnswerArr.length == 0 || calm.state.theAnswerVideo == 0) {
            $(".addButtonSecond").addClass("empty")
        }
    }

    /**
     * 删除问题
     */
    deleteQuestionVideo(i) {
        calm.state.theQustionVideo.splice(i, 1);
        calm.setState({
            theQustionVideo: calm.state.theQustionVideo
        })
        if (calm.state.theQuestionArr.length == 0 || calm.state.theQustionVideo == 0) {
            $(".addButtonFirst").addClass("empty")
        }
    }

    /**
     * 科目管理部分
     */

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
    * 获取科目
    */
    getCourseByUserId(userId) {
        var param = {
            "method": "getCourseByUserId",
            "userId": userId
        }
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                if (result.success) {
                    var newArr = [],
                        oldArr = []
                    result.response.forEach((v, i) => {
                        newArr.push({
                            content: v.courseName,
                            flag: true,
                            id: v.cid,
                            uid: v.uid
                        })
                        oldArr.push({
                            content: v.courseName,
                            oldFlag: true,
                            id: v.cid,
                            uid: v.uid
                        })
                    })
                    calm.setState({
                        activeData: newArr, alreadySelectData: oldArr
                    })
                }
            },
            onError: function (error) {
                Toast.fail(error, 1);
            }
        });
    }
    /**
     * 添加科目
     */
    addProject() {
        var phoneType = navigator.userAgent;
        var phone;
        if (phoneType.indexOf('iPhone') > -1 || phoneType.indexOf('iPad') > -1) {
            phone = 'ios'
        } else {
            phone = 'android'
        }
        prompt('请输入科目名称', '(建议最多四个字)', [
            { text: '取消' },
            { text: '立即添加', onPress: value => calm.saveProjectName(value) },
        ], 'default', "", [], phone)
    }
    /**
     * 保存科目
     */
    saveProjectName(value) {
        if (value == "") {
            Toast.info("请输入科目名称")
            return
        }
        var param = {
            "method": "saveCourse",
            "courseJson": {
                "courseName": value,
                "courseType": 1,
                "uid": calm.state.userId
            }
        }
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                console.log(result, "resul")
                if (result.success) {
                    calm.state.allProjectData.push({
                        content: result.response.courseName,
                        flag: false,
                        id: result.response.cid,
                        uid: result.response.uid
                    });
                    calm.setState({
                        allProjectData: calm.state.allProjectData
                    })
                } else {
                    Toast.info(result.msg);
                }
            },
            onError: function (error) {
                Toast.fail(error, 1);
            }
        });
    }
    /**
     * 获取所有科目
     */
    getCourseByUserIdAndDefianceCourse(userId) {
        var param = {
            "method": "getCourseByUserIdAndDefianceCourse",
            "userId": userId
        }
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                console.log(result, "新的新的")
                if (result.success) {
                    var newArr = []
                    result.response.forEach((v, i) => {
                        newArr.push({
                            content: v.courseName,
                            flag: false,
                            cid: v.cid,
                            uid: v.uid
                        })
                    })
                    calm.setState({
                        noActiveData: newArr,
                    })
                }
            },
            onError: function (error) {
                Toast.fail(error, 1);
            }
        });
    }

    /**
     * 点击已科目选项
     * @param {*} e 
     */
    clickAlreadyData(v, index, e) {
        calm.state.alreadySelectData.forEach((item, i) => {
            if (v.content == item.content) {
                calm.state.alreadySelectData.splice(i, 1)
            }
        })
        calm.state.activeData.forEach((k, j) => {
            if (v.content == k.content) {
                calm.state.activeData[j].flag = false;
            }
        })
        calm.setState({ alreadySelectData: calm.state.alreadySelectData, activeData: calm.state.activeData })
    }

    /**
     * 点击高亮
     */
    clickAllProjectActive(v, index, e) {
        if (v.flag == true) {
            calm.state.activeData[index].flag = false;
            calm.state.alreadySelectData.forEach((item, i) => {
                if (v.content == item.content) {
                    calm.state.alreadySelectData.splice(i, 1)
                }
            })
        } else {
            calm.state.activeData[index].flag = true;
            calm.state.alreadySelectData.push({
                content: v.content,
                oldFlag: true,
                id: v.id,
                uid: v.uid
            })
        }
        calm.setState({
            activeData: calm.state.activeData,
            alreadySelectData: calm.state.alreadySelectData
        })

    }
    /**
     * 点击没有高亮的
     */
    clickNoActive(v, index) {
        console.log(v)
        if (v.flag == false) {
            calm.state.noActiveData[index].flag = true;
            calm.state.alreadySelectData.push({
                content: v.content,
                oldFlag: true,
                id: v.cid,
                uid: v.uid
            })
        } else {
            calm.state.noActiveData[index].flag = false;
            calm.state.alreadySelectData.forEach((item, i) => {
                if (v.content == item.content) {
                    calm.state.alreadySelectData.splice(i, 1)
                }
            })
        }

        calm.setState({
            noActiveData: calm.state.noActiveData,
            alreadySelectData: calm.state.alreadySelectData
        })

    }
    /**
     * 点击所有科目子选项
     */
    clickAllProject(v, index, e) {
        console.log(v, "shjkfghjkfghj")

        if (v.flag == false) {
            calm.state.allProjectData[index].flag = true;
            calm.state.alreadySelectData.push({
                content: v.content,
                oldFlag: true,
                id: v.id,
                uid: v.uid
            })
        } else {
            calm.state.allProjectData[index].flag = false;
            calm.state.alreadySelectData.forEach((item, i) => {
                if (v.content == item.content) {
                    calm.state.alreadySelectData.splice(i, 1)
                }
            })
        }
        calm.setState({
            allProjectData: calm.state.allProjectData,
            alreadySelectData: calm.state.alreadySelectData
        })

    }

    /**
     * 删除
     */
    deleAllProjectData(value, index, event) {
        console.log(value, "index1")
        event.stopPropagation();
        calm.state.allProjectData.forEach((item, i) => {
            if (value.content == item.content) {
                calm.state.allProjectData.splice(i, 1);
            }
        })
        calm.state.alreadySelectData.forEach((item, i) => {
            if (value.content == item.content) {
                calm.state.alreadySelectData.splice(i, 1);
            }
        })
        calm.setState({
            alreadySelectData: calm.state.alreadySelectData,
            allProjectData: calm.state.allProjectData
        })
        var param = {
            "method": "deleteCourse",
            "courseId": value.uid
        }
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                console.log(result, "新的新的")
                if (result.success) {
                    var newArr = []
                    result.response.forEach((v, i) => {
                        newArr.push({
                            content: v.courseName,
                            flag: false,
                            cid: v.cid,
                            uid: v.uid
                        })
                    })
                    calm.setState({
                        noActiveData: newArr,
                    })
                }
            },
            onError: function (error) {
                Toast.fail(error, 1);
            }
        });
    }

    /**
     * 删除
     */
    delenoActiveData(value, index, event) {
        console.log(value, "index2")
        event.stopPropagation();
        calm.state.noActiveData.forEach((item, i) => {
            if (value.content == item.content) {
                calm.state.noActiveData.splice(i, 1);
            }
        })
        calm.state.alreadySelectData.forEach((item, i) => {
            if (value.content == item.content) {
                calm.state.alreadySelectData.splice(i, 1);
            }
        })
        calm.setState({
            alreadySelectData: calm.state.alreadySelectData,
            noActiveData: calm.state.noActiveData
        })
        var param = {
            "method": "deleteCourse",
            "courseId": value.cid
        }
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                console.log(result, "新的新的")
                if (result.success) {
                    Toast.info("删除成功")
                }
            },
            onError: function (error) {
                Toast.fail(error, 1);
            }
        });
    }
    /**
     * 删除
     */
    deleteactiveData(value, index, event) {
        console.log(value, "index333")
        event.stopPropagation();
        calm.state.activeData.forEach((item, i) => {
            if (value.content == item.content) {
                calm.state.activeData.splice(i, 1);
            }
        })
        calm.state.alreadySelectData.forEach((item, i) => {
            if (value.content == item.content) {
                calm.state.alreadySelectData.splice(i, 1);
            }
        })
        calm.setState({
            alreadySelectData: calm.state.alreadySelectData,
            activeData: calm.state.activeData
        })
        var param = {
            "method": "deleteCourse",
            "courseId": value.id
        }
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                console.log(result, "新的新的")
                if (result.success) {
                    Toast.info("删除成功")
                }
            },
            onError: function (error) {
                Toast.fail(error, 1);
            }
        });
    }
    /**
     * 点击管理
     */
    manageProject() {
        calm.setState({
            showDelete: 1
        })
    }

    /**
     * 点击保存
     */
    saveProject() {
        var temoArr = [];
        calm.state.alreadySelectData.forEach((v, i) => {
            temoArr.push(v.id)
        })
        var param = {
            "method": "saveCourseAndUserId",
            "courseIds": temoArr.join(","),
            "uid": calm.state.userId
        }
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                if (result.success) {
                    Toast.info('保存成功', 1, "", false);
                    $(".projectManage").slideUp();
                    $(`.tagBack`).hide();
                    calm.getProject(calm.state.userId);
                }
            },
            onError: function (error) {
                Toast.fail(error, 1);
            }
        });
    }
    /**
     * 取消
     */
    cancleProject() {
        $(".projectManage").slideUp();
        $(`.tagBack`).hide();
        calm.setState({
            showDelete: 0
        })
    }
    render() {

        if (calm.state.theQuestionArr.length != 0 || calm.state.theQustionVideo != 0) {
            $(".addButtonFirst").removeClass("empty")
        }

        if (calm.state.theAnswerArr.length != 0 || calm.state.theAnswerVideo != 0) {
            $(".addButtonSecond").removeClass("empty")
        }

        const understandData = [
            {
                value: "不懂",
                label: "0"
            },
            {
                value: "略懂",
                label: "1"
            },
            {
                value: "基本懂",
                label: "2"
            },
            {
                value: "完全懂",
                label: "3"
            }
        ]
        const { understandValue, projectValue } = this.state;
        return (
            <div id="publishWrongQuestion" style={{ height: calm.state.clientHeight }}>
                <div className='tabWrap line_public'>
                    <span className="wrongQuestion active" onClick={calm.backWrongQuestion}>错题本</span>
                    <span className="tag" onClick={calm.nextStep}>标签</span>
                </div>
                <div className='tabCont'>
                    <div className="leftWrongQuestion">
                        <div className='cont'>
                            <div className='item'>
                                <div className='title'>上传题干</div>
                                {
                                    calm.state.theQuestionArr.map((v, i) => {
                                        return (
                                            <div className='imgDiv'>
                                                <img onClick={calm.showImage.bind(this, calm.state.theQuestionArr, v.path)} src={v.path} alt="" />
                                                <div className='delete'><span
                                                    onClick={calm.deleteQuestion.bind(this, i)}>删除</span></div>
                                            </div>
                                        )
                                    })
                                }
                                {
                                    calm.state.theQustionVideo.map((v, i) => {
                                        return (
                                            <div className='imgDiv'>
                                                <video onClick={calm.playVideo.bind(this, v.path)} poster={v.coverPath} src={v.path} alt="" controls />
                                                <div className='delete'><span
                                                    onClick={calm.deleteQuestionVideo.bind(this, i)}>删除</span></div>
                                            </div>
                                        )
                                    })
                                }
                                <div className='addButton addButtonFirst empty' onClick={calm.addTheQusetion}>+ 添加</div>
                            </div>
                            <div className='item'>
                                <div className='title'>上传正解</div>
                                {
                                    calm.state.theAnswerArr.map((v, i) => {
                                        return (
                                            <div className='imgDiv'>
                                                <img onClick={calm.showImage.bind(this, calm.state.theAnswerArr, v.path)} src={v.path} alt="" />
                                                <div className='delete'><span
                                                    onClick={calm.deleteAnswer.bind(this, i)}>删除</span></div>
                                            </div>
                                        )
                                    })
                                }
                                {
                                    calm.state.theAnswerVideo.map((v, i) => {
                                        return (
                                            <div className='imgDiv'>
                                                <video onClick={calm.playVideo.bind(this, v.path)} poster={v.coverPath} src={v.path} alt="" controls />
                                                <div className='delete'><span
                                                    onClick={calm.deleteAnswerVideo.bind(this, i)}>删除</span></div>
                                            </div>
                                        )
                                    })
                                }
                                <div className='addButton addButtonSecond empty' onClick={calm.addTheAnswer}>+ 添加</div>
                            </div>
                            <div className='item'>
                                <List renderHeader={() => '添加备注'}>
                                    <TextareaItem
                                        rows={5}
                                        count={30}
                                        placeholder={'添加备注内容'}
                                        onChange={v => calm.setState({
                                            addNoteValue: v
                                        })}
                                    />
                                </List>
                            </div>
                        </div>
                        <div className='nextBtn' onClick={calm.nextStep}><span>下一步</span></div>
                    </div>
                    <div className="rightTag" style={{ display: "none" }}>
                        <div className='cont'>
                            <div className="selectProject">
                                <div className="title">选择科目</div>
                                <List>
                                    {calm.state.projectData.map(i => (
                                        <RadioItem key={i.value}
                                            className={projectValue === i.courseName ? 'checked' : ''}
                                            checked={projectValue === i.courseName}
                                            onChange={() => this.projectChange(i)}>
                                            {i.courseName}
                                        </RadioItem>
                                    ))}
                                </List>
                                <span className='spanTag add' onClick={calm.moreProject}>更多科目</span>
                            </div>
                            <div className="knowDegree">

                                <List renderHeader={() => '掌握程度'}>
                                    {understandData.map(i => (
                                        <RadioItem key={i.value} className={understandValue === i.value ? "on" : ''}
                                            checked={understandValue === i.value}
                                            onChange={() => this.underChange(i)}>
                                            {i.value}
                                        </RadioItem>
                                    ))}
                                </List>
                            </div>
                            <div className='moreTag'>
                                <div className='title'>更多标签</div>
                                {
                                    calm.state.tagText.map((v, i) => {
                                        return (
                                            <div className="spanTag">
                                                <span>{v.tagTitle}</span>
                                                <span className="del_tag"
                                                    onClick={calm.deleteTag.bind(this, v)}>删除</span>
                                            </div>
                                        )
                                    })
                                }
                                {
                                    calm.state.tagText.length == 3 ? "" :
                                        <span className='addTag spanTag' onClick={calm.addTag}>添加标签</span>
                                }

                            </div>
                        </div>
                        {/* 添加标签 */}
                        <div className="tagBack" style={{
                            display: "none",
                        }}></div>
                        <div className={`calmTagDiv calmTagDivNew tagCont`}
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
                        <div className='nextBtn' onClick={calm.saveWrongTopicBook}><span>提交</span></div>
                    </div>

                </div>

                {/* <span>上传</span>
                <span>拍照</span>
                <span>返回</span> */}


                <div className="calmTagDivNew projectManage tagCont" style={{ display: 'none' }}>
                    <div className="cont projectDiv">
                        <div><div className='title'>已选科目</div>
                            {
                                calm.state.alreadySelectData.map((v, i) => {
                                    return (
                                        <span className={v.oldFlag ? "active spanTag" : "spanTag"} onClick={calm.clickAlreadyData.bind(this, v, i)}>{v.content}</span>
                                    )
                                })
                            }
                            <span className='spanTag add' onClick={calm.addProject}>+添加科目</span>
                        </div>
                        <div className="allProject">
                            <div className='title'>所有科目
                            <span onClick={calm.manageProject}>管理</span>
                            </div>
                            {/* 需要高亮的 */}
                            {
                                calm.state.activeData.map((v, i) => {
                                    return (
                                        <span className="fatherSpan">
                                            <span onClick={calm.clickAllProjectActive.bind(this, v, i)} className={v.flag ? "active spanTag" : "spanTag"} >{v.content}</span>
                                            {v.uid == 0 ? " " : <span className="delete del_tag" style={{ display: calm.state.showDelete == 0 ? "none" : "block" }} onClick={calm.deleteactiveData.bind(this, v, i)}>删除</span>}
                                        </span>
                                    )
                                })
                            }
                            {/* 除了高亮之后剩下的全部 */}
                            {
                                calm.state.noActiveData.map((v, i) => {
                                    return (
                                        <span className="fatherSpan">
                                            <span onClick={calm.clickNoActive.bind(this, v, i)} className={v.flag ? "active spanTag" : "spanTag"} >{v.content}</span>
                                            {v.uid == 0 ? "" : <span className="delete del_tag" style={{ display: calm.state.showDelete == 0 ? "none" : "block" }} onClick={calm.delenoActiveData.bind(this, v, i)}>删除</span>}
                                        </span>
                                    )
                                })
                            }
                            {/* 新添加的 */}
                            {
                                calm.state.allProjectData.map((v, i) => {
                                    return (
                                        <span className="fatherSpan">
                                            <span onClick={calm.clickAllProject.bind(this, v, i)} className={v.flag ? "active spanTag" : "spanTag"}>{v.content}</span>
                                            {v.uid == 0 ? "" : <span className="delete del_tag" style={{ display: calm.state.showDelete == 0 ? "none" : "block" }} onClick={calm.deleAllProjectData.bind(this, v, i)}>删除</span>}
                                        </span>
                                    )
                                })
                            }
                        </div>
                    </div>
                    <div className="bottomBox" ><span className="close" onClick={calm.cancleProject}>取消</span><span className="bind" onClick={calm.saveProject}>确定</span></div>
                </div>
            </div>
        )
    }
}