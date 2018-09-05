import React from 'react';
import { List, TextareaItem, Tag, InputItem, Radio, Toast } from 'antd-mobile';
import { createForm } from 'rc-form';
import '../css/publishWrongQuestion.less'
const RadioItem = Radio.RadioItem;
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
                {
                    type: 0, //图片
                    fatherType: 0,
                    path: "http://60.205.86.217/upload8/2018-08-30/14/b02a7828-e89b-493e-a0ee-65a05b8f0da2.jpg"
                }
            ],
            theQustionVideo: [
                {
                    type: 1,  //视频
                    fatherType: 0,
                    path: "http://60.205.86.217/upload8/2018-08-30/14/0e6f6e14-1a14-4f52-8096-431cd59ff6c3.mp4",
                    coverPath: "http://60.205.86.217/upload8/2018-08-30/14/b02a7828-e89b-493e-a0ee-65a05b8f0da2.jpg"
                }
            ],
            theAnswerArr: [
                {
                    type: 0, //图片
                    fatherType: 1,
                    path: "http://60.205.86.217/upload8/2018-08-30/14/b02a7828-e89b-493e-a0ee-65a05b8f0da2.jpg"
                }
            ],
            theAnswerVideo: [{
                type: 1,  //视频
                fatherType: 1,
                path: "http://60.205.86.217/upload8/2018-08-30/14/0e6f6e14-1a14-4f52-8096-431cd59ff6c3.mp4",
                coverPath: "http://60.205.86.217/upload8/2018-08-30/14/b02a7828-e89b-493e-a0ee-65a05b8f0da2.jpg"
            }],
        }
    }
    componentDidMount() {
        document.title = '错题本';
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var userId = searchArray[0].split('=')[1];
        userId = 1;
        calm.setState({
            userId
        })
        console.log(userId)
        calm.getProject(userId);
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
    /**
     * 去选择标签
     */
    nextStep() {
        $(".rightTag").show();
        $(".leftWrongQuestion").hide();
        $(".tabWrap .wrongQuestion").removeClass('active');
        $(".tabWrap .tag").addClass('active');
    }
    /**
     * 返回错题
     */
    backWrongQuestion() {
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
        return
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
        var url = encodeURI(WebServiceUtil.mobileServiceURL + "projectManage?userId=" + calm.state.userId);
        var data = {
            method: 'openNewPage',
            url: url
        };
        Bridge.callHandler(data, null, function (error) {
            window.location.href = url;
        });
    }

    /**
     * 添加标签
     */
    addTag() {
        if (calm.state.cid == undefined) {
            Toast.info("请先选择科目")
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
            Toast.info("请输入搜索的关键词")
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
        var data = {
            method: 'toTakePhoto',
        };
        Bridge.callHandler(data, function (res) {
            // 拿到照片地址,显示在页面等待上传
            // var res = 'http:suhdjghjaasd?type=1'
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
            console.log(res, "res")
        }, function (error) {
            console.log(error);
        });
    }
    /**
     * 上传答案
     */
    addTheAnswer() {
        var data = {
            method: 'toTakePhoto',
        };
        Bridge.callHandler(data, function (res) {
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
    }
    /**
     * 删除答案
     */
    deleteAnswer(i) {
        calm.state.theAnswerArr.splice(i, 1);
        calm.setState({
            theAnswerArr: calm.state.theAnswerArr
        })
    }
    /**
     * 删除答案视频
     */
    deleteAnswerVideo(i) {
        calm.state.theAnswerVideo.splice(i, 1);
        calm.setState({
            theAnswerVideo: calm.state.theAnswerVideo
        })
    }
    /**
     * 删除问题
     */
    deleteQuestionVideo(i) {
        calm.state.theQustionVideo.splice(i, 1);
        calm.setState({
            theQustionVideo: calm.state.theQustionVideo
        })
    }
    render() {
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
                    <span className="wrongQuestion active" onClick={calm.backWrongQuestion} >错题本</span>
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
                                                <img src={v.path} alt="" />
                                                <div className='delete'><span onClick={calm.deleteQuestion.bind(this, i)}>删除</span></div>
                                            </div>
                                        )
                                    })
                                }
                                {
                                    calm.state.theQustionVideo.map((v, i) => {
                                        return (
                                            <div className='imgDiv'>
                                                <video  poster={v.coverPath} src={v.path} alt="" controls />
                                                <div className='delete'><span onClick={calm.deleteQuestionVideo.bind(this, i)}>删除</span></div>
                                            </div>
                                        )
                                    })
                                }
                                <div className='addButton' onClick={calm.addTheQusetion}>+ 添加</div>
                            </div>
                            <div className='item'>
                                <div className='title'>上传正解</div>
                                {
                                    calm.state.theAnswerArr.map((v, i) => {
                                        return (
                                            <div className='imgDiv'>
                                                <img src={v.path} alt="" />
                                                <div className='delete'><span onClick={calm.deleteAnswer.bind(this, i)}>删除</span></div>
                                            </div>
                                        )
                                    })
                                }
                                {
                                    calm.state.theAnswerVideo.map((v, i) => {
                                        return (
                                            <div className='imgDiv'>
                                                <video poster={v.coverPath} src={v.path} alt="" controls />
                                                <div className='delete'><span onClick={calm.deleteAnswerVideo.bind(this, i)}>删除</span></div>
                                            </div>
                                        )
                                    })
                                }
                                <div className='addButton' onClick={calm.addTheAnswer}>+ 添加</div>
                            </div>
                            <div className='item'>
                                <List renderHeader={() => '添加备注'}>
                                    <TextareaItem
                                        rows={5}
                                        count={30}
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
                                        <RadioItem key={i.value} className={projectValue === i.courseName ? 'checked' : ''} checked={projectValue === i.courseName} onChange={() => this.projectChange(i)}>
                                            {i.courseName}
                                        </RadioItem>
                                    ))}
                                </List>
                                <span className='spanTag' onClick={calm.moreProject}>+更多科目</span>
                            </div>
                            <div className="knowDegree">

                                <List renderHeader={() => '掌握程度'}>
                                    {understandData.map(i => (
                                        <RadioItem key={i.value} className={understandValue === i.value ? "on" : ''} checked={understandValue === i.value} onChange={() => this.underChange(i)}>
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
                                                <span className="textOver">{v.tagTitle}</span>
                                                <span className="del_tag" onClick={calm.deleteTag.bind(this, v)}>删除</span>
                                            </div>
                                        )
                                    })
                                }
                                <span className='addTag spanTag' onClick={calm.addTag}>+添加标签</span>
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
            </div>
        )
    }
}