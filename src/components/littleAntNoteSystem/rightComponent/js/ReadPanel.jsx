import React from 'react';
import {ImagePicker, InputItem, Toast} from 'antd-mobile';
import '../css/ReadPanel.less';
import ReactQuill from 'react-quill'; // ES6
import 'react-quill/dist/quill.snow.css'; // ES6
export default class ReadPanel extends React.Component {
    constructor(props) {
        super(props);
        var loginUserStr = sessionStorage.getItem("loginUser");
        var loginUser = JSON.parse(loginUserStr);
        this.state = {
            title: 'app',
            open: false,
            editorHtml: '',
            theme: 'snow',
            modules: {
                toolbar: [
                    [{'header': '1'}, {'header': '2'}, {'font': []}],
                    [{size: []}],
                    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                    [{'list': 'ordered'}, {'list': 'bullet'},
                        {'indent': '-1'}, {'indent': '+1'}],
                    ['link', 'image', 'video'],
                    ['clean']
                ],
                clipboard: {
                    // toggle to add extra line breaks when pasting HTML:
                    matchVisual: false,
                }
            },
            formats: [
                'header', 'font', 'size',
                'bold', 'italic', 'underline', 'strike', 'blockquote',
                'list', 'bullet', 'indent',
                'link', 'image', 'video'
            ],
            writeFlag: false,
            files: [], //图片数组
            title: '',  //标题
            user: {
                articleTitle: 'wei ming ming',
                userId: loginUser.colUid,
                schoolId: 1,
                gradeId: 1,
                status: 0,// 0草稿 1 发布
            }
        };
        this.handleChange = this.handleChange.bind(this)
    }

    componentWillMount() {

    }

    handleChange(content, delta, source, editor) {
        // console.log(editor.getContents(),'editor');
        this.setState({editorHtml: content, editor: editor});
    }


    //首先需要 吧 base64 流转换成 blob 对象，文件对象都继承它
    getBlobBydataURI = function (dataURI, type) {
        var binary = atob(dataURI.split(',')[1]);
        var array = [];
        for (var i = 0; i < binary.length; i++) {
            array.push(binary.charCodeAt(i));
        }
        return new Blob([new Uint8Array(array)], {type: type});
    }

    getHTML(type) {
        var warn = "";
        if (this.state.title == '') {
            warn = "biaoti!!!!!"
        } else if (this.state.files.length <= 0) {
            warn = "tupian!!!!!"
        }
        if (warn != "") {
            Toast.info(warn);
            return;
        }
        var array = this.state.editor.getContents().ops;
        var requestArray = [];
        var files = this.state.files;
        // this.props.submit('123aswdfg')
        for(var k in files){
            var $Blob = this.getBlobBydataURI(files[k].url, 'image/jpeg');
            var formData = new FormData();
            formData.append("filePath", $Blob, "file_" + Date.parse(new Date()) + ".png");
            requestArray.push(
                new Promise(function (resolve, reject) {
                    $.ajax({
                        type: "POST",
                        url: "http://60.205.86.217:8890/Excoord_Upload_Server/file/upload",
                        enctype: 'multipart/form-data',
                        data: formData,
                        // 告诉jQuery不要去处理发送的数据
                        processData: false,
                        // 告诉jQuery不要去设置Content-Type请求头
                        contentType: false,
                        success: (responseStr) => {
                            // arrayImage.push(responseStr);
                            // console.log(arrayImage);
                            resolve({
                                type:'local',
                                url:responseStr
                            });
                        },
                        error: function (responseStr) {
                            // console.log(responseStr);
                            reject("一个失败的URL");
                        }
                    });
                }));
        }

        // return;
        // console.log(this.state.editor.getContents());

        for (var k in array) {
            if (array[k].insert && array[k].insert.image) {
                var $Blob = this.getBlobBydataURI(array[k].insert.image, 'image/jpeg');
                var formData = new FormData();
                formData.append("filePath", $Blob, "file_" + Date.parse(new Date()) + ".png");
                requestArray.push(
                    new Promise(function (resolve, reject) {
                        $.ajax({
                            type: "POST",
                            url: "http://60.205.86.217:8890/Excoord_Upload_Server/file/upload",
                            enctype: 'multipart/form-data',
                            data: formData,
                            // 告诉jQuery不要去处理发送的数据
                            processData: false,
                            // 告诉jQuery不要去设置Content-Type请求头
                            contentType: false,
                            success: (responseStr) => {
                                // arrayImage.push(responseStr);
                                // console.log(arrayImage);
                                resolve({
                                    type:'editor',
                                    url:responseStr
                                });
                            },
                            error: function (responseStr) {
                                // console.log(responseStr);
                                reject("一个失败的URL");
                            }
                        });
                    }));
            }
        }
        // console.log(requestArray,'requestArray');
        Promise.all(requestArray).then((values) => {
            console.log(values,'values');
            var editorArray = [],localArray = [];
            for(var k in values){
                if(values[k].type == 'local'){
                    localArray.push(values[k].url);
                }else{
                    editorArray.push(values[k].url);
                }
            }
            var i = 0;
            for (var k in array) {
                if (array[k].insert && array[k].insert.image) {
                    array[k].insert.image = editorArray[i];
                    i++;
                }
            }
            var QuillDeltaToHtmlConverter = require('quill-delta-to-html');
            var cfg = {};
            var converter = new QuillDeltaToHtmlConverter(array, cfg);
            var html = converter.convert();

            console.log(this.state.title, 'biaoti');
            console.log(this.state.artId, 'artId');
            console.log(localArray.join(','),'localArray');
            console.log(html);
            this.updateArticleInfo(localArray.join(','),html,type);
        });
    }

    updateArticleInfo(imgArray,html,type){
        var param = {
            "method": 'updateArticleInfo',
            "articleId": this.state.artId,
            "articleTitle": this.state.title,
            "articleImgs": imgArray,
            "articleContent": html,
            "status": type,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                console.log(result,'updateArticleInfo')
                if (result.success) {

                } else {
                    Toast.fail("chaungjianshibai");
                }
            },
            onError: function (error) {
                Toast.fail(error, 1);
            }
        });
    }


    changeWrite() {
        var param = {
            "method": 'saveArticleInfo',
            "articleInfoJson": this.state.user,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                console.log(result)
                if (result.success) {
                    this.setState({
                        writeFlag: !this.state.writeFlag,
                        artId: result.response,
                    }, () => {
                        this.props.submit('init')
                    })
                } else {
                    Toast.fail("chaungjianshibai");
                }
            },
            onError: function (error) {
                Toast.fail(error, 1);
            }
        });

    }

    onChange = (files, type, index) => {
        // console.log(files);
        this.setState({
            files,
        });
    }

    inputChange(val) {
        this.setState({
            title: val
        })
    }

    render() {
        const {files} = this.state;
        return (
            <div id="ReadPanel">
                <div style={!this.state.writeFlag ? {display: 'inline-block'} : {display: "none"}}>
                    点击 <a onClick={this.changeWrite.bind(this)}>写文章</a>
                </div>
                <div style={this.state.writeFlag ? {display: 'inline-block'} : {display: "none"}}>
                    <div className="headBox">
                        <div className="title">
                            <InputItem
                                clear
                                placeholder="请输入标题"
                                onChange={this.inputChange.bind(this)}
                                value={this.state.title}
                            ></InputItem>
                            {/*<input type="text" onChange={this.inputChange.bind(this)} value={this.state.title} placeholder="请输入标题"/>*/}
                        </div>
                        <div className="image">
                            {/*<img*/}
                            {/*src="https://dxlfb468n8ekd.cloudfront.net/gsc/ICCVKO/13/ad/59/13ad5999c49548458440bfe7353f49c9/images/page3/u92.png?token=0121f9711e3571df8e85906ef4bd8f15"*/}
                            {/*alt=""/>*/}
                            {/*<div>*/}
                            <ImagePicker
                                files={files}
                                onChange={this.onChange}
                                onImageClick={(index, fs) => console.log(index, fs)}
                                selectable={files.length < 3}
                                accept="image/gif,image/jpeg,image/jpg,image/png"
                            />
                            {/*</div>*/}
                        </div>
                    </div>
                    <div>
                        <ReactQuill
                            theme={this.state.theme}
                            onChange={this.handleChange}
                            value={this.state.editorHtml}
                            modules={this.state.modules}
                            formats={this.state.formats}
                            bounds={'.app'}
                        />
                        <button onClick={this.getHTML.bind(this, 0)}>保存</button>
                        <button onClick={this.getHTML.bind(this, 1)}>发布</button>
                    </div>
                </div>


            </div>
        );
    }
}
