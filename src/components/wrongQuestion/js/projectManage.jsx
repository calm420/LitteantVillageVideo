import React from 'react';
import {
    Modal, Toast
} from 'antd-mobile';
import "../css/projectManage.less"

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
            allProjectData: [],
            activeStr: "",
            newB: [],
            newBStr: ""
        }
    }

    componentDidMount() {
        calm.getProject();
        calm.getCourseByUserIdAndDefianceCourse();
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
    getProject() {
        var param = {
            "method": "getCourseByUserId",
            "userId": 1
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
                            id: v.cid
                        })
                        oldArr.push({
                            content: v.courseName,
                            oldFlag: true,
                            id: v.cid
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
        prompt('请输入科目名称', '', [
            { text: '取消' },
            { text: '立即添加', onPress: value => calm.saveProjectName(value) },
        ], 'default', "", [], phone)
    }
    /**
     * 保存科目
     */
    saveProjectName(value) {
        calm.state.allProjectData.push({
            content: value,
            flag: false
        });
        calm.setState({
            allProjectData: calm.state.allProjectData
        })
        var param = {
            "method": "saveCourseAndUserId",
            "courseJson": {
                "courseName": value,
                "courseType": 1,
                "uid": 1
            }
        }
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                if (result.success) {
                    var newArr = [],
                        oldArr = []
                    result.response.forEach((v, i) => {
                        newArr.push({
                            content: v.courseName,
                            flag: true
                        })
                        oldArr.push({
                            content: v.courseName,
                            oldFlag: true
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
     * 获取所有科目
     */
    getCourseByUserIdAndDefianceCourse() {
        var param = {
            "method": "getCourseByUserIdAndDefianceCourse",
            "userId": 1
        }
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                console.log(result, "新的新的")
                if (result.success) {
                    // var newArr = []
                    // result.response.forEach((v, i) => {
                    //     newArr.push({
                    //         content:v.courseName,
                    //         flag:true,
                    //         cid:v.cid
                    //     })
                    // })
                    // let A = calm.state.alreadySelectData;
                    // let B = newArr;
                    // let newB = [];
                    // for (var i = 0, lenA = A.length; i < lenA; i++) {
                    //     for (var b = 0, lenB = B.length; b < lenB; b++) {
                    //         if (A[i] != B[b]) {
                    //             newB.push(B[b])
                    //         }
                    //     }
                    // }
                    // calm.state.newBStr = newB.map((v, i) => {
                    //     return (
                    //         <span onClick={calm.clickAllProject.bind(this, v)} >{v}</span>
                    //     )
                    // })
                    // calm.setState({
                    //     newBStr: calm.state.newBStr,
                    // })
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
        console.log(index)
        console.log(v)
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
                oldFlag: true
            })
        }
        calm.setState({
            activeData: calm.state.activeData,
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
                oldFlag: true
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
            allProjectData: calm.state.allProjectData
        })

    }

    /**
     * 删除
     */
    deleAllProjectData(value, index, e) {
        console.log(value, "index")
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
            allProjectData:calm.state.allProjectData
        })
    }
    /**
     * 点击管理
     */
    manageProject() {
        $(".delete").show();
    }

    /**
     * 点击保存
     */
    saveProject() {

    }

    render() {
        return (
            <div id="projectManage" style={{ height: calm.state.clientHeight }}>
                <div>已选科目
                    {
                        calm.state.alreadySelectData.map((v, i) => {
                            return (
                                <span className={v.oldFlag ? "active" : ""} onClick={calm.clickAlreadyData.bind(this, v, i)}>{v.content}</span>
                            )
                        })
                    }
                    <span onClick={calm.addProject}>添加科目</span>
                </div>
                <div className="hehehe">
                    <div>所有科目
                        {
                            calm.state.allProjectData.length == 0 ?
                                ""
                                :
                                <span onClick={calm.manageProject}>管理</span>
                        }
                    </div>
                    {/* 需要高亮的 */}
                    {
                        calm.state.activeData.map((v, i) => {
                            return (
                                <span onClick={calm.clickAllProjectActive.bind(this, v, i)} className={v.flag ? "active" : ""} >{v.content}</span>
                            )
                        })
                    }
                    {/* 除了高亮之后剩下的全部 */}
                    {/* {
                        calm.state.newBStr
                    } */}
                    {/* 新添加的 */}
                    {
                        calm.state.allProjectData.map((v, i) => {
                            return (
                                <span className="fatherSpan">
                                    <span onClick={calm.clickAllProject.bind(this, v, i)} className={v.flag ? "active" : ""}>{v.content}</span>
                                    <span className="delete" style={{ display: "none" }} onClick={calm.deleAllProjectData.bind(this, v, i)}>删除</span>
                                </span>
                            )
                        })
                    }
                </div>
                <button onClick={calm.saveProject}>保存</button>
            </div>
        )
    }
}