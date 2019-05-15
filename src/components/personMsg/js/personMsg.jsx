import React from 'react';
import { Modal} from 'antd-mobile';
import '../css/personMsg.less'
const prompt = Modal.prompt;
var calm;
export default class personMsg extends React.Component {
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
        document.title = "完善资料";
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var userId = searchArray[0].split('=')[1];
        calm.setState({
            userId
        })

    }
 //修改头像---调用客户端
    updatePhoto = () => {
        // var str = "http://60.205.86.217/upload8/2018-10-30/13/bb67bfb7-f04f-42f5-8435-fc8659c96cc1.jpeg";
        // this.setState({
        //     photoAddr: str
        // }, () => {
        //     this.updateWatch2g()
        // })
        var data = {
            method: 'selectedImage'
        };
        Bridge.callHandler(data, (photoAddr) => {
            this.setState({ photoAddr: photoAddr }, () => {
                this.updateWatch2g();
                // setTimeout(() => {
                //     this.getWatch2gById(this.state.watchId)
                // }, 300)
            });
        }, function (error) {
        });
    }
    changeName = ()=>{
        this.showText(1,'sdmjdo');
    };
    changePhone = ()=>{
        this.showText(2,'13333');
    };

    showText = (type , defaultSting) =>{
            var  toststing ;
            if (type == 1){
            toststing='修改名字'
        }
        if (type == 2) {
            toststing='修改手机号码';
        }


        prompt(toststing, '', [
            {
                text: '取消', onPress: value => {
                    this.setState({

                    }, () => {
                    });
                },
            },
            {
                text: '确定', onPress: value => {
                    this.setState({
                    }, () => {
                        if (type == 1 && value.length>0){
                            this.serverChangeName(value);
                        }
                        if (type == 2 && value.length>0){
                            this.serverChangeIntroduce(value);
                        }
                    });
                }
            },
    ], 'default', "","");
    var phoneType = navigator.userAgent;
    if (navigator.userAgent.indexOf('iPhone') > -1 || phoneType.indexOf('iPad') > -1) {
        document.getElementsByClassName('am-modal-input')[0].getElementsByTagName('input')[0].focus();
    }
    }

    schoolOnClick = () => {
        $('.updateModel').slideDown();
        $('.mask').show();
    };


    render () {
        return (
            <div id="personMsg" className='bg_white publicList_50'>
                <div className="p20"></div>
                <div className="topNav">
                    <i className='icon_back'></i>
                    完善资料
                </div>
                <div className="grayBorder"></div>
                <div className="commonLocation-cont overScroll">
                    <div  className='am-list-item am-list-item-middle line_public15 activeDiv' onClick={this.updatePhoto}>
                        <div className="am-list-line photo">
                            <div className="am-list-content">用户头像</div>
                            <img src={require('../../lookThrough/img/youyangLogo.png')} alt=""

                            />
                            <div className="am-list-arrow am-list-arrow-horizontal"></div>
                        </div>
                    </div>
                    <div className='am-list-item am-list-item-middle line_public15 activeDiv' onClick={this.changeName}>
                        <div className="am-list-line">
                            <div className="am-list-content">用户名称</div>
                            <div className="am-list-extra">
                                {/*{this.state.userName}*/}
                            </div>
                            <div className="am-list-arrow am-list-arrow-horizontal"></div>
                        </div>
                    </div>
                    <div className='am-list-item am-list-item-middle line_public15 activeDiv' onClick={this.schoolOnClick}>
                        <div className="am-list-line">
                            <div className="am-list-content">所属村子</div>
                            <div className="am-list-extra">
                                {/*{this.state.phoneNumber}*/}
                            </div>
                            <div className="am-list-arrow am-list-arrow-horizontal"></div>
                        </div>
                    </div>
                    <div className='am-list-item am-list-item-middle line_public15 activeDiv' onClick={this.schoolOnClick}>
                        <div className="am-list-line">
                            <div className="am-list-content">所属小组</div>
                            <div className="am-list-extra">

                            </div>
                            <div className="am-list-arrow am-list-arrow-horizontal"></div>
                        </div>
                    </div>
                    <div className='am-list-item am-list-item-middle line_public15 activeDiv'  onClick={this.changePhone}>
                        <div className="am-list-line">
                            <div className="am-list-content">手机号码</div>
                            <div className="am-list-extra">
                                    13333333333
                            </div>
                            <div className="am-list-arrow am-list-arrow-horizontal"></div>
                        </div>
                    </div>
                </div>
                {/*弹窗*/}
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
            </div>
        )
    }
}



