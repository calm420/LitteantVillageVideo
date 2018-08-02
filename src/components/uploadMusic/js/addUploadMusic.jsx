import React from 'react';
import {Button, Toast, InputItem} from 'antd-mobile';
import '../css/addUploadMusic.less'

var addMusicList;

export default class addUploadMusic extends React.Component {
    constructor(props) {
        super(props);
        addMusicList = this;
        this.state = {
            clientHeight: document.body.clientHeight,
            addMusicList: [{
                musicUrl: '',
                cover: '',
                musicName: '',
                musicMan: '',
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
    imgPreview() {

    }

    /**
     * 封面上传
     */
    uploadImage() {

    }

    /**
     * 根据数据数组构建批量上传列表
     */
    buildAddList() {
        var listArr = this.state.addMusicList
        var arr = [];
        listArr.forEach(function (v, i) {
            arr.push(<div>
                <div>
                    <span className="textTitle">上传封面:
                        <p style={{margin: 0, height: 5}}></p>
                        <span className="uploadSupport">(jpg格式)</span>
                    </span>
                    {addMusicList.state.addMusicList[i].cover.length == 0 ?
                        <button className="uploadBtn" onClick={addMusicList.uploadImage.bind(this, i)}>上传封面</button>
                        :
                        <div className="upload_file">
                            <img onClick={addMusicList.imgPreview.bind(this, addMusicList.state.addMusicList[i])}
                                 className="imgTag" src={addMusicList.state.addMusicList[i].cover}/>
                            <div className="icon_pointer" onClick={addMusicList.uploadImage.bind(this, i)}>修改</div>
                        </div>

                    }

                </div>
                <div>
                    <span className="textTitle">上传音乐:
                        <p style={{margin: 0, height: 5}}></p>
                        <span className="uploadSupport">(MP3格式)</span>
                    </span>
                    {addMusicList.state.addMusicList[i].cover.length == 0 ?
                        <button className="uploadBtn" onClick={addMusicList.uploadImage.bind(this, i)}>上传音乐</button>
                        :
                        <div className="upload_file">
                            <img onClick={addMusicList.imgPreview.bind(this, addMusicList.state.addMusicList[i])}
                                 className="imgTag"/>
                            <div className="icon_pointer" onClick={addMusicList.uploadImage.bind(this, i)}>修改</div>
                        </div>

                    }
                </div>
                <div>
                    <InputItem
                        className="add_element"
                        placeholder="请输入音乐名"
                        // value={v.pageNoValue}
                        // onChange={_this.inputOnChange.bind(this, i)}
                    >
                        <div>音乐:</div>
                    </InputItem>
                </div>
                <div>
                    <InputItem
                        className="add_element"
                        placeholder="请输入歌手名"
                        // value={v.pageNoValue}
                        // onChange={_this.inputOnChange.bind(this, i)}
                    >
                        <div>歌手:</div>
                    </InputItem>
                </div>
            </div>)
        })
        this.setState({addListArr: arr})
    }

    /**
     * 保存音乐信息
     */
    batchVideoMusic() {
        // public boolean batchVideoMusic(String videoMusicsJson) throws Exception
    }

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
        })
        this.buildAddList()
    }

    render() {
        return (
            <div id="addUploadMusic" style={{height: this.state.clientHeight}}>
                <div className="addList">
                    {this.state.addListArr}
                    <div onClick={this.addList}>增加</div>
                </div>

                <div className='submitBtn'>
                    <Button type="warning" onClick={this.batchVideoMusic}>提交</Button>
                </div>
            </div>
        );
    }
}
