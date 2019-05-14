import React from "react";
import { ListView, PullToRefresh, Toast, Accordion, List, InputItem, DatePicker } from 'antd-mobile';
import Input from "antd-mobile/lib/input-item/Input";
import '../css/VillageCardSystemHome.less'
var calm;
var lookUrl;
var alreadylookUrl;
export default class VillageCardSystemHome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            articalType: [
                {
                    title: "待审核", active: false
                },
                {
                    title: "已审核", active: true
                },
            ],
            editCardType: [
                {
                    title: "乡村振兴", active: false
                },
                {
                    title: "党课预告", active: false
                },
                {
                    title: "党课考勤", active: false
                },
                {
                    title: "发布通知", active: false
                },
                {
                    title: "荣誉村民", active: false
                },
                {
                    title: "学习榜", active: false
                },
            ],
            inputDivs: [],
            addInputList: [{
                inputValue: "",
            }],
            inputFirstValue: "",
            villageName: "李家村"
        }
    }

    componentDidMount () {
        this.buildAddList()
        Bridge.setShareAble("false");
        document.title = "后台管理系统"
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var auditorId = searchArray[0].split('=')[1];
        lookUrl = WebServiceUtil.mobileServiceURL + "lookThrough?auditorId=3";
    }

    onChangeLeft = (key) => {
        console.log(key, "onChangeLeft");
        if (key == 0) {
            $(".rightBox").hide();
            $(".rightBoxFirst").show();
            $(".lookThrough").hide();
            $(".cardEdit").hide();

        } else if (key == 1) {
            $(".rightBox").hide();
            $(".rightBoxSecond").show();
            $(".lookThrough").show();
            var url = WebServiceUtil.mobileServiceURL + "lookThrough?auditorId=3";
            $(".iframeDiv").attr("src", url)
        } else if (key == 2) {
            this.setState({
                editCardType:
                    [
                        {
                            title: "乡村振兴", active: true
                        },
                        {
                            title: "党课预告", active: false
                        },
                        {
                            title: "党课考勤", active: false
                        },
                        {
                            title: "发布通知", active: false
                        },
                        {
                            title: "荣誉村民", active: false
                        },
                        {
                            title: "学习榜", active: false
                        },
                    ],
            })
            $(".rightBox").hide();
            $(".lookThrough").hide();
            $(".rightBoxThird").show();
            $(".cardEdit").show();
        }
    }
    onChangeRightContent = (key) => {
        console.log(key);
    }
    clickArticalItem = (value) => {
        if (value.title == "待审核") {
            var url = WebServiceUtil.mobileServiceURL + "lookThrough?auditorId=3";
            $(".iframeDiv").attr("src", url)


        } else if (value.title == "已审核") {
            var url = WebServiceUtil.mobileServiceURL + "alreadyLookThough?auditorId=3";
            $(".iframeDiv").attr("src", url)


        }
    }
    clickCardItem = (v) => {
        console.log(v, "index")
        if (v.title == "乡村振兴") {
            $(".villageImg").show();
            $(".dangke").hide();
            $(".dangkeAtt").hide();
            $(".pushNotify").hide();
            $(".hornorVillages").hide();
            $(".learnList").hide();
            this.setState({
                editCardType:
                    [
                        {
                            title: "乡村振兴", active: true
                        },
                        {
                            title: "党课预告", active: false
                        },
                        {
                            title: "党课考勤", active: false
                        },
                        {
                            title: "发布通知", active: false
                        },
                        {
                            title: "荣誉村民", active: false
                        },
                        {
                            title: "学习榜", active: false
                        },
                    ],
            })
        } else if (v.title == "党课预告") {
            $(".villageImg").hide();
            $(".dangke").show();
            $(".dangkeAtt").hide();
            $(".pushNotify").hide();
            $(".hornorVillages").hide();
            $(".learnList").hide();
            this.setState({
                editCardType:
                    [
                        {
                            title: "乡村振兴", active: false
                        },
                        {
                            title: "党课预告", active: true
                        },
                        {
                            title: "党课考勤", active: false
                        },
                        {
                            title: "发布通知", active: false
                        },
                        {
                            title: "荣誉村民", active: false
                        },
                        {
                            title: "学习榜", active: false
                        },
                    ],
            })
        } else if (v.title == "党课考勤") {
            $(".villageImg").hide();
            $(".dangke").hide();
            $(".dangkeAtt").show();
            $(".pushNotify").hide();
            $(".hornorVillages").hide();
            $(".learnList").hide();
            this.setState({
                editCardType:
                    [
                        {
                            title: "乡村振兴", active: false
                        },
                        {
                            title: "党课预告", active: false
                        },
                        {
                            title: "党课考勤", active: true
                        },
                        {
                            title: "发布通知", active: false
                        },
                        {
                            title: "荣誉村民", active: false
                        },
                        {
                            title: "学习榜", active: false
                        },
                    ],
            })
        } else if (v.title == "发布通知") {
            $(".villageImg").hide();
            $(".dangke").hide();
            $(".dangkeAtt").hide();
            $(".pushNotify").show();
            $(".hornorVillages").hide();
            $(".learnList").hide();
            this.setState({
                editCardType:
                    [
                        {
                            title: "乡村振兴", active: false
                        },
                        {
                            title: "党课预告", active: false
                        },
                        {
                            title: "党课考勤", active: false
                        },
                        {
                            title: "发布通知", active: true
                        },
                        {
                            title: "荣誉村民", active: false
                        },
                        {
                            title: "学习榜", active: false
                        },
                    ],
            })
        } else if (v.title == "荣誉村民") {
            $(".villageImg").hide();
            $(".dangke").hide();
            $(".dangkeAtt").hide();
            $(".pushNotify").hide();
            $(".hornorVillages").show();
            $(".learnList").hide();
            this.setState({
                editCardType:
                    [
                        {
                            title: "乡村振兴", active: false
                        },
                        {
                            title: "党课预告", active: false
                        },
                        {
                            title: "党课考勤", active: false
                        },
                        {
                            title: "发布通知", active: false
                        },
                        {
                            title: "荣誉村民", active: true
                        },
                        {
                            title: "学习榜", active: false
                        },
                    ],
            })
        } else if (v.title == "学习榜") {
            $(".villageImg").hide();
            $(".dangke").hide();
            $(".dangkeAtt").hide();
            $(".pushNotify").hide();
            $(".hornorVillages").hide();
            $(".learnList").show();
            this.setState({
                editCardType:
                    [
                        {
                            title: "乡村振兴", active: false
                        },
                        {
                            title: "党课预告", active: false
                        },
                        {
                            title: "党课考勤", active: false
                        },
                        {
                            title: "发布通知", active: false
                        },
                        {
                            title: "荣誉村民", active: false
                        },
                        {
                            title: "学习榜", active: true
                        },
                    ],
            })
        }
    }


    addInput = () => {
        this.state.addInputList.push({
            inputValue: "",
        })
        this.buildAddList()
    }

    inputOnChange = (index, value) => {
        this.state.addInputList[index].inputValue = value;
        this.buildAddList()
    }

    /**
    * 根据数据数组构建批量上传列表
    */
    buildAddList () {
        var listArr = this.state.addInputList;
        var arr = [];
        listArr.forEach((v, i) => {
            console.log(v, "v")
            arr.push(<div className="listCont">
                <div>
                    <InputItem
                        placeholder="请输入组名称"
                        onChange={this.inputOnChange.bind(this, i)}
                        value={this.state.addInputList[i].inputValue}
                    >
                    </InputItem>
                    <span style={{ display: i == 0 ? "none" : "block" }}>删除</span>
                </div>
            </div>)
        })
        this.setState({ inputDivs: arr })
    }

    submitInput = () => {
        var inputArr = []
        inputArr.push(this.state.inputFirstValue)
        this.state.addInputList.forEach((v, i) => {
            inputArr.push(v.inputValue)
        })
        var param = {
            "method": 'createVillageGroup',
            "groupNames": inputArr.join(","),
        };
        console.log("param", param)
        $(".villageMask").hide();
        $(".villageMaskInner").hide();
        // WebServiceUtil.requestLittleAntApi6013(JSON.stringify(param), {
        //     onResponse: result => {
        //     },
        //     onError: function (error) {
        //         Toast.fail(error, 1);
        //     }
        // });
    }

    inputTheirstFOnChange = (value) => {
        this.setState({
            inputFirstValue: value
        })
        console.log(value, "vvv")
    }


    execClick = () => {
        document.execCommand("copy");
    }


    execCopy = (event) => {
        var thisDiv = document.getElementById("textDiv2");
        if (this.isIE()) {
            if (window.clipboardData) {
                window.clipboardData.setData("Text", thisDiv.textContent);
                alert(window.clipboardData.getData("Text"));
            }
        } else {
            event.preventDefault();
            if (event.clipboardData) {
                event.clipboardData.setData("text/plain", thisDiv.textContent);
                alert(event.clipboardData.getData("text"));
            }
        }
    }

    isIE = () => {
        var input = window.document.createElement("input");
        //"!window.ActiveXObject" is evaluated to true in IE11
        if (window.ActiveXObject === undefined) return null;
        if (!window.XMLHttpRequest) return 6;
        if (!window.document.querySelector) return 7;
        if (!window.document.addEventListener) return 8;
        if (!window.atob) return 9;
        //"!window.document.body.dataset" is faster but the body is null when the DOM is not
        //ready. Anyway, an input tag needs to be created to check if IE is being
        //emulated
        if (!input.dataset) return 10;
        return 11;
    }

    inputOnvillageNameChange = (value) => {
        this.setState({
            villageName: value
        })
    }

    editorVillageName = () => {
        $(".editorPop").show();
        $(".villageMask").show();
    }

    editorCodeName = () => {
        $(".codePop").show();
        $(".villageMask").show();
    }

    editorGroupName = () => {
        $(".villageMask").show();
        $(".popBox").show();
        $(".btnGroup").show();
        $(".btnSure").hide();
    }

    cancelGroupInput = () => {
        $(".villageMask").hide();
        $(".popBox").hide();
    }

    sureVillageName = () => {
        $(".villageMask").hide();
        $(".editorPop").hide();
        console.log(this.state.villageName)
    }
    cancelVillageName = () => {
        $(".villageMask").hide();
        $(".editorPop").hide();
        console.log("cancel", this.state.villageName)
    }
    sureCodeName = () => {
        $(".villageMask").hide();
        $(".codePop").hide();
        console.log(this.state.villageName)
    }
    cancelCodeName = () => {
        $(".villageMask").hide();
        $(".codePop").hide();
        console.log("cancel", this.state.villageName)
    }


    addCourse = () => {
        $(".coursePop").show();
        $(".villageMask").show();
    }

    sureCourseData = () => {
        $(".coursePop").hide();
        $(".villageMask").hide();
    }

    canceCourseData = () => {
        $(".coursePop").hide();
        $(".villageMask").hide();
    }


    inputOnCourseNameChange = (value) => {
        this.setState({
            courseNameChangeValue: value
        })
    }
    inputOnTeacherChange = (value) => {
        this.setState({
            teacherChangeValue: value
        })
    }
    inputOnCoursePlaceChange = (value) => {
        this.setState({
            coursePlaceChangeValue: value
        })
    }


    sumPeople=()=>{
        $(".attPop").show();
        $(".villageMask").show();
    }

    sumPeopleName=()=>{
        $(".attPop").hide();
        $(".villageMask").hide();
    }
    cancelPeopleName=()=>{
        $(".attPop").hide();
        $(".villageMask").hide();
    }
    render () {
        return (
            <div id="VillageCardSystemHome" style={{
                height: document.body.clientHeight
            }}>
                <div className='my_flex wrap'>
                    <div className='leftBox'>
                        <div className='myMsg my_flex'>
                            <img src="http://60.205.86.217/upload9/2019-04-11/16/fa43bd1e-dc0c-42ad-930a-50d19a8bfe2f.png?size=100x100" alt="" />
                            <span>村村向上</span>
                        </div>
                        <div className='leftAccordion'>
                            <div>
                                <div onClick={this.onChangeLeft.bind(this, 0)}>成员列表</div>
                                <div onClick={this.onChangeLeft.bind(this, 1)}>文章审核</div>
                                <div className="lookThrough" style={{ display: "none" }}>
                                    {
                                        this.state.articalType.map((v, i) => {
                                            return <div onClick={this.clickArticalItem.bind(this, v)}>{v.title}</div>
                                        })
                                    }
                                </div>
                                <div onClick={this.onChangeLeft.bind(this, 2)}>班牌编辑</div>
                                <div className="cardEdit" style={{ display: "none" }}>
                                    {
                                        this.state.editCardType.map((v, i) => {
                                            return <div className={v.active ? "haha" : "hehe"} onClick={this.clickCardItem.bind(this, v)}>{v.title}</div>
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                        <div className='quiteBtn'>
                            管理员
                            <span>退出登录</span>
                        </div>
                    </div>
                    <div className='rightBox rightBoxFirst'>
                        <div className="rightHeader my_flex">
                            <span>李家村</span>
                            <div className='btn'>
                                <span onClick={this.editorVillageName}>编辑名称</span>
                                <span onClick={this.editorGroupName}>编辑分组</span>
                                <span onClick={this.editorCodeName}>邀请码</span>
                            </div>
                        </div>
                        <div className="rightContent">
                            <Accordion accordion openAnimation={{}} className="my-accordion" onChange={this.onChangeRightContent}>
                                <Accordion.Panel header="Title 1">
                                    <List className="my-list">
                                        <List.Item>content 1</List.Item>
                                        <List.Item>content 2</List.Item>
                                        <List.Item>content 3</List.Item>
                                    </List>
                                </Accordion.Panel>
                                <Accordion.Panel header="Title 2" className="pad">this is panel content2 or other</Accordion.Panel>
                                <Accordion.Panel header="Title 3" className="pad">
                                    text text text text text text text text text text text text text text text
                                </Accordion.Panel>
                            </Accordion>
                        </div>
                    </div>
                    <div className="rightBox rightBoxSecond" style={{ display: "none" }}>
                        <iframe src="" className="iframeDiv" frameborder="0"></iframe>
                    </div>
                    <div className="rightBox rightBoxThird" style={{ display: "none" }}>
                        <div className="villageImg">
                            <div>
                                <div>
                                    {this.state.villageName}
                                </div>
                                <span>
                                    上传
                                </span>
                            </div>
                        </div>
                        <div className="dangke" style={{ display: "none" }}>

                            <div>
                                <div>
                                    {this.state.villageName}
                                </div>
                                <span onClick={this.addCourse}>
                                    添加课程
                                </span>
                            </div>
                        </div>
                        <div className="dangkeAtt" style={{ display: "none" }}>

                            <div>
                                <div>
                                    {this.state.villageName}
                                </div>
                                <span onClick={this.sumPeople}>
                                    打卡
                                </span>
                            </div>
                        </div>
                        <div className="pushNotify" style={{ display: "none" }}>
                            <div>
                                <div>
                                    {this.state.villageName}
                                </div>
                                <span>
                                    发布通知
                                </span>
                            </div>
                        </div>
                        <div className="hornorVillages" style={{ display: "none" }}>
                            <div>
                                <div>
                                    {this.state.villageName}
                                </div>
                                <div>
                                    content
                                </div>
                            </div>
                        </div>
                        <div className="learnList" style={{ display: "none" }}>

                            <div>
                                <div>
                                    {this.state.villageName}
                                </div>
                                <div>
                                    content
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="villageMask" ></div>
                <div className='popBox villageMaskInner' >
                    <div>
                        <div className="editHeader">
                            编辑分组
                        </div>
                        <div className="editCont">
                        </div>
                        <div>
                            {this.state.inputDivs}
                            <span className="editBtn" onClick={this.addInput}>
                                添加
                            </span>
                            <div className='submitBtn btnSure'>
                                <span onClick={this.submitInput}>确定</span>
                            </div>
                            <div className='submitBtn btnGroup' style={{ display: "none" }}>
                                <div className="my_flex">
                                    <span onClick={this.submitInput}>确定</span>
                                    <span onClick={this.cancelGroupInput}>取消</span>
                                </div>
                            </div>
                        </div>
                    </div>


                </div>

                {/* 编辑名称 */}
                <div className="editorPop villageMaskInner" style={{ display: "none" }}>
                    <InputItem
                        placeholder="请输入村名称"
                        onChange={this.inputOnvillageNameChange}
                        value={this.state.villageName}
                    >
                    </InputItem>
                    <div className='submitBtn'>
                        <div className='my_flex'>
                            <span onClick={this.sureVillageName}>确定</span>
                            <span onClick={this.cancelVillageName}>取消</span>
                        </div>
                    </div>
                </div>

                {/* 邀请码 */}
                <div className="codePop villageMaskInner" style={{ display: "none" }}>
                    <div className="editHeader">
                        邀请码
                                </div>
                    <div className="editCont">
                        <div id="textDiv2">这里是要复制的文字2eee</div>
                        <a onClick={this.execClick} onCopy={this.execCopy}>复制</a>
                        <div className='submitBtn'>
                            <div className='my_flex'>
                                <span onClick={this.sureCodeName}>确定</span>
                                <span onClick={this.cancelCodeName}>取消</span>
                            </div>
                        </div>
                    </div>
                </div>


                {/* 添加课程 */}
                <div className="coursePop villageMaskInner" style={{ display: "none" }}>
                    <InputItem
                        placeholder="请输入组课程名称"
                        onChange={this.inputOnCourseNameChange}
                        value={this.state.courseNameChangeValue}
                    >
                        <div>课程名称</div>
                    </InputItem>
                    <InputItem
                        placeholder="请输入授课教师"
                        onChange={this.inputOnTeacherChange}
                        value={this.state.teacherChangeValue}
                    >
                        <div>授课教师</div>
                    </InputItem>
                    <InputItem
                        placeholder="请输入上课地点"
                        onChange={this.inputOnCoursePlaceChange}
                        value={this.state.coursePlaceChangeValue}
                    >
                        <div>上课地点</div>
                    </InputItem>
                    <DatePicker
                        value={this.state.date}
                        onChange={date => this.setState({ date })}
                    >
                        <List.Item arrow="horizontal">Datetime</List.Item>
                    </DatePicker>
                    <div>
                        添加课程封面
                    </div>
                    <div className='submitBtn'>
                        <div className='my_flex'>
                            <span onClick={this.sureCourseData}>确定</span>
                            <span onClick={this.canceCourseData}>取消</span>
                        </div>
                    </div>
                </div>
                {/* 打卡*/}
                <div className="attPop villageMaskInner" style={{ display: "none" }}>
                    <div>
                        <InputItem
                            placeholder="请输入签到人数"
                            onChange={this.inputSumPeopleNameChange}
                            value={this.state.sumPeopleNameValue}
                        >
                        <div>实到人数</div>
                        </InputItem>
                    </div>
                    <div className='submitBtn'>
                            <div className='my_flex'>
                                <span onClick={this.sumPeopleName}>确定</span>
                                <span onClick={this.cancelPeopleName}>取消</span>
                            </div>
                        </div>
                </div>
            </div>
        )
    }
}