import React from "react";
import { ListView, PullToRefresh, Toast, Accordion, List, InputItem } from 'antd-mobile';
import Input from "antd-mobile/lib/input-item/Input";
import '../css/VillageCardSystemHome.less'
var calm;
export default class VillageCardSystemHome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            articalType: [
                {
                    title: "待审核", active: "false"
                },
                {
                    title: "已审核", active: "false"
                },
            ],
            editCard: [
                {
                    title: "乡村振兴", active: "false"
                },
                {
                    title: "党课预告", active: "false"
                },
                {
                    title: "党课考勤", active: "false"
                },
                {
                    title: "发布通知", active: "false"
                },
                {
                    title: "荣誉村民", active: "false"
                },
                {
                    title: "学习榜", active: "false"
                },
            ],
            inputDivs: [],
            addInputList: [{
                inputValue: "",
            }],
            inputFirstValue: ""
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

    }

    onChangeLeft = (key) => {
        console.log(key, "onChangeLeft");
    }
    onChangeRightContent = (key) => {
        console.log(key);
    }

    clickArticalItem = (index) => {
        console.log(index, "index")
    }
    clickCardItem = (index) => {
        console.log(index, "index")
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

    inputOnvillageNameChange=(value)=>{
        this.setState({
            villageName:value
        })
    }

    editorVillageName=()=>{
        $(".editorPop").show();
        $(".villageMask").show();
    }

    editorCodeName=()=>{
        $(".codePop").show();
        $(".villageMask").show();
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
                            <Accordion accordion openAnimation={{}} className="my-accordion" onChange={this.onChangeLeft}>
                                <Accordion.Panel header="成员列表">
                                </Accordion.Panel>
                                <Accordion.Panel header="文章审核" className="pad">
                                    {
                                        this.state.articalType.map((v, i) => {
                                            return <div onClick={this.clickArticalItem.bind(this, i)}>{v.title}</div>
                                        })
                                    }
                                </Accordion.Panel>
                                <Accordion.Panel header="班牌编辑" className="pad">
                                    {
                                        this.state.editCard.map((v, i) => {
                                            return <div onClick={this.clickCardItem.bind(this, i)}>{v.title}</div>
                                        })
                                    }
                                </Accordion.Panel>
                            </Accordion>
                        </div>
                        <div className='quiteBtn'>
                            管理员
                            <span>退出登录</span>
                        </div>
                    </div>
                    <div className='rightBox'>
                        <div className="rightHeader my_flex">
                            <span>李家村</span>
                            <div className='btn'>
                                <span onClick={this.editorVillageName}>编辑名称</span>
                                <span>编辑分组</span>
                                <span  onClick={this.editorCodeName}>邀请码</span>
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
                            <div className='submitBtn'>
                                <span onClick={this.submitInput}>确定</span>
                            </div>
                        </div>
                    </div>


                </div>

                {/* 编辑名称 */}
                <div className="editorPop villageMaskInner" style={{display:"none"}}>
                    <InputItem
                        placeholder="请输入村名称"
                        onChange={this.inputOnvillageNameChange}
                        value={this.state.villageName}
                    >
                    </InputItem>
                    <div className='submitBtn'>
                        <div className='my_flex'>
                            <span>确定</span>
                            <span>取消</span>
                        </div>
                    </div>
                </div>

                {/* 邀请码 */}
                <div className="codePop villageMaskInner" style={{display:"none"}}>
                    <div className="editHeader">
                        邀请码
                                </div>
                    <div className="editCont">
                        <div id="textDiv2">这里是要复制的文字2eee</div>
                        <a onClick={this.execClick} onCopy={this.execCopy}>复制</a>
                        <div className='submitBtn'>
                            <div className='my_flex'>
                                <span>确定</span>
                                <span>取消</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}