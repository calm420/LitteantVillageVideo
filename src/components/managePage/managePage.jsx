import React from 'react';
import { WhiteSpace, Modal, SearchBar, Button, WingBlank, Result, Toast, InputItem } from 'antd-mobile';
var calm;
import "./managePage.less"

const alert = Modal.alert;
export default class villageReg extends React.Component {
    constructor(props) {
        super(props);
        calm = this;
        this.state = {
            villageCradImg: ""

        }
    }
    componentWillReceiveProps () {
        window.addEventListener('resize', this.onWindwoResize);
    }
    componentDidMount () {
        document.title = "管理员页面";
    }

    //姓名输入
    inputOnNameChange = (value) => {
        this.setState({
            nameValue: value
        })
        console.log(value, "vvvv")
    }
    //姓名输入
    inputOnChange = (value) => {
        this.setState({
            codeValue: value
        })
        console.log(value, "vvvv")
    }
    //姓名输入
    inputOnChangeVillageName = (value) => {
        this.setState({
            villageNameValue: value
        })
        console.log(value, "vvvv")
    }


    submit = () => {
        var param = {
            "method": 'registerAdmin',
            "account": this.state.codeValue,
            "password": this.state.codeValue,
            "villageName": this.state.villageNameValue,
            "backgroundImg": this.state.villageCradImg,
        };
        WebServiceUtil.requestLittleAntApi6013(JSON.stringify(param), {
            onResponse: (result) => {
                if (result.msg == '调用成功' || result.success == true) {
                    Toast.info("创建成功", 1)
                } else {
                    Toast.fail(result.msg, 1, null, false);
                }
            },
            onError: function (error) {
                Toast.warn('保存失败');
            }
        });
    }

    /**
    * 获取图片路径
    */
    getImageCard () {
        $('#cradImg').unbind("change");
        $('.cradImg').bind('change', function (evt) {
            if (evt.target.files[0]) {
                var formData = new FormData();
                formData.append("file" + 0, evt.target.files[0]);
                formData.append("name" + 0, evt.target.files[0].name);
                $.ajax({
                    type: "POST",
                    url: "https://jiaoxue.maaee.com:8890/Excoord_Upload_Server/file/upload",
                    enctype: 'multipart/form-data',
                    data: formData,
                    // 告诉jQuery不要去处理发送的数据
                    processData: false,
                    // 告诉jQuery不要去设置Content-Type请求头
                    contentType: false,
                    xhr: function () {        //这是关键  获取原生的xhr对象  做以前做的所有事情
                        var xhr = jQuery.ajaxSettings.xhr();
                        xhr.upload.onload = function () {
                            // console.log('上传完成隐藏进度条');
                            $('.progressText').text('上传完成')
                            setTimeout(function () {
                                $('#progress')[0].style.display = 'none';
                                $('.progress-bar')[0].style.width = '0%';
                                $('.progressText').text('进度: 0%');
                            }, 500);
                        };
                        xhr.upload.onprogress = function (ev) {
                            console.log(ev, "ev")
                            if (ev.loaded == ev.total) {
                                $('.progress-bar')[0].style.width = '100%';
                            }
                            if ($('#progress')[0].style.display == 'none') {
                                $('#progress')[0].style.display = 'block';
                            } else {
                                console.log("jinlaile")
                                // console.log(((ev.loaded / ev.total) * 100).toFixed(0) + '%', 'ev');
                                //显示进度条
                                $('.progress-bar')[0].style.width = ((ev.loaded / ev.total) * 100).toFixed(0) + '%';
                                console.log($('.progress-bar')[0].style.width, "hhehehhe")
                                $('.progressText').text('进度: ' + ((ev.loaded / ev.total) * 100).toFixed(0) + '%')
                            }
                        };
                        return xhr;
                    },
                    success: function (res) {
                        console.log(res, "res1111")
                        calm.setState({
                            villageCradImg: res
                        })
                    }
                });
            }
        });
    }
    inputRefClick = () => {
        this.inputRef.focus();
    }

    inputCodeClick = () => {
        this.inputCodeRef.focus();
    }

    inputVillageCodeClick = () => {
        this.inputVillageCodeRef.focus();
    }



    render () {
        return (
            <div id="managePage">
              <div id="progress" style={{ display: "none" }}>
                    <div className="progress">
                        <div className="progress-bar" style={{ width: 0 }}></div>
                    </div>
                    <div className="progressText">进度: 0%</div>
                </div>
                <div className="bindCard">
                    <div className="editCont editCont-Notitle">
                        <div className="bindCard-item" onClick={this.inputRefClick}>
                            <div className="bindCard-itemLeft">管理员</div>
                            <InputItem
                                className="add_element"
                                placeholder="请设置管理员账号"
                                value={this.state.nameValue}
                                onChange={this.inputOnNameChange}
                                ref={el => this.inputRef = el}
                            >
                            </InputItem>
                        </div>
                        <div className="bindCard-item" onClick={this.inputCodeClick}>
                            <div className="bindCard-itemLeft">密码</div>
                            <InputItem
                                className="add_element"
                                placeholder="请设置管理员密码"
                                value={this.state.codeValue}
                                onChange={this.inputOnChange}
                                type="password"
                                ref={el => this.inputCodeRef = el}
                            >
                            </InputItem>
                        </div>
                        <div className="bindCard-item" onClick={this.inputVillageCodeClick}>
                            <div className="bindCard-itemLeft">村民</div>
                            <InputItem
                                className="add_element"
                                placeholder="请输入该管理员所对应的村名"
                                value={this.state.villageNameValue}
                                onChange={this.inputOnChangeVillageName}
                                ref={el => this.inputVillageCodeRef = el}
                            >
                            </InputItem>
                        </div>
                        <div className="bindCard-item">
                            <div className="bindCard-itemLeft">上传村图</div>
                            <div className="parentDiv">
                                <button className="editBtn"></button>
                                <input className="calm40 cradImg" name="cradImg" id="cradImg" onClick={this.getImageCard} type="file" accept="image/jpg/png/jpeg" class="hidd" />
                                <span style={{ display: this.state.villageCradImg == "" ? "none" : "inline-block" }} className="photo-add">
                            <img src={this.state.villageCradImg} />
                        </span>
                            </div>
                        </div>
                    </div>
                    <div className="submitBtn">
                        <Button onClick={this.submit}>提交</Button>
                    </div>
                </div>


            </div>
        )
    }
}