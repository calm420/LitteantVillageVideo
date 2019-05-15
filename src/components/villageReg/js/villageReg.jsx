import React from 'react';
import { WhiteSpace, SearchBar, Button, WingBlank, Result, Toast, InputItem } from 'antd-mobile';
import '../css/villageReg.less'
var calm;
export default class villageReg extends React.Component {
    constructor(props) {
        super(props);
        calm = this;
        this.state = {
            schoolName:"请选择自己所在村子",
            groupName:"请选择自己所在小组",
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
    searchInputFcous2 = () => {
        $(".searchDiv2 input").focus();
    }


    /**
    * 根据学校名称搜索学校
    * getSchoolsBySchoolName(String schoolName,String pageNo)
    */
   getVillageInfoByVillageName = () => {
        var _this = this;
        if (this.state.inputValue === '') {
            Toast.fail('请输入内容', 1, null, false);
            return
        }
        var param = {
            "method": 'getVillageInfoByVillageName',
            "name": this.state.inputValue,
        };
        WebServiceUtil.requestLittleAntApi6013(JSON.stringify(param), {
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
    /**
    * 根据学校名称搜索学校
    * getSchoolsBySchoolName(String schoolName,String pageNo)
    */
   getVillageInfoByVillageName2 = () => {
        var _this = this;
        
        if (this.state.inputValue2 === '') {
            Toast.fail('请输入内容', 1, null, false);
            return
        }
        var param = {
            "method": 'getVillageGroupByGroupName',
            "groupName": this.state.inputValue2,
            "villageId":this.state.schoolId
        };
        WebServiceUtil.requestLittleAntApi6013(JSON.stringify(param), {
            onResponse: (result) => {
                if (result.msg == '调用成功' || result.success == true) {
                    if (result.response.length === 0) {
                        Toast.info('未找到相关学校', 1, null, false)
                    } else {
                        _this.buildSchoolList2(result.response)
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

    buildSchoolList2 = (data) => {
        var _this = this;
        var arr = [];
        data.forEach(function (v, i) {
            arr.push(<li
                className='line_public noomPowerList textOver'
                onClick={() => {
                    _this.schoolItemOnClick2(v);
                }}>{v.groupName}</li>)
        });
        this.setState({ responseList2: arr })
    };
    schoolItemOnClick2 = (data) => {

        console.log(data,"data")
        this.exitSchoolInput2();
        this.setState({ groupName: data.groupName, groupId: data.id, })
    };

    exitSchoolInput2 = () => {
        this.setState({ responseList2: [] });
        $('.updateModel2').slideUp();
        $('.mask2').hide();
        this.setState({ inputValue2: '' })
    };
    buildSchoolList = (data) => {
        var _this = this;
        var arr = [];
        data.forEach(function (v, i) {
            arr.push(<li
                className='line_public noomPowerList textOver'
                onClick={() => {
                    _this.schoolItemOnClick(v);
                }}>{v.villageName}</li>)
        });
        this.setState({ responseList: arr })
    };



    schoolItemOnClick = (data) => {

        console.log(data,"data")
        this.exitSchoolInput();
        this.setState({ schoolName: data.villageName, schoolId: data.villageId, schoolClassName: 'color_3' })
    };

    schoolOnClick = () => {
        $('.updateModel').slideDown();
        $('.mask').show();
    };
    schoolOnClick2 = () => {
        if (this.state.schoolId == undefined) {
            Toast.fail('请先选择村', 1, null, false);
            return
        }
        $('.updateModel2').slideDown();
        $('.mask2').show();
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
        $(".villageMask").show();
        $(".codeSource").show();
    }

    schoolNameOnChange = (e) => {
        this.setState({ inputValue: e.target.value })
    };
    schoolNameOnChange2 = (e) => {
        this.setState({ inputValue2: e.target.value })
    };

    submitReg=()=>{
        if(this.state.schoolId == undefined){
            Toast.fail('请选择村', 1, null, false);
            return
           }
       if(this.state.groupId == undefined){
        Toast.fail('请选择组', 1, null, false);
        return
       }
       if(this.state.nameValue == undefined){
        Toast.fail('请输入姓名', 1, null, false);
        return
       }
       if(this.state.codeValue == undefined){
        Toast.fail('请输入邀请码', 1, null, false);
        return
       }
        var _this = this;
        var param = {
            "method": 'updateLittleVillageUser',
            "userId": calm.state.userId,
            "groupId":this.state.groupId,
            "villageId":this.state.schoolId,
            "userName":this.state.nameValue,
            "joinCode":this.state.codeValue
        };
        WebServiceUtil.requestLittleAntApi6013(JSON.stringify(param), {
            onResponse: (result) => {
                if (result.msg == '调用成功' || result.success == true) {
                    Toast.info('注册完成',1);
                    var data = {
                        method: 'backHome',
                    };
                    Bridge.callHandler(data, null, function (error) {
                    });
                } else {
                    Toast.fail(result.msg, 1, null, false);
                }
            },
            onError: function (error) {
                Toast.warn('保存失败');
            }
        });
    }
    inputRefClick = ()=>{
        this.inputRef.focus();
    }
    
    inputCodeClick = ()=>{
        this.inputCodeRef.focus();
    }
    
    render () {
        return (
            <div id='villageReg'>
                <div className="p20"></div>
                <div className="topNav">
                    <i className='icon_back'></i>
                    完善信息
                </div>
                <div className="regContent">
                    <div className={this.state.schoolName == '请选择自己所在村子' ? 'inputWrap activeDiv line_public' : 'inputWrap activeDiv line_public color_3'} onClick={this.schoolOnClick}>{this.state.schoolName}<i></i></div>
                    <div className={this.state.groupName == '请选择自己所在小组' ? 'inputWrap activeDiv line_public' : 'inputWrap activeDiv line_public color_3'} onClick={this.schoolOnClick2}>{this.state.groupName}<i></i></div>
                    <div onclick={this.inputRefClick}>
                    <InputItem
                        className="add_element"
                        placeholder="请输入自己真实姓名"
                        value={this.state.nameValue}
                        onChange={this.inputOnNameChange}
                        ref={el => this.inputRef = el}
                    >
                    </InputItem>
                    </div>
                    <div onClick={this.inputCodeClick}>
                    <InputItem
                        className="add_element"
                        placeholder="请输入邀请码"
                        value={this.state.codeValue}
                        onChange={this.inputOnChange}
                        ref={el => this.inputCodeRef = el}
                    >
                    </InputItem>
                    </div>
                   

                    
                    {/*<div className='codeBtn' onClick={this.showCode}>邀请码请联系村管理员</div>*/}
                    <div className='codeBtn'>邀请码请联系村管理员</div>
                </div>

                <div className="villageMask"  style={{ display: "none" }}></div>
                {/*<div className="codeSource villageMaskInner" style={{ display: "none" }}>邀请码来源于布拉布拉布拉布拉</div>*/}
                <div className="stuAccountRegist">
                    <div className="mask" onClick={this.exitSchoolInput} style={{ display: 'none' }}></div>
                    <div className='updateModel villageModal' style={{ display: 'none' }}>
                        <div className='searchDiv'>
                            <input type="text" value={this.state.inputValue} onClick={this.searchInputFcous} onChange={this.schoolNameOnChange}
                                placeholder='请输入搜索内容' />
                            <span onClick={this.getVillageInfoByVillageName}>搜索</span>
                        </div>
                        <div className='cont'>
                            {this.state.responseList}
                        </div>
                    </div>
                </div>
                <div className="stuAccountRegist">
                    <div className="mask2" onClick={this.exitSchoolInput2} style={{ display: 'none' }}></div>
                    <div className='updateModel2 villageModal' style={{ display: 'none' }}>
                        <div className='searchDiv2'>
                            <input type="text" value={this.state.inputValue2} onClick={this.searchInputFcous2} onChange={this.schoolNameOnChange2}
                                placeholder='请输入搜索内容' />
                            <span onClick={this.getVillageInfoByVillageName2}>搜索</span>
                        </div>
                        <div className='cont'>
                            {this.state.responseList2}
                        </div>
                    </div>
                </div>
                <div className='submitBtn_gradient noPosition'><span onClick={this.submitReg}>完成</span></div>
            </div>
        )
    }
}