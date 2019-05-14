import React from "react";
import { ListView, PullToRefresh, Toast, Accordion, List,InputItem } from 'antd-mobile';
import Input from "antd-mobile/lib/input-item/Input";

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
            addInputList: [],
        }
    }

    componentDidMount () {
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
                    <span>删除</span>
                </div>
            </div>)
        })
        this.setState({ inputDivs: arr })
    }

    submitInput = ()=>{
        var inputArr = []
        this.state.addInputList.forEach((v,i)=>{
            inputArr.push(v.inputValue)
        })
        console.log("",inputArr)
    }

    render () {
        return (
            <div id="myCollection" style={{
                height: document.body.clientHeight
            }}>
                <div>
                    <div>
                        <img src="http://60.205.86.217/upload9/2019-04-11/16/fa43bd1e-dc0c-42ad-930a-50d19a8bfe2f.png?size=100x100" alt="" />
                        <span>村村向上</span>
                    </div>
                    <div>
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
                    <div>
                        管理员
                    <span>退出登录</span>
                    </div>
                </div>
                <div>
                    <div className="rightHeader">
                        <span>李家村</span>
                        <div>
                            <button>编辑名称</button>
                            <button>编辑介绍</button>
                            <button>邀请码</button>
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

                <div>
                    <div>
                        <div className="editHeader">
                            编辑分组
                        </div>
                        <input type="text" placeholder="请输入分组名称" />
                        <span className="editBtn" onClick={this.addInput}>
                            添加
                        </span>
                        <div>
                            {this.state.inputDivs}
                            <span onClick={this.submitInput}>确定</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}