import React from 'react';
import { WhiteSpace, SearchBar, Button, WingBlank, Result, Toast, InputItem } from 'antd-mobile';
var calm;
export default class villageReg extends React.Component {
    constructor(props) {
        super(props);
        calm = this;
        this.state = {
        }
    }
    componentWillReceiveProps () {
        window.addEventListener('resize', this.onWindwoResize);
    }
    componentDidMount () {
        document.title = "注册页面";
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var userId = searchArray[0].split('=')[1];
        calm.setState({
            userId
        })

    }


    exitSchoolInput = () => {
        this.setState({ responseList: [] });
        $('.updateModel').slideUp();
        $('.mask').hide();
        this.setState({ inputValue: '' })
    };

    searchInputFcous = () => {
        $(".searchDiv input").focus();
    }


    /**
    * 根据学校名称搜索学校
    * getSchoolsBySchoolName(String schoolName,String pageNo)
    */
    getSchoolsBySchoolName = () => {
        var _this = this;
        if (this.state.inputValue === '') {
            Toast.fail('请输入内容', 1, null, false);
            return
        }
        var param = {
            "method": 'getSchoolsBySchoolName',
            "schoolName": this.state.inputValue,
            "pageNo": -1,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: (result) => {
                if (result.msg == '调用成功' || result.success == true) {
                    if (result.response.length === 0) {
                        Toast.info('未找到相关学校', 1, null, false)
                    } else {
                        _this.buildSchoolList(result.response)
                    }
                } else {
                    Toast.fail(result.msg, 1, null, false);
                }
            },
            onError: function (error) {
                Toast.warn('保存失败');
            }
        });
    };

    buildSchoolList = (data) => {
        var _this = this;
        var arr = [];
        data.forEach(function (v, i) {
            arr.push(<li
                className='line_publicD noomPowerList textOver'
                onClick={() => {
                    _this.schoolItemOnClick(v);
                }}>{v.name}</li>)
        });
        this.setState({ responseList: arr })
    };

    schoolItemOnClick = (data) => {
        this.exitSchoolInput();
        this.setState({ schoolName: data.name, schoolId: data.id, schoolClassName: 'color_3' })
    };

    schoolOnClick = () => {
        $('.updateModel').slideDown();
        $('.mask').show();
    };


    /**
   * 输入框改变的回调
   */
    inputOnChange = (value) => {
        this.setState({
            codeValue: value
        })
        console.log(value, "vvvv")
    }

    //姓名输入
    inputOnNameChange = (value) => {
        this.setState({
            nameValue: value
        })
        console.log(value, "vvvv")
    }


    //邀请码来源
    showCode = () => {
        $(".codeSource").show();
    }

    render () {
        return (
            <div id='villageReg'>
                <div onClick={this.schoolOnClick}>请选择自己村子所在名称</div>
                <div onClick={this.schoolOnClick}>请选择自己小组所在名称</div>
                <InputItem
                    className="add_element"
                    placeholder="请输入邀请码"
                    value={this.state.codeValue}
                    onChange={this.inputOnChange}
                >
                </InputItem>
                <InputItem
                    className="add_element"
                    placeholder="请输入自己的真实姓名"
                    value={this.state.nameValue}
                    onChange={this.inputOnNameChange}
                >
                </InputItem>
                <div onClick={this.showCode}>邀请码来源</div>
                <div className="codeSource" style={{ display: "none" }}>邀请码来源于布拉布拉布拉布拉</div>
                <div className="stuAccountRegist">
                    <div className="mask" onClick={this.exitSchoolInput} style={{ display: 'none' }}></div>
                    <div className='updateModel' style={{ display: 'none' }}>
                        <div className='searchDiv'>
                            <input type="text" value={this.state.inputValue} onClick={this.searchInputFcous} onChange={this.schoolNameOnChange}
                                placeholder='请输入搜索内容' />
                            <span onClick={this.getSchoolsBySchoolName}>搜索</span>
                        </div>
                        <div className='cont'>
                            {this.state.responseList}
                        </div>
                    </div>
                </div>
                <div>确定</div>
            </div>
        )
    }
}