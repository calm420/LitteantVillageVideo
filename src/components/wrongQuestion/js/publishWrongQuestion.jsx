import React from 'react';
import { List, TextareaItem, Tag, InputItem, Radio, Toast } from 'antd-mobile';
import { createForm } from 'rc-form';
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
            theQuestionArr: [],
            theQustionVideo: [],
            theAnswerArr: [],
            theAnswerVideo: [],
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
        $(".rightTag").show()
        $(".leftWrongQuestion").hide()
    }
    /**
     * 返回错题
     */
    backWrongQuestion() {
        $(".rightTag").hide()
        $(".leftWrongQuestion").show()
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
        var param = {
            "method": "saveWrongTopicBook",
            "circleOfFriendsJson": {
                "friendsAttachments": [],
                "fTags":calm.state.tagText,
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

        console.log('value', item);
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
        if(calm.state.cid == undefined){
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
                                // // if (v.tagId == 0) {
                                // //     // calm.setState({
                                // //     //     isNewTag:0
                                // //     // })
                                // //     calm.setState.isNewTag = 0;
                                // //     arr.push(<Tag
                                // //         selected={false}
                                // //         onChange={calm.tagChange.bind(this, v)}
                                // //     >{v.tagTitle}</Tag>)
                                // //     return
                                // // }
                                // calm.setState({
                                //     isNewTag: 0
                                // })
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
        // console.log(status,"status")
        if (status) {
            calm.state.tagChangeData.push(data);
            console.log(calm.state.tagChangeData, "tagChangeData")

        } else {
            // console.log(status,"status")
            console.log(calm.state.tagChangeData, "tagChangeData1")
            calm.state.tagChangeData.forEach((v, i) => {
                console.log(data, "data")
                console.log(v, "V")
                if (v.tagId == data.tagId) {
                    calm.state.tagChangeData.splice(i, 1)
                    calm.setState({
                        tagChangeData: calm.state.tagChangeData
                    })
                    console.log(calm.state.tagChangeData, "tagChangeData2")
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
        console.log(tagTextData,"tagTextData")
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
            var imgUrl = newArr[0];
            calm.upload_video_pic()
            if (type == 1) {
                calm.state.theQuestionArr.push({
                    type:1,
                    url:imgUrl,
                })
            }
            if (type == 2) {
                calm.state.theQustionVideo.push(imgUrl);
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
            var imgUrl = newArr[0];
            if (type == 1) {
                calm.state.theAnswerArr.push(imgUrl)
            }
            if (type == 2) {
                calm.state.theAnswerVideo.push(imgUrl);
            }
            calm.setState({
                theAnswerArr: calm.state.theAnswerArr,
                theAnswerVideo: calm.state.theAnswerVideo
            })
        }, function (error) {
            console.log(error);
        });
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
        const projectData = [
            {
                value: "语文",
                label: "chinese"
            },
            {
                value: "数学",
                label: "math"
            },
        ]
        const { understandValue, projectValue } = this.state;
        return (
            <div id="publishWrongQuestion" style={{ height: calm.state.clientHeight }}>
                <div>
                    <span className="wrongQuestion" onClick={calm.backWrongQuestion} >错题本</span>
                    <span className="tag" onClick={calm.nextStep}>标签</span>
                </div>
                <div className="leftWrongQuestion">

                    <div>
                        <div>上传题干</div>
                        {
                            calm.state.theQuestionArr.map((v, i) => {
                                return (
                                    <img src={v} alt="" />
                                )
                            })
                        }
                        {
                            calm.state.theQustionVideo.map((v, i) => {
                                return (
                                    <video onClick={calm.clickQuestionVideo.bind(this,i)} className="upload_box_video" src={v} alt="" controls />
                                )
                            })
                        }
                        <button onClick={calm.addTheQusetion}>添加</button>
                    </div>
                    <div>
                        <div>上传正解</div>
                        {
                            calm.state.theAnswerArr.map((v, i) => {
                                return (
                                    <img src={v} alt="" />
                                )
                            })
                        }
                        {
                            calm.state.theAnswerVideo.map((v, i) => {
                                return (
                                    <video src={v} alt="" controls />
                                )
                            })
                        }
                        <button onClick={calm.addTheAnswer}>添加</button>
                    </div>
                    <div>
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
                    <button onClick={calm.nextStep}>下一步</button>
                </div>
                <div className="rightTag" style={{ display: "none" }}>
                    <div className="selectProject">
                        <List renderHeader={() => '选择科目'}>
                            {calm.state.projectData.map(i => (
                                <RadioItem key={i.value} checked={projectValue === i.courseName} onChange={() => this.projectChange(i)}>
                                    {i.courseName}
                                </RadioItem>
                            ))}
                        </List>
                        <span onClick={calm.moreProject}>更多科目</span>
                    </div>
                    <div className="knowDegree">

                        <List renderHeader={() => '掌握程度'}>
                            {understandData.map(i => (
                                <RadioItem key={i.value} checked={understandValue === i.value} onChange={() => this.underChange(i)}>
                                    {i.value}
                                </RadioItem>
                            ))}
                        </List>
                    </div>
                    <div>
                        <span>更多标签</span>
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
                        <button onClick={calm.addTag}>添加标签</button>
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
                    <div onClick={calm.saveWrongTopicBook}>提交</div>
                </div>

                {/* <span>上传</span>
                <span>拍照</span>
                <span>返回</span> */}
            </div>
        )
    }
}