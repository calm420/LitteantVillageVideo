import React from 'react';
import {
    Modal, Toast
} from 'antd-mobile';
import "../css/publishWrongQuestion.less"

const alert = Modal.alert;
const prompt = Modal.prompt;
var calm;
export default class projectManage extends React.Component {
    constructor(props) {
        super(props);
        calm = this;
        this.state = {
            clientHeight: document.body.clientHeight,
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
        document.title = '科目管理';
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var userId = searchArray[0].split('=')[1];
        // userId = 1;
        calm.setState({
            userId
        })
        calm.getProject(userId);
        calm.getCourseByUserIdAndDefianceCourse(userId);
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
        prompt('请输入科目名称', '(最多四个字)', [
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
                console.log(result,"resul")
                if (result.success) {
                    calm.state.allProjectData.push({
                        content: result.response.courseName,
                        flag: false,
                        id:result.response.cid,
                        uid:result.response.uid
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
        console.log(v,"shjkfghjkfghj")

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
    deleAllProjectData(value, index, e) {
        console.log(value, "index1")
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
    delenoActiveData(value, index, e) {
        console.log(value, "index2")
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
    deleteactiveData(value, index, e) {
        console.log(value, "index333")
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
        console.log(param)
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                if (result.success) {
                    Toast.success('成功');
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

    render() {
        return (
            <div id="publishWrongQuestion" style={{ height: calm.state.clientHeight }}>
                <div className="cont">
                    <div><div className='title'>已选科目</div>
                        {
                            calm.state.alreadySelectData.map((v, i) => {
                                return (
                                    <span className={v.oldFlag ? "active spanTag text_hidden" : "spanTag text_hidden"} onClick={calm.clickAlreadyData.bind(this, v, i)}>{v.content}</span>
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
                                        <span onClick={calm.clickAllProjectActive.bind(this, v, i)} className={v.flag ? "active spanTag text_hidden" : "spanTag text_hidden"} >{v.content}</span>
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
                                        <span onClick={calm.clickNoActive.bind(this, v, i)} className={v.flag ? "active spanTag text_hidden" : "spanTag text_hidden"} >{v.content}</span>
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
                                        <span onClick={calm.clickAllProject.bind(this, v, i)} className={v.flag ? "active spanTag text_hidden" : "spanTag text_hidden"}>{v.content}</span>
                                        {v.uid == 0 ? "" : <span className="delete del_tag" style={{ display: calm.state.showDelete == 0 ? "none" : "block" }} onClick={calm.deleAllProjectData.bind(this, v, i)}>删除</span>}
                                    </span>
                                )
                            })
                        }
                    </div>
                </div>
                <div className='nextBtn' onClick={calm.saveProject}><span>保存</span></div>
            </div>
        )
    }
}