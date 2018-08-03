import React from 'react';
import {Button, Toast, InputItem, Icon, Modal} from 'antd-mobile';
import '../css/addUploadMusic.less'

var addMusicList;
const alert = Modal.alert;

export default class addUploadMusic extends React.Component {
    constructor(props) {
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var uid = locationSearch.split("&")[0].split("=")[1];
        super(props);
        addMusicList = this;
        this.state = {
            clientHeight: document.body.clientHeight,
            addMusicList: [{
                musicUrl: '',
                cover: '',
                musicName: '',
                musicMan: '',
                userId: uid
            }]
        };
    }

    componentDidMount() {
        document.title = '添加音乐'
        Bridge.setShareAble("false");
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var uid = locationSearch.split("&")[0].split("=")[1];
        this.setState({"uid": uid});
        this.buildAddList()
    }

    /**
     * 封面预览
     */
    imgPreview(src) {
        var dataObj = {};
        dataObj.method = 'showImage';
        dataObj.url = src;
        dataObj.currentUrl = src;
        Bridge.callHandler(dataObj, null, function (error) {
            console.log(error);
        })
    }

    /**
     * mp3预览
     */
    mp3Preview(v) {

        var data = {
            method: 'playAudio',
            url: v.musicUrl
        };
        Bridge.callHandler(data, null, function (error) {

        });
    }

    /**
     * 封面上传
     */
    uploadImage(index, event) {
        event.stopPropagation()
        var data = {
            method: 'selectImages',
        };
        Bridge.callHandler(data, function (res) {
            // 拿到照片地址,显示在页面等待上传
            let newArr = {};
            let item = res.split("?");
            newArr.picPath = item[0],
                newArr.picName = item[1].split("=")[1]

            addMusicList.state.addMusicList[index].cover = newArr.picPath

            addMusicList.buildAddList()

        }, function (error) {
            console.log(error);
        });
    }

    /**
     * 音乐上传
     */
    uploadMp3(index, event) {
        event.stopPropagation()
        var data = {
            method: 'selectMp3',
        };
        Bridge.callHandler(data, function (res) {
            // 拿到照片地址,显示在页面等待上传
            let newArr = {};
            let item = res.split("?");
            newArr.picPath = item[0],
                newArr.picName = item[1].split("=")[1]

            addMusicList.state.addMusicList[index].musicUrl = newArr.picPath

            addMusicList.buildAddList()

        }, function (error) {
            console.log(error);
        });
    }

    /**
     * 根据数据数组构建批量上传列表
     */
    buildAddList() {
        var listArr = this.state.addMusicList
        var arr = [];
        listArr.forEach(function (v, i) {
            arr.push(<div className="listCont">
                {/*删除按钮*/}
                <div className="icon_delete" onClick={addMusicList.showListAlert.bind(this, i)}
                     style={{display: listArr.length == 1 ? 'none' : 'block'}}></div>

                <div>
                    <InputItem
                        className="add_element"
                        placeholder="请输入歌曲名称"
                        value={addMusicList.state.addMusicList[i].musicName}
                        onChange={addMusicList.inputOnChange.bind(this, 'musicName', i)}
                    >
                        <div>歌曲名称</div>
                    </InputItem>
                </div>
                <div className="line_public flex_container"></div>
                <div>
                    <InputItem
                        className="add_element"
                        placeholder="请输入歌手名称"
                        value={addMusicList.state.addMusicList[i].musicMan}
                        onChange={addMusicList.inputOnChange.bind(this, 'musicMan', i)}
                    >
                        <div>歌手名称</div>
                    </InputItem>
                </div>
                <div className="line_public flex_container"></div>
                <div className="my_flex sameBack">
                    <span className="textTitle">上传封面
                        <p style={{margin: 0, height: 5}}></p>
                        <span className="uploadSupport">(jpg格式)</span>
                    </span>
                    {addMusicList.state.addMusicList[i].cover.length == 0 ?
                        <button className="uploadBtn" onClick={addMusicList.uploadImage.bind(this, i)}>上传封面</button>
                        :
                        <div className="upload_file">
                            <img onClick={addMusicList.imgPreview.bind(this, addMusicList.state.addMusicList[i].cover)}
                                 className="imgTag" src={addMusicList.state.addMusicList[i].cover}/>
                            <div className="icon_pointer" onClick={addMusicList.uploadImage.bind(this, i)}>修改</div>
                        </div>

                    }

                </div>
                <div className="line_public flex_container"></div>
                <div className="my_flex sameBack">
                    <span className="textTitle">上传音乐
                        <p style={{margin: 0, height: 5}}></p>
                        <span className="uploadSupport">(MP3格式)</span>
                    </span>
                    {addMusicList.state.addMusicList[i].musicUrl.length == 0 ?
                        <button className="uploadBtn" onClick={addMusicList.uploadMp3.bind(this, i)}>上传音乐</button>
                        :
                        <div className="upload_file">
                            <div onClick={addMusicList.mp3Preview.bind(this, addMusicList.state.addMusicList[i])}
                                 className="musicIcon"/>
                            <div className="icon_pointer" onClick={addMusicList.uploadMp3.bind(this, i)}>修改</div>
                        </div>

                    }
                </div>
            </div>)
        })
        this.setState({addListArr: arr})
    }

    /**
     * 输入框改变的回调
     * @param type  musicName=歌名  musicMan=歌手
     * @param index
     * @param value
     */
    inputOnChange = (type, index, value) => {
        if (type == 'musicName') {
            addMusicList.state.addMusicList[index].musicName = value
        } else if (type == 'musicMan') {
            addMusicList.state.addMusicList[index].musicMan = value
        }
        addMusicList.buildAddList()
    }

    /**
     * 添加音乐项
     */
    addList = () => {
        if (this.state.addMusicList.length == 10) {
            Toast.fail('最大只允许一次上传十个音乐', 2)
            return
        }
        this.state.addMusicList.push({
            musicUrl: '',
            cover: '',
            musicName: '',
            musicMan: '',
            userId: addMusicList.state.uid
        })
        this.buildAddList()
    }

    /**
     * 删除音乐model
     * @param src
     * @param id
     * @param event
     */
    showListAlert = (v) => {

        var phoneType = navigator.userAgent;
        var phone;
        if (phoneType.indexOf('iPhone') > -1 || phoneType.indexOf('iPad') > -1) {
            phone = 'ios'
        } else {
            phone = 'android'
        }
        var _this = this;
        const alertInstance = alert('您确定移除吗?', '', [
            {text: '取消', onPress: () => console.log('cancel'), style: 'default'},
            {text: '确定', onPress: () => _this.delList(v)},

        ], phone);
    }

    /**
     * 删除音乐项
     * @param index
     * @returns {function()}
     */
    delList(index) {
        this.state.addMusicList.splice(index, 1);
        this.buildAddList()
    }

    /**
     * 保存音乐信息
     */
    batchVideoMusic() {
        var submitFlag = true;
        var listArr = addMusicList.state.addMusicList

        for (var i = 0; i < listArr.length; i++) {
            if (listArr[i].cover.length == 0 || listArr[i].musicUrl.length == 0 || listArr[i].musicName.length == 0 || listArr[i].musicMan.length == 0) {
                submitFlag = false
                break
            }
        }

        if (!submitFlag) {
            Toast.fail('存在空值请检查', 2)
            return
        }

        /*listArr.forEach(function (v, i) {
            if (v.musicName.length == 0) {
                v.musicName = '未知'
            }
            if (v.musicMan.length == 0) {
                v.musicMan = '未知'
            }
        })*/

        console.log(listArr);

        var param = {
            "method": 'batchVideoMusic',
            "videoMusicsJson": JSON.stringify(listArr),
        };

        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' && result.success == true) {

                    Toast.success('成功');
                    //关闭当前窗口，并刷新上一个页面
                    var data = {
                        method: 'finishForRefresh',
                    };
                    Bridge.callHandler(data, null, function (error) {
                        console.log(error);
                    });
                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });
    }

    render() {
        return (
            <div id="addUploadMusic" style={{height: this.state.clientHeight}}>
                <div className="addList">
                    {this.state.addListArr}
                    <div className="addBtn sameBack" onClick={this.addList}>
                        <span>添加音乐<Icon type="plus"/></span>
                    </div>
                </div>

                <div className='submitBtn'>
                    <Button type="warning" onClick={this.batchVideoMusic}>提交</Button>
                </div>
            </div>
        );
    }
}
