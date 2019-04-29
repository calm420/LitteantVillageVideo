import React from 'react';
import {
    Toast, DatePicker, ListView, TextareaItem, Button, List, Picker, Tag, Radio, Checkbox, Flex
} from 'antd-mobile';
const CheckboxItem = Checkbox.CheckboxItem;
const AgreeItem = Checkbox.AgreeItem;

const RadioItem = Radio.RadioItem;
const Item = List.Item;
const Brief = Item.Brief;

const dataSource = new ListView.DataSource({
    rowHasChanged: (row1, row2) => row1 !== row2,
});

var theLike;
export default class wrongQuestionList extends React.Component {

    constructor(props) {
        super(props);
        this.initDataSource = [];
        theLike = this;
        this.state = {
            dataList: [
                { value: 0, label: 'Ph.D.' },
                { value: 1, label: 'Bachelor' },
                { value: 2, label: 'College diploma' },
            ],
            classId: []
        }
    }

    componentDidMount () {
        Bridge.setShareAble("false");
        // document.title = '校园自媒体';
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var userId = searchArray[0].split('=')[1];
        var pwd = searchArray[1].split('=')[1];
        this.setState({
            userId, pwd
        })
        window.addEventListener('resize', this.onWindwoResize);
        this.getClazzesByAccount(userId);
    }

    //监听窗口改变时间
    onWindwoResize () {

    }

    onSelectChange = (e, data, index) => {
        if (e.target.checked) {
            var allArr = [];
            allArr.push(data)
            this.setState({
                classId: this.state.classId.concat(allArr)
            }, () => {
                console.log(this.state.classId, "classId1")
            })
        } else {
            this.state.classId.forEach((v, i) => {
                if (data.value == v.value) {
                    this.state.classId.splice(i, 1);
                }
                this.setState({
                    classId: this.state.classId
                }, () => {
                    console.log(this.state.classId, "classId2")
                })
            })
        }
    }

    /**
     * 获取评论列表
     * **/
    getClazzesByAccount (userId) {
        var param = {
            "method": 'getClazzesByAccount',
            "account": "te" + userId,
        };
        WebServiceUtil.requestLittleAntApi9006(JSON.stringify(param), {
            onResponse: result => {
                console.log(result, '评论列表');
                var arr = [];
                result.response.forEach((v, i) => {
                    console.log(v, "v")
                    arr.push({
                        value: v.id,
                        label: v.grade.name + v.name
                    })
                })
                this.setState({
                    dataList: arr
                })
                console.log(arr, "arr")
            },
            onError: function (error) {
                Toast.fail(error, 1);
            }
        });
    }
    //点击确定
    sureSelect = () => {
        var idArr = []
        this.state.classId.forEach((v, i) => {
            idArr.push(v.value)
        })
        var url = WebServiceUtil.mobileServiceURL + "wrongQuestionListDetail?classIds=" + idArr.join(",") + "&uid=" + this.state.userId + "&pwd=" + this.state.pwd + "&cid=2&finalProject=语文";
        var data = {
            method: 'openNewPage',
            url: url
        };
        Bridge.callHandler(data, null, function (error) {
            window.location.href = url;
        });
    }

    toAddTopic = () => {
        var url = WebServiceUtil.mobileServiceURL + "publishWrongQuestion?userId=" + this.state.userId;
        var data = {
            method: 'openNewPage',
            url: url
        };
        Bridge.callHandler(data, null, function (error) {
            window.location.href = url;
        });
    }
    render () {
        return (
            <div id="wrongQuestionList" style={{ height: document.body.clientHeight }}>
                <List>
                    {this.state.dataList.map((v, i) => (
                        <CheckboxItem key={v.value} onChange={(checked) => this.onSelectChange(checked, v, i)}>
                            {v.label}
                        </CheckboxItem>
                    ))}
                </List>
                <div onClick={this.sureSelect}>确定</div>
                <div className="addTopic" onClick={this.toAddTopic}></div>
            </div>
        );
    }

}