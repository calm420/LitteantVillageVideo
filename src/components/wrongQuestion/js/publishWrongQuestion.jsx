import React from 'react';
import { List, TextareaItem, Tag, InputItem, Radio,Toast } from 'antd-mobile';
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
            tagText:[],
            tagChangeData: [],
            searchValue: "",
        }
    }
    componentDidMount() {
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

    /**
     * 提交
     */
    submit() {
        console.log(calm.state.addNoteValue, "value")
    }


    /**
     * 掌握程度
     */
    underChange = (item) => {
        console.log('value', item);
        this.setState({
            understandValue: item.value
        });
    };
    /**
     * 选择科目
     */
    projectChange = (item) => {
        console.log('value', item);
        this.setState({
            projectValue: item.value
        });
    };

    /**
     * 更多科目
     */
    moreProject() {
        var url = encodeURI(WebServiceUtil.mobileServiceURL + "projectManage");
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
            calm.getTagsByContent()
        })
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
                tagText:calm.state.tagText
            })
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
                label: "35"
            },
            {
                value: "基本懂",
                label: "70"
            },
            {
                value: "完全懂",
                label: "100"
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
                        <img src="" alt="" />
                        <button>添加</button>
                    </div>
                    <div>
                        <div>上传正解</div>
                        <img src="" alt="" />
                        <button>添加</button>
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
                            {projectData.map(i => (
                                <RadioItem key={i.value} checked={projectValue === i.value} onChange={() => this.projectChange(i)}>
                                    {i.value}
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
                    <div onClick={calm.submit}>提交</div>
                </div>

                {/* <span>上传</span>
                <span>拍照</span>
                <span>返回</span> */}
            </div>
        )
    }
}