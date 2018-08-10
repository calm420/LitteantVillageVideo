import React from 'react';
import { Button, Toast, List, Icon, Modal, TextareaItem, Radio, InputItem, Tag } from 'antd-mobile';
import '../css/addUploadVideo.less'

const RadioItem = Radio.RadioItem;
var calm;
const typeDate = [
    { value: 0, label: '普通类型' },
    { value: 1, label: '广告视频' },
    { value: 2, label: '挑战视频' },
];
const recomData = [
    { value: 0, label: '是' },
    { value: 1, label: '否' },
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
                cheData: {}

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
        console.log(value, 'checkbox');
        if (value == 2) {
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
            calm.state.addVideoList[index].videoUrl = newArr.picPath
            calm.buildAddList()
        }, function (error) {
            console.log(error);
        });
    }

    /**
     * 添加标签
     */
    addTag(index) {

        console.log(index, "tagindex")
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
        console.log(index, "iiii")
        calm.setState({
            challengeIndex: index
        })
    }

    /**
     * 删除标签
     */
    deleteTag(item, index) {
        calm.state.addVideoList[index].tagText.forEach((v, i) => {
            if (item.id == v.id) {
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
                    <span className="textTitle">上传封面
                        <p style={{ margin: 0, height: 5 }}></p>
                        <span className="uploadSupport">(jpg格式)</span>
                    </span>
                    {calm.state.addVideoList[i].coverPath.length == 0 ?
                        <button className="" onClick={calm.uploadImage.bind(this, i)}>上传封面</button>
                        :
                        <div className="upload_file">
                            <img onClick={calm.imgPreview.bind(this, calm.state.addVideoList[i].coverPath)}
                                className="imgTag" src={calm.state.addVideoList[i].coverPath} />
                            <div className="icon_pointer" onClick={calm.uploadImage.bind(this, i)}>修改</div>
                        </div>
                    }

                </div>
                <div className="line_public flex_container"></div>
                <div className="my_flex sameBack">
                    <span className="textTitle">上传视频
                        <p style={{ margin: 0, height: 5 }}></p>
                        <span className="uploadSupport">(MP4格式)</span>
                    </span>
                    {calm.state.addVideoList[i].videoUrl.length == 0 ?
                        <button className="" onClick={calm.uploadMp4.bind(this, i)}>上传视频</button>
                        :
                        <div className="upload_file">
                            <video
                                onClick={calm.mp4Preview.bind(this, calm.state.addVideoList[i])}
                                src={calm.state.addVideoList[i].videoUrl}></video>
                            {/* <div 
                                className="musicIcon" /> */}
                            <div className="icon_pointer" onClick={calm.uploadMp4.bind(this, i)}>修改</div>
                        </div>

                    }
                </div>
                <div className="line_public flex_container"></div>

                <div>心情描述</div>
                <TextareaItem
                    className="add_element"
                    placeholder="请输入心情描述"
                    value={calm.state.addVideoList[i].videoContent}
                    onChange={calm.inputOnChange.bind(this, i)}
                    rows={5}
                    count={50}
                />
                <div className="line_public flex_container"></div>
                <List renderHeader={() => '视频类型'}>
                    {typeDate.map(item => (
                        <RadioItem
                            key={item.value}
                            checked={calm.state.addVideoList[i].videoType === item.value}
                            onChange={() => calm.onChangeRadio(i, item.value)}>
                            {item.label}
                        </RadioItem>
                    ))}
                </List>
                <div style={{ display: calm.state.addVideoList[i].show ? "block" : "none" }}>
                    挑战
                    <span style={{ display: !(calm.state.showDelete) ? "block" : "none" }} onClick={calm.addChan.bind(this, i)}>添加挑战</span>
                    <div>
                        <span className="deleteCha" style={{ display: calm.state.showDelete ? "block" : "none" }} onClick={calm.deleteCha.bind(this, i)}>删除</span>
                        <div>
                            {calm.state.addVideoList[i].cheData.label}</div>
                        <div>
                            {calm.state.addVideoList[i].cheData.extra}
                        </div>
                    </div>
                </div>
                <div>标签
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
                            <span onClick={calm.addTag.bind(this, i)}>添加标签</span>

                    }
                </div>

                <div className="line_public flex_container"></div>
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
            cheData: {}
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

    /**
     * 保存视频信息
     */
    batchLittleVideoInfo() {
        var newArr = []
        calm.state.addVideoList.forEach(function (v, i) {
            newArr.push({
                coverPath: v.coverPath,
                videoPath: v.videoUrl,
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
        })

        console.log(calm.state.addVideoList)
        console.log(newArr)

        newArr.forEach((v, i) => {
            console.log(v, "vb")
            v.tags = v.tags.concat(calm.state.addVideoList[i].tagText)
        })

        console.log(newArr, "newArr");
        var param = {
            "method": 'batchLittleVideoInfo',
            "videoJson": JSON.stringify(newArr),
        };
        console.log(param, "param")
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' && result.success == true) {

                    Toast.success('成功');
                    //关闭当前窗口，并刷新上一个页面
                    // var data = {
                    //     method: 'finishForRefresh',
                    // };
                    // Bridge.callHandler(data, null, function (error) {
                    //     console.log(error);
                    // });
                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });
    }



    /**
     * 挑战搜索框
     */
    chaInputChange = (value) => {
        console.log(value, "cha")
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
                    console.log(result)
                    if (result.msg == '调用成功' || result.success == true) {
                        if (!WebServiceUtil.isEmpty(result.response)) {
                            var arr = []
                            result.response.forEach(function (v, i) {
                                if (v.tagId == 0) {
                                    arr.push({
                                        value: v.tagId,
                                        label: v.tagTitle,
                                        extra: v.tagContent
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
        console.log(calm.state.addVideoList[calm.state.challengeIndex].cheData, "ttt")
        calm.setState({
            showDelete: true
        }, () => {
            calm.buildAddList()

        })
        // $('.deleteCha').show();
        calm.setState({ challengeData: [], challengeValue: "", showTextOrList: true, chaContent: "" })


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
        console.log(calm.state.addVideoList[calm.state.tagIndex].tagText, "tagTexts")
        console.log(tagTextData, "tagTextData")

        calm.state.addVideoList[calm.state.tagIndex].tagText = calm.state.addVideoList[calm.state.tagIndex].tagText.concat(tagTextData);
        console.log(calm.state.addVideoList[calm.state.tagIndex].tagText, "tagTexte")

        var arr = calm.state.addVideoList[calm.state.tagIndex].tagText;
        calm.state.addVideoList[calm.state.tagIndex].tagText = calm.makeArr(arr, "tagId")
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
        console.log(calm.state.isNewTag, "isNewTag")
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
                    console.log(result)
                    if (result.msg == '调用成功' || result.success == true) {
                        if (!WebServiceUtil.isEmpty(result.response)) {
                            var arr = []
                            result.response.forEach(function (v, i) {
                                // console.log(v);
                                if (v.tagId == 0) {
                                    // calm.setState({
                                    //     isNewTag:0
                                    // })
                                    calm.setState.isNewTag = 0;
                                    console.log(v.tagId, "tagId")
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
        console.log(calm.state.tagChangeData, "tagChangeData")
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
        console.log('checkbox', i);
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
        console.log(value, "w")
        calm.setState({
            chaContent: value
        })
    }
    render() {
        return (
            <div id="addUploadVideo" style={{ height: this.state.clientHeight }}>
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
                            placeholder="请输入关键字"
                            onChange={calm.searchInputChange}
                            value={calm.state.searchValue}
                        >
                            <div>标签名称</div>
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
                    <div className="tagInput">
                        <InputItem
                            placeholder="请输入挑战"
                            onChange={calm.chaInputChange}
                            value={calm.state.challengeValue}
                        >
                            <div>挑战</div>
                        </InputItem>
                    </div>
                    {
                        calm.state.showTextOrList ?
                            <List renderHeader={() => ''}>
                                {calm.state.challengeData.map(i => (
                                    <RadioItem key={i.value} checked={calm.state.chaChangeValue === i.value} onChange={() => calm.chaChange(i)}>
                                        {i.label}<List.Item.Brief>{i.extra}</List.Item.Brief>
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

                    <div className="bottomBox">
                        <span className="close" onClick={calm.cancelChaSubmit}>取消</span>
                        <span className="bind" onClick={calm.submitChaArr}>确 定</span>
                    </div>
                </div>
                <div className='submitBtn'>
                    <Button type="warning" onClick={this.batchLittleVideoInfo}>提交</Button>
                </div>
            </div>
        );
    }
}

