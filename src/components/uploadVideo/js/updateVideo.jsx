import React from 'react';
import { Button, Toast, List, Icon, Modal, TextareaItem, Radio, InputItem, Tag } from 'antd-mobile';

import '../css/addUploadVideo.less'
var calm;
const RadioItem = Radio.RadioItem;
const typeDate = [
    { value: 0, label: '普通类型' },
    { value: 2, label: '广告视频' },
    { value: 1, label: '挑战视频' },
];

export default class updateVideo extends React.Component {
    constructor(props) {
        super(props);
        calm = this;
        this.state = {
            coverPath: "",
            videoUrl: "",
            tagText: [], //存标签
            videoContent: "哈哈哈",  //存心情
            videoType: "",   //视频类型
            videoUrl: "",
            height: "",
            width: "",
            show: true,  //挑战的显示与隐藏
            tagData: [], //标签数据
            tagChangeData: [],
            searchValue: "",
            challengeData: [],
            cheData: {},   //挑战数据
            challengeValue: "",
            showTextOrList: true,
            chaContent: "",
            showDelete: true,
            isNewTag: 0   //0不是   1是,

        }
    }

    componentDidMount() {
        document.title = '编辑视频'
        Bridge.setShareAble("false");
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var uid = locationSearch.split("&")[0].split("=")[1];
        var vid = locationSearch.split("&")[1].split("=")[1];
        calm.setState({
            vid
        })
        calm.getLittleVideoById(vid)
    }
    /**
     * 根据视频ID获取视频对象
     */
    getLittleVideoById(vid) {
        var param = {
            "method": 'getLittleVideoById',
            "videoId": vid,
        }
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' || result.success == true) {
                    if (result.response.videoType != 1) {
                        calm.setState({
                            show: false
                        })
                    }
                    calm.setState({
                        coverPath: result.response.coverPath,
                        videoUrl: result.response.videoPath,
                        firstUrl: result.response.firstUrl,
                        width:result.response.width,
                        height:result.response.height,
                        videoContent: result.response.videoContent,
                        videoType: result.response.videoType,
                        initType: result.response.videoType
                    })
                    result.response.tags.map((v, i) => {
                        if (v.tagType == 2 && calm.state.videoType == 1) {
                            calm.state.cheData.label = v.tagTitle,
                                calm.state.cheData.extra = v.tagContent
                        }
                        if (v.tagType == 1) {
                            calm.state.tagText.push(v);
                        }
                    })
                    calm.setState({
                        tagText: calm.state.tagText,
                        cheData: calm.state.cheData
                    })
                } else {
                    Toast.fail(result.msg, 5);
                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });
    }
    /**
     * 输入框改变的回调
     * @param type  videoContent心情
     * @param index
     * @param value
     */
    inputOnChange = (value) => {
        calm.setState({
            videoContent: value
        })
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
     * 添加挑战
     */
    addChan() {

        $('.calmChaDiv').slideDown();
        $('.tagBack').show();
    }
    /**
    * 封面上传
    */
    uploadImage(event) {
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
            calm.setState({
                coverPath: newArr.picPath
            })

        }, function (error) {
            console.log(error);
        });
    }
    /**
     * mp4预览
     */
    mp4Preview(videoUrl) {
        var data = {
            method: 'playVideo',
            url: videoUrl
        };
        Bridge.callHandler(data, null, function (error) {

        });
    }
    /**
     * 视频上传
     */
    uploadMp4(event) {
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
            calm.setState({
                videoUrl: newArr.picPath
            })
            calm.upload_video_pic();
        }, function (error) {
            console.log(error);
        });
    }


    /**
    * 类型的改变
    */
    onChangeRadio = (value) => {
        if (calm.state.initType !== 1 && value == 1) {
            calm.setState({
                showDelete: false
            })
        }
        if (value == 1) {
            calm.state.show = true;
        } else {
            calm.state.show = false;
        }
        calm.setState({
            videoType: value
        })
        // calm.state.videoType = value

    };


    /**
     * 删除挑战
     */
    deleteCha() {
        calm.state.cheData = {};
        calm.setState({
            showDelete: false
        }, () => {

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
        calm.state.tagText = calm.state.tagText.concat(tagTextData);
        var arr = calm.state.tagText;
        calm.state.tagText = calm.makeArr(arr, "tagTitle")
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
        // if (calm.state.searchValue == "") {
        //     Toast.info("请输入搜索的关键词")
        //     return;
        // }
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
    chaChange = (i) => {
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
            calm.state.cheData.extra = calm.state.chaContent;
        }
        calm.setState({
            showDelete: true,
            chaChangeValue: ""
        }, () => {

        })
        // $('.deleteCha').show();
        calm.setState({ challengeData: [], challengeValue: "", showTextOrList: true, chaContent: "" })


    }


    /**
     * 挑战搜索框
     */
    chaInputChange = (value) => {
        calm.setState({
            challengeValue: value
        }, () => {
            calm.getChasByContent()
        })
    }


    /**
     * 挑战搜索结果
     */
    getChasByContent() {
        // if (calm.state.challengeValue == "") {
        //     Toast.info("请输入搜索的关键词")
        //     return;
        // }
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
                                if (v.tagId == 0) {
                                    arr.push({
                                        value: v.tagId,
                                        label: v.tagTitle,
                                        extra: <div>{v.tagContent}<div className='blueTxt'>点击发起</div></div>
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

    //首先需要 吧 base64 流转换成 blob 对象，文件对象都继承它
    getBlobBydataURI(dataURI, type) {
        var binary = atob(dataURI.split(',')[1]);
        var array = [];
        for (var i = 0; i < binary.length; i++) {
            array.push(binary.charCodeAt(i));
        }
        return new Blob([new Uint8Array(array)], { type: type });
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
        video = document.getElementsByClassName("upload_box_video")[0];//赋值标签
        console.log(video, "ahahah")
        video.setAttribute("crossOrigin", 'Anonymous');
        video.addEventListener("loadeddata", function () {//加载完成事件，调用函数
            console.log("执行了")
            var canvas = document.createElement('canvas');//canvas画布
            canvas.width = video.videoWidth * scale;
            canvas.height = video.videoHeight * scale;
            canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);//画图
            var image = canvas.toDataURL("image/png");
            var $Blob = calm.getBlobBydataURI(image, 'image/jpeg');
            var formData = new FormData();
            formData.append("filePath", $Blob, "file_" + Date.parse(new Date()) + ".png");
            console.log(video.videoWidth, "video.videoWidth")
            calm.state.width = video.videoWidth;
            calm.state.height = video.videoHeight;
            console.log(video.videoHeight, "video.videoHeight")
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
                    calm.setState({
                        firstUrl: res
                    })
                }
            });
        })
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
     * 添加标签
     */
    addTag() {
        $(`.calmTagDiv`).slideDown();
        $(`.tagBack`).show();
    }
    /**
     * 删除标签
     */
    deleteTag(item) {
        var tagNewArr = calm.state.tagText;
        tagNewArr.forEach((v, i) => {
            if (item.tagTitle == v.tagTitle) {
                tagNewArr.splice(i, 1)
            }
            calm.setState({
                tagText: tagNewArr
            })
        })
    }

    /**
    * 保存视频信息
    */
    updateLittleVideoInfo() {
        var obj = {
            status: 1,
            coverPath: calm.state.coverPath,
            videoPath: calm.state.videoUrl,
            firstUrl: calm.state.firstUrl,
            width:calm.state.width,
            height:calm.state.height,
            videoType: calm.state.videoType,   // 视频类型0:普通视频 1:话题/挑战视频 2:广告视频 非空
            userId: calm.state.uid,
            videoContent: calm.state.videoContent,   // 心情描述 
            tags: [
                {
                    tagTitle: calm.state.cheData.label,
                    tagType: 2,   //挑战
                    tagContent: calm.state.cheData.extra
                },
            ]
        }
        obj.tags = obj.tags.concat(calm.state.tagText)
        // 添加合并标签
        obj.tags.map((v, i) => {
            if (calm.state.videoType != 1) {
                if (v.tagType == 2) {
                    obj.tags.splice(i, 1)
                }
            }
        })
        if(obj.firstUrl.length == 0 || obj.width.length == 0 || obj.height.length == 0){
            Toast.info("视频参数错误，请重新上传")
            return 
        }
        if(obj.videoContent.length == 0){
            Toast.info("心情描述不能为空")
            return
        }
        var param = {
            "method": 'updateLittleVideoInfo',
            "videoId": calm.state.vid,
            "videoDatas": obj,
        };


        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' && result.success == true) {
                    Toast.success('成功');
                    // 关闭当前窗口，并刷新上一个页面
                    var data = {
                        method: 'finishForRefresh',
                    };
                    Bridge.callHandler(data, null, function (error) {
                        console.log(error);
                    });
                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });
    }

    render() {
        return (
            <div id="addUploadVideo">
                <div className="addList">
                    <div className="listCont">
                        <div className="my_flex sameBack">
                            <span className="textTitle">封面
                            <p style={{ margin: 0, height: 3 }}></p>
                                <span className="uploadSupport">(jpg格式)</span>
                            </span>
                            {calm.state.coverPath.length == 0 ?
                                <button className="uploadBtn" onClick={calm.uploadImage.bind(this)}>上传封面</button>
                                :
                                <div className="upload_file">
                                    <img onClick={calm.imgPreview.bind(this, calm.state.coverPath)}
                                        className="imgTag" src={calm.state.coverPath} />
                                    <div className="icon_pointer" onClick={calm.uploadImage.bind(this)}>更换</div>
                                </div>
                            }

                        </div>
                        <div className="line_public flex_container"></div>
                        <div className="my_flex sameBack">
                            <span className="textTitle">视频
                            <p style={{ margin: 0, height: 3 }}></p>
                                <span className="uploadSupport">(MP4格式)</span>
                            </span>
                            {calm.state.videoUrl.length == 0 ?
                                <button className="uploadBtn" onClick={calm.uploadMp4.bind(this)}>上传视频</button>
                                :
                                <div className="upload_file">
                                    <video className="upload_box_video"
                                        onClick={calm.mp4Preview.bind(this, calm.state.videoUrl)}
                                        src={calm.state.videoUrl}></video>
                                    {/* <div
                                    className="musicIcon" /> */}
                                    <div className="icon_pointer" onClick={calm.uploadMp4.bind(this)}>修改</div>
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
                                        checked={calm.state.videoType === item.value}
                                        onChange={() => calm.onChangeRadio(item.value)}>
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
                                value={calm.state.videoContent}
                                onChange={calm.inputOnChange.bind(this)}
                                rows={5}
                                count={50}
                            />
                        </div>

                        <div className="line_public flex_container"></div>

                        <div style={{ display: calm.state.show ? "block" : "none" }}>
                            <div className="my_flex sameBack">
                                <span className="textTitle">挑战</span>
                                <span className='tagBtn' style={{ display: !(calm.state.showDelete) ? "block" : "none" }} onClick={calm.addChan.bind(this)}>添加挑战</span>

                                <div className='challengeTag' style={{ display: calm.state.showDelete ? "block" : "none" }} >
                                    <div className='tagTitle textOver'>
                                        <span className="del_tag" onClick={calm.deleteCha.bind(this)}>删除</span>
                                        <span className='preIcon'>#</span>
                                        {calm.state.cheData.label}</div>
                                    <div className='tagText'>
                                        {calm.state.cheData.extra}
                                    </div>
                                </div>
                            </div>

                            <div className="line_public flex_container"></div>
                        </div>
                        <div className='my_flex sameBack'>
                            <div className="textTitle">标签</div>
                            {
                                calm.state.tagText.map((v, i) => {
                                    if (v.tagType == 1) {
                                        return (
                                            <div className="spanTag">
                                                <span className="textOver">{v.tagTitle}</span>
                                                <span className="del_tag" onClick={calm.deleteTag.bind(this, v)}></span>
                                            </div>
                                        )
                                    }

                                })
                            }
                            {
                                calm.state.tagText.length == 3 ?
                                    ""
                                    :
                                    <span className='tagBtn' onClick={calm.addTag}>添加标签</span>

                            }
                        </div>
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
                                        <RadioItem key={i.value} checked={calm.state.chaChangeValue === i.value} onChange={() => calm.chaChange(i)}>
                                            <span className='preIcon'>#</span>{i.label}<List.Item.Brief>{i.extra}</List.Item.Brief>
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
                    <Button type="warning" onClick={calm.updateLittleVideoInfo}>提交</Button>
                </div>

            </div>
        )
    }
}