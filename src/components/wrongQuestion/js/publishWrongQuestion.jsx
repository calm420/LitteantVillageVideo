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
            showDelete: 0,
            challengeData: [],
            challengeValue: "",
            cheData: {},
            inputValue: "",
            allData: []
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
        calm.getCourseByUserIdAndDefianceCourseAll(userId)
        /**
        * 防止软键盘挡住页面
        */
        var winHeight = $(window).height(); // 获取当前页面高度
        $(window).resize(function () {
            var resizeHeight = $(this).height();
            if (winHeight - resizeHeight > 50) {
                // 软键盘弹出
                $('body').css('height', winHeight + 'px');
                $(".inner").css('margin-top', "-70px")
            } else {
                //软键盘收起
                $('body').css('height', '100%');
                $(".inner").css('margin-top', "0")
            }
        });


    }

    /**
     * 获取所有
     */
    getCourseByUserIdAndDefianceCourseAll(userId) {
        var param = {
            "method": "getCourseByUserIdAndDefianceCourseAll",
            "userId": userId
        }
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                if (result.success) {
                    var arr = [];
                    result.response.forEach((v, i) => {
                        arr.push(v.uid)
                    })
                    calm.setState({
                        allData: arr
                    })
                }

            },
            onError: function (error) {
                Toast.fail(error, 1);
            }
        });
    }

    //調用全屏視頻播放
    playVideo(url, event) {
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
            Toast.info("请上传题干", 1, "", false)
            // Toast.info("请上传题干");    
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
    /**
     * 提交
     */
    saveWrongTopicBook() {
        var ImgArr = calm.state.theQuestionArr.concat(calm.state.theAnswerArr)
        var VidoeArr = calm.state.theQustionVideo.concat(calm.state.theAnswerVideo)
        if ($.isEmptyObject(calm.state.cheData) == false && calm.state.cheData != undefined) {
            calm.state.tagText.push({
                cid: calm.state.cid,
                uid: calm.state.userId,
                tagTitle: calm.state.cheData.label
            })
        }
        var param = {
            "method": "saveWrongTopicBook",
            "circleOfFriendsJson": {
                "friendsAttachments": ImgArr.concat(VidoeArr),
                "fTags": calm.state.tagText,
                "uid": calm.state.userId,
                "type": 0,
                "mastery": calm.state.mastery,//0不懂   1略懂    2基本懂   3完全懂
                "mark": calm.state.addNoteValue.trim(),
                "cid": calm.state.cid //科目IDs
            }
        }
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
                    Toast.info("提交成功", 1);
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
    }


    /**
     * 掌握程度
     */
    underChange = (item) => {
        this.setState({
            understandValue: item.value,
            mastery: item.label
        });

        $(".knowDegree .am-radio-item").addClass('gray');
        $(".knowDegree .am-radio-item").eq(item.label).removeClass('gray');

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
        $(`.calmChaDiv`).slideDown();
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
        // if (calm.state.searchValue == "") {
        //     Toast.info("请输入搜索的关键词", 1, "", false)
        //     return;
        // }
        calm.setState({ tagData: [] }, () => {
            var param = {
                "method": 'getTagsByTagTitle',
                "tagTitle": calm.state.searchValue,
                "pageNo": -1
            }
            WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
                onResponse: function (result) {
                    if (result.msg == '调用成功' || result.success == true) {
                        if (!WebServiceUtil.isEmpty(result.response)) {
                            var arr = []
                            result.response.forEach(function (v, i) {
                                arr.push(<div>
                                    <Tag
                                        selected={false}
                                        onChange={calm.tagChange.bind(this, v)}
                                    >{v.tagTitle}</Tag>
                                    <span>{}</span>
                                </div>)
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
        calm.state.tagChangeData.forEach((v, i) => {
            tagTextData.push({
                cid: calm.state.cid,
                tagTitle: v.tagTitle,
                uid: calm.state.userId,
            })
        })
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
    deleteTag() {
        calm.setState({
            cheData: {}
        })
        // calm.state.tagText.forEach((v, i) => {
        //     if (item.tagTitle == v.tagTitle) {
        //         calm.state.tagText.splice(i, 1)
        //     }
        //     calm.setState({
        //         tagText: calm.state.tagText
        //     })
        // })
    }

    /**
     * 添加题干
     */
    addTheQusetion() {
        if(this.state.theQuestionArr.length + this.state.theQustionVideo.length >= 9){
            Toast.info('最多添加九个图片或视频!',1);
            return;
        }
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
        if(this.state.theAnswerArr.length + this.state.theAnswerVideo.length >= 9){
            Toast.info('最多添加九个图片或视频!',1);
            return;
        }
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
        $(".projectNme").show();
        $(".modalCont").css("overflow-y", "hidden");
        // var phoneType = navigator.userAgent;
        // var phone;
        // if (phoneType.indexOf('iPhone') > -1 || phoneType.indexOf('iPad') > -1) {
        //     phone = 'ios'
        // } else {
        //     phone = 'android'
        // }
        // prompt('请输入科目名称', '(建议最多四个字)', [
        //     { text: '取消' },
        //     { text: '立即添加', onPress: value => calm.saveProjectName(value) },
        // ], 'default', "", [], phone)
    }
    /**
     * 保存科目
     */
    saveProjectName() {
        if (calm.state.inputValue == "") {
            Toast.info("请输入科目名称")
            return
        }
        if (calm.state.inputValue.length > 4) {
            Toast.info('最多输入四个字', 1, "", false);
            return
        }
        var param = {
            "method": "saveCourse",
            "courseJson": {
                "courseName": calm.state.inputValue.trim(),
                "courseType": 1,
                "uid": calm.state.userId
            }
        }
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                if (result.success) {
                    calm.state.allProjectData.push({
                        content: result.response.courseName,
                        flag: false,
                        id: result.response.cid,
                        uid: result.response.uid
                    });
                    calm.getCourseByUserIdAndDefianceCourseAll(calm.state.userId)
                    calm.setState({
                        allProjectData: calm.state.allProjectData,
                        inputValue: "",
                        allData: calm.state.allData
                    })
                    $(".projectNme").hide();
                    $(".modalCont").css("overflow-y", "auto");
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
        calm.state.allProjectData.forEach((k, j) => {
            if (v.content == k.content) {
                calm.state.allProjectData[j].flag = false;
            }
        })
        calm.state.activeData.forEach((k, j) => {
            if (v.content == k.content) {
                calm.state.activeData[j].flag = false;
            }
        })
        calm.state.noActiveData.forEach((k, j) => {
            if (v.content == k.content) {
                calm.state.noActiveData[j].flag = false;
            }
        })
        calm.setState({
            alreadySelectData: calm.state.alreadySelectData,
            activeData: calm.state.activeData,
            noActiveData: calm.state.noActiveData,
            allProjectData: calm.state.allProjectData
        })
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
        console.log(value, "vvvv")
        event.stopPropagation();
       
        var param = {
            "method": "deleteCourse",
            "courseId": value.id
        }
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                if (result.success) {
                    Toast.info("删除成功",1);
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
                        allProjectData: calm.state.allProjectData,
            
                    })
                    calm.getCourseByUserIdAndDefianceCourseAll(calm.state.userId)
                    calm.setState({
                        allData: calm.state.allData
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
                if (result.success) {
                    Toast.info("删除成功",1);
                    calm.getCourseByUserIdAndDefianceCourseAll(calm.state.userId)
                    calm.setState({
                        allData: calm.state.allData
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
    deleteactiveData(value, index, event) {
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
                if (result.success) {
                    Toast.info("删除成功",1);
                    calm.getCourseByUserIdAndDefianceCourseAll(calm.state.userId)
                    calm.setState({
                        allData: calm.state.allData
                    })
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
            showDelete: 1,
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


    /**
    * 挑战搜索结果
    */
    getChasByContent() {
        if (calm.state.challengeValue.trim() == "") {
            Toast.info("请输入搜索的关键词", 1, "", false)
            return;
        }
        calm.setState({ challengeData: [] }, () => {
            var param = {
                "method": 'getTagsByTagTitle',
                "tagTitle": calm.state.challengeValue.trim(),
                "pageNo": -1
            }
            WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
                onResponse: function (result) {
                    if (result.msg == '调用成功' || result.success == true) {
                        if (!WebServiceUtil.isEmpty(result.response)) {
                            var arr = []
                            result.response.forEach(function (v, i) {
                                if (v.tagId == 0) {
                                    arr.push({
                                        value: v.tagId,
                                        label: v.tagTitle,
                                        extra: <div>{v.ftagContent}</div>
                                    })
                                    return;
                                }
                                arr.push(
                                    {
                                        value: v.tagId,
                                        label: v.tagTitle,
                                        extra: v.ftagContent
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
            calm.state.cheData = calm.state.cheData;
        }
        if (calm.state.cheData.value == 0) {
            calm.state.cheData.label = calm.state.cheData.label;
            // calm.state.cheData.extra = calm.state.chaContent;
        }
        calm.setState({ challengeData: [], challengeValue: "", chaContent: "", chaChangeValue: "" })


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

    }


    /**
     * 挑战搜索框
     */
    chaInputChange = (value) => {
        calm.setState({
            challengeValue: value,
            chaChangeValue: "",
            length: value.length
        }, () => {
            calm.getChasByContent()
        })
    }

    /**
    * 挑战改变
    */
    chaChange(i) {
        calm.setState({
            challengeValue: i.label
        }, () => {
        })
        calm.setState({
            cheData: i,
            chaChangeValue: i.value,  // 挑战ID
        });

    };
    /**
     * 
     */
    inputChange(event) {
        calm.setState({
            inputValue: event.target.value
        })
    }
    cancleProjectName() {
        calm.setState({
            inputValue: ""
        })
        $(".projectNme").hide();
        $(".modalCont").css("overflow-y", "auto");
    }
    render() {

        if (calm.state.theQuestionArr.length != 0 || calm.state.theQustionVideo != 0) {
            $(".addButtonFirst").removeClass("empty")
        }

        if (calm.state.theAnswerArr.length != 0 || calm.state.theAnswerVideo != 0) {
            $(".addButtonSecond").removeClass("empty")
        }

        var newflag = calm.state.allData.every(function (item, index, array) {
            return item == 0;
        })
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
                <div className="projectNme" style={{ display: "none" }}>
                    <div className="inner">
                        <div className='modal_title'>
                            请输入科目名称
                        </div>
                        <div className="content">
                            <div className="inputDiv">
                                <input placeholder="最多输入四个字" value={calm.state.inputValue} onChange={calm.inputChange} />
                            </div>
                        </div>

                        <div className="btn my_flex">
                            <span onClick={calm.cancleProjectName}>取消</span>
                            <span onClick={calm.saveProjectName}>确定</span>
                        </div>
                    </div>
                </div>
                <div className='tabWrap line_public'>
                    <span className="wrongQuestion active" onClick={calm.backWrongQuestion}>错题本</span>
                    <span className="tag" onClick={calm.nextStep}>标签</span>
                </div>
                <div className='tabCont'>
                    <div className="leftWrongQuestion">
                        <div className='cont'>
                            <div className='item'>
                                <div className='title'>上传题干<span className="red-star"></span></div>
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
                                                <video onClick={calm.playVideo.bind(this, v.path)} poster={v.coverPath} src={v.path} alt="" />
                                                <div className="video_tag_play"></div>
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
                                                <video onClick={calm.playVideo.bind(this, v.path)} poster={v.coverPath} src={v.path} alt="" />
                                                <div className="video_tag_play"></div>
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
                                <div className="title">选择科目<span className="red-star"></span></div>
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
                                <span className='spanTag add' onClick={calm.moreProject}>常用科目管理</span>
                            </div>
                            <div className="knowDegree">
                                <div className='title'>掌握程度<span className="red-star"></span></div>
                                <List>
                                    {understandData.map(i => (
                                        <RadioItem key={i.value}
                                            checked={understandValue === i.value}
                                            onChange={calm.underChange.bind(this, i)} >
                                            {i.value}
                                        </RadioItem>
                                    ))}
                                </List>
                            </div>
                            <div className='moreTag'>
                                <div className='title'>更多标签<span className="red-star"></span></div>
                                {
                                    $.isEmptyObject(calm.state.cheData) == true ?
                                        <span className='addTag spanTag' onClick={calm.addTag}>添加标签</span>
                                        :
                                        <div className="spanTag">
                                            <span className="textOver">{calm.state.cheData.label}</span>
                                            <span className="del_tag"
                                                onClick={calm.deleteTag.bind(this)}>删除</span>
                                        </div>
                                }

                            </div>
                        </div>
                        {/* 添加标签 */}
                        <div className="tagBack" style={{
                            display: "none",
                        }}></div>
                        {/* <div className={`calmTagDiv calmTagDivNew tagCont`}
                            style={{
                                display: "none",
                            }}
                        >
                            <div className="tagInput">
                                <InputItem
                                    placeholder="请输入标签"
                                    onChange={calm.searchInputChange}
                                    value={calm.state.searchValue}
                                >
                                </InputItem>
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
                        </div> */}

                        <div className={`calmChaDiv calmTagDivNew tagCont`}
                            style={{
                                display: "none",
                            }}
                        >
                            <div className="tagInput">
                                <TextareaItem
                                    placeholder="请输入标签"
                                    onChange={calm.chaInputChange}
                                    value={calm.state.challengeValue}
                                    count={6}
                                >
                                </TextareaItem>
                            </div>
                            <div className='challenge'>
                                <div className='title_text'>搜索结果</div>
                                <List>
                                    {calm.state.challengeData.map(i => (
                                        <RadioItem className={calm.state.chaChangeValue === i.value ? 'checked' : ''} key={i.value} checked={calm.state.chaChangeValue === i.value} onChange={() => calm.chaChange(i)}>
                                            <span className='topTitle'>{i.label}</span><div className={i.value == 0 ? "text none" : 'text'}>{i.extra}</div>
                                        </RadioItem>
                                    ))}
                                </List>
                            </div>
                            <div className="bottomBox">
                                <span className="close" onClick={calm.cancelChaSubmit}>取消</span>
                                <span className="bind" onClick={calm.submitChaArr}>确 定</span>
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
                        <div className="modalCont">
                            <div><div className='title'>已选科目</div>
                                {
                                    calm.state.alreadySelectData.map((v, i) => {
                                        return (
                                            <span className={v.oldFlag ? "active spanTag" : "spanTag"} onClick={calm.clickAlreadyData.bind(this, v, i)}>{v.content}</span>
                                        )
                                    })
                                }
                                <span className='spanTag add' onClick={calm.addProject}>添加科目</span>
                            </div>
                            <div className="allProject">
                                <div className='title'>所有科目
                                <span style={{ display: newflag ? "none" : "block" }} onClick={calm.manageProject}>删除</span>
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
                    </div>
                    <div className="bottomBox" ><span className="close" onClick={calm.cancleProject}>取消</span><span className="bind" onClick={calm.saveProject}>确定</span></div>
                </div>
            </div>
        )
    }
}