import React from 'react';
import {
    Modal,
} from 'antd-mobile';
import "../css/projectManage.less"

const alert = Modal.alert;
const prompt = Modal.prompt;
var calm;

var timeOutEvent = 0;
function longPress() {
    timeOutEvent = 0;
    alert("长按事件触发发");
}

export default class projectManage extends React.Component {
    constructor(props) {
        super(props);
        calm = this;
        this.state = {
            clientHeight: document.body.clientHeight,
            alreadySelectData: [],
            allProjectData: []
        }
    }
    componentDidMount() {
        setTimeout(() => {
            console.log($("#projectManage"))

        }, 200)
        $("#projectManage").on({
            touchstart: function (e) {
                timeOutEvent = setTimeout(longPress(), 500);
                e.preventDefault();
            },
            touchmove: function () {
                clearTimeout(timeOutEvent);
                timeOutEvent = 0;
            },
            touchend: function () {
                clearTimeout(timeOutEvent);
                if (timeOutEvent != 0) {
                    alert("你这是点击，不是长按");
                }
                return false;
            }
        })

    }
    /**
     * 保存科目
     */
    saveProjectName(value) {
        console.log(value, "value")
        calm.state.alreadySelectData.push(value);
        calm.state.allProjectData.push(value);
        calm.setState({
            alreadySelectData: calm.state.alreadySelectData,
            allProjectData: calm.state.allProjectData
        })
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
     * 点击已科目选项
     * @param {*} e 
     */
    clickAlreadyData(e) {
        var tempValue = $(e.target)[0].innerHTML;
        calm.state.alreadySelectData.forEach((value, i) => {
            if (tempValue == value) {
                calm.state.alreadySelectData.splice(i, 1)
            }
            calm.setState({
                alreadySelectData: calm.state.alreadySelectData
            })
        })
        calm.state.allProjectData.forEach((value, i) => {
            if (tempValue == value) {
                $(".allProject").eq(i).removeClass("active");
                console.log($(".allProject").eq(i), "hhehehh")
            }
            calm.setState({
                alreadySelectData: calm.state.alreadySelectData
            })
        })
    }
    /**
     * 点击所有科目子选项
     */
    clickAllProject(v, e) {
        console.log(v);
        if ($(e.target).hasClass("active")) {
            $(e.target).removeClass("active");
            calm.state.alreadySelectData.forEach((item, i) => {
                if (v == item) {
                    calm.state.alreadySelectData.splice(i, 1)
                }
                calm.setState({
                    alreadySelectData: calm.state.alreadySelectData
                })
            })
        } else {
            $(e.target).addClass("active");
            calm.state.alreadySelectData.push(v)
            calm.setState({
                allProjectData: calm.state.allProjectData
            })
        }
    }
    render() {
        return (
            <div id="projectManage" style={{ height: calm.state.clientHeight }}>
                <div>已选科目
                    {
                        calm.state.alreadySelectData.map((v, i) => {
                            return (
                                <span className="active" onClick={calm.clickAlreadyData.bind(this)}>{v}</span>
                            )
                        })
                    }
                    <span onClick={calm.addProject}>添加科目</span>
                </div>
                <div>所有科目
                {
                        calm.state.allProjectData.map((v, i) => {
                            return (
                                <span onClick={calm.clickAllProject.bind(this, v)} className="allProject active">{v}</span>
                            )
                        })
                    }
                </div>
                <button>保存</button>
            </div>
        )
    }
}