import React from 'react';
import {ImagePicker, InputItem, Toast} from 'antd-mobile';
import '../css/ReadPanel.less';
import ReactQuill from 'react-quill'; // ES6
import 'react-quill/dist/quill.snow.css'; // ES6
var _this;
export default class ReadPanel extends React.Component {
    constructor(props) {
        super(props);
        var loginUserStr = sessionStorage.getItem("loginUser");
        var loginUser = JSON.parse(loginUserStr);
        _this = this;
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
            title_editor: '',  //标题
            articleInfoJson: {
                articleTitle: '未命名',
                userId: loginUser.uid,
                // userId: 3,
                schoolId: loginUser.schoolId,
                gradeId: loginUser.gradeId,
                status: 0,// 0草稿 1 发布
            },
            author: '',
            userId: loginUser.uid,
            // user:JSON.parse(sessionStorage.getItem("loginUser"))
        };
        this.handleChange = this.handleChange.bind(this)
    }

    componentDidMount() {
        var _this = this;
        //监听postmessage消息接受
        window.addEventListener('message', (e) => {
            this.onMessage(e);
        })
    }


    componentWillMount() {

    }

    //接受消息
    onMessage(e) {
        if (e.data) {
            var iframeData = JSON.parse(e.data);
            if (iframeData.method == 'submit') {
                var article = iframeData.article;
                var imageList = [];
                var attacheMents = article.attacheMents;
                var newAttachMents = [];
                for (var k in attacheMents) {
                    newAttachMents.push({
                        userId: _this.state.userId,
                        type: attacheMents[k].type == 'image' ? 0 : 1,
                        path: attacheMents[k].path,
                        coverPath: attacheMents[k].cover,
                        isCover: attacheMents[k].isMainCover,
                        articleId: _this.state.artId,
                        attachmentId: attacheMents[k].attachmentId || -1,
                    })

                    if (attacheMents[k].isMainCover) {
                        imageList.push(attacheMents[k].cover);

                    }
                }
                // refresh
                this.updateArticleInfo(article.title, article.content, article.author, article.type, imageList, newAttachMents);
            } else if (iframeData.method == 'openPrieview') {
                this.props.setPanel('openPrieview', iframeData.label);
            }else if(iframeData.method == 'exit_editor'){
                console.log('取消编辑');
                this.setState({
                    writeFlag: false
                },()=>{
                    this.props.submit('exit_editor', '000')
                })

            }
            // else if(labelData.method == 'closePrieview'){
            //     console.log('关闭遮罩层');
            //     this.props.setPanel('closePrieview')
            // }
        }

    }


    handleChange(content, delta, source, editor) {
        // console.log(editor.getContents(),'editor');
        this.setState({editorHtml: content, editor: editor});
    }


    //首先需要 吧 base64 流转换成 blob 对象，文件对象都继承它
    // getBlobBydataURI = function (dataURI, type) {
    //     var binary = atob(dataURI.split(',')[1]);
    //     var array = [];
    //     for (var i = 0; i < binary.length; i++) {
    //         array.push(binary.charCodeAt(i));
    //     }
    //     return new Blob([new Uint8Array(array)], {type: type});
    // }

    // getHTML(type) {
    //
    //
    //     // console.log(this.state.editorHtml);
    //     // return;
    //     var warn = "";
    //     if (this.state.title_editor == '') {
    //         warn = "请输入标题!"
    //     } else if ((this.state.editorHtml == '' || this.state.editorHtml == '<p><br></p>') && type == 1) {
    //         warn = "请输入内容!"
    //     } else if ((this.state.author == '') && type == 1) {
    //         warn = "请输入作者!"
    //     }
    //     if (warn != "") {
    //         Toast.info(warn);
    //         return;
    //     }
    //     var array = [];
    //     var requestArray = [];
    //     var files = this.state.files;
    //     if (this.state.editor) {
    //         array = this.state.editor.getContents().ops;
    //     }
    //
    //     console.log(files, '保存发布的方法中files')
    //     var editorArray = [], localArray = [];
    //
    //     for (var i = 0; i < files.length; i++) {
    //         console.log(files[i].url, '上传图片的路径')
    //         if (files[i].url.substring(0, 4) == 'http') {   //判断是否是线上图片
    //             localArray.push(files[i].url);
    //         } else {
    //             var $Blob = this.getBlobBydataURI(files[i].url, 'image/jpeg');
    //             var formData = new FormData();
    //             formData.append("filePath", $Blob, "file_" + Date.parse(new Date()) + ".png");
    //             requestArray.push(
    //                 new Promise(function (resolve, reject) {
    //                     $.ajax({
    //                         type: "POST",
    //                         url: "http://60.205.86.217:8890/Excoord_Upload_Server/file/upload",
    //                         enctype: 'multipart/form-data',
    //                         data: formData,
    //                         // 告诉jQuery不要去处理发送的数据
    //                         processData: false,
    //                         // 告诉jQuery不要去设置Content-Type请求头
    //                         contentType: false,
    //                         success: (responseStr) => {
    //                             // arrayImage.push(responseStr);
    //                             // console.log(arrayImage);
    //                             resolve({
    //                                 type: 'local',
    //                                 url: responseStr
    //                             });
    //                         },
    //                         error: function (responseStr) {
    //                             // console.log(responseStr);
    //                             reject("一个失败的URL");
    //                         }
    //                     });
    //                 }));
    //         }
    //
    //     }
    //
    //     for (var k = 0; k < array.length; k++) {
    //         if (array[k].insert && array[k].insert.image) {
    //             console.log(array[k].insert.image, 'html内部的图片')
    //             if (array[k].insert.image.substring(0, 4) == "http") {  //判断是否是线上图片
    //                 editorArray.push(array[k].insert.image);
    //             } else {
    //                 var $Blob = this.getBlobBydataURI(array[k].insert.image, 'image/jpeg');
    //                 var formData = new FormData();
    //                 formData.append("filePath", $Blob, "file_" + Date.parse(new Date()) + ".png");
    //                 requestArray.push(
    //                     new Promise(function (resolve, reject) {
    //                         $.ajax({
    //                             type: "POST",
    //                             url: "http://60.205.86.217:8890/Excoord_Upload_Server/file/upload",
    //                             enctype: 'multipart/form-data',
    //                             data: formData,
    //                             // 告诉jQuery不要去处理发送的数据
    //                             processData: false,
    //                             // 告诉jQuery不要去设置Content-Type请求头
    //                             contentType: false,
    //                             success: (responseStr) => {
    //                                 // arrayImage.push(responseStr);
    //                                 // console.log(arrayImage);
    //                                 resolve({
    //                                     type: 'editor',
    //                                     url: responseStr
    //                                 });
    //                             },
    //                             error: function (responseStr) {
    //                                 // console.log(responseStr);
    //                                 reject("一个失败的URL");
    //                             }
    //                         });
    //                     }));
    //             }
    //         }
    //     }
    //     // console.log(requestArray,'requestArray');
    //     Promise.all(requestArray).then((values) => {
    //         console.log(values, 'values');
    //
    //         for (var k in values) {
    //             if (values[k].type == 'local') {
    //                 localArray.push(values[k].url);
    //             } else {
    //                 editorArray.push(values[k].url);
    //             }
    //         }
    //         var i = 0;
    //         for (var k in array) {
    //             if (array[k].insert && array[k].insert.image) {
    //                 array[k].insert.image = editorArray[i];
    //                 i++;
    //             }
    //         }
    //         var QuillDeltaToHtmlConverter = require('quill-delta-to-html');
    //         var cfg = {};
    //         var converter = new QuillDeltaToHtmlConverter(array, cfg);
    //         var html = converter.convert();
    //
    //         console.log(this.state.title_editor, 'biaoti');
    //         console.log(this.state.artId, 'artId');
    //         console.log(localArray.join(','), 'localArray');
    //         console.log(html);
    //         this.updateArticleInfo(localArray.join(','), html, type);
    //     });
    // }

    updateArticleInfo(title, html, author, type, imgArray, articleAttachments) {
        var param = {
            "method": 'updateArticleInfo',
            "articleId": this.state.artId,
            "articleTitle": title,
            "articleContent": html,
            "status": type,
            "author": author,
            "articleAttachments": JSON.stringify(articleAttachments)
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                console.log(result,'result');
                if (result.success) {
                    Toast.info(type == 0 ? '保存成功' : '发布成功', 0.5)
                    this.initEditor();
                    this.props.submit(Math.abs(type - 1))
                } else {
                    Toast.fail("保存/发布失败");
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
            "articleInfoJson": this.state.articleInfoJson,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                if (result.success) {
                    //向富文本发送清空编辑器内容的要求,这里的清空只是简单的reload,延迟300 解决闪烁的问题
                    var ifm = document.getElementById('iframe_box');
                    ifm.contentWindow.postMessage(JSON.stringify({method: 'clearRichTestSign'}), '*');
                    setTimeout(function () {
                        _this.setState({
                            writeFlag: !_this.state.writeFlag,
                            artId: result.response,
                            title_editor: '未命名'
                        }, () => {
                            _this.props.submit('init', _this.state.artId)
                        })
                    }, 300)
                } else {
                    Toast.fail("创建失败");
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

    // inputChange(val) {
    //     this.setState({
    //         title_editor: val
    //     })
    // }
    //
    // inputChangeForAuthor(val) {
    //     this.setState({
    //         author: val
    //     })
    // }

    //初始化编辑框
    initEditor() {
        this.setState({
            title_editor: '未命名',
            files: [],
            editorHtml: '',
            writeFlag: false,
            artId: null,
        }, () => {
            console.warn('file状态已归为:')
            console.log(this.state.files);
        })
    }

    //接受来自list => appSystem 的消息
    accept(type, data) {
        switch (type) {
            case "编辑":
                this.getArticleInfoById(data);
                break;
            case "删除":
                if (data == this.state.artId) {
                    this.setState({
                        writeFlag: false,
                        artId: null,
                    })
                } else {
                    console.log('删除的不是编辑状态的');
                }
                break;
        }
    }

    //根据文章id获取文章
    getArticleInfoById(artId) {
        var param = {
            "method": 'getArticleInfoById',
            "articleId": artId,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                if (result.success) {
                    var attacheMents = [];

                    // console.log(result.response, '编辑的内容');
                    // var DOM = document.createElement('div');
                    // DOM.innerHTML = result.response.articleContent;
                    // var images = DOM.querySelectorAll('img');
                    // var videos = DOM.querySelectorAll('video');
                    // console.log(result.response.articleContent);
                    // for(var i=0;i < images.length;i++){
                    //     console.log($(images[i]).attr('cover'),'cover');
                    //     if($(images[i]).attr('cover')){
                    //         attacheMents.push({
                    //             type:'image',
                    //             cover:$(images[i]).attr('cover'),
                    //             path: $(images[i]).attr('src'),
                    //             isMainCover: false,
                    //         })
                    //     }
                    //
                    // }
                    // for(var j=0;j < videos.length;j++){
                    //     console.log($(videos[j]).attr('cover'),'videoCover');
                    //     if($(videos[j]).attr('cover')){
                    //         attacheMents.push({
                    //             type:'video',
                    //             cover:$(videos[j]).attr('cover'),
                    //             path: $(videos[j]).attr('src'),
                    //             isMainCover: false,
                    //         })
                    //     }
                    // }
                    //
                    // console.log(attacheMents,'attacheMents');
                    // var coverImage = result.response.articleImgs;
                    //
                    // coverImage = coverImage.split(',');
                    // console.log(coverImage,'coverImage');
                    // for(var i=0;i<coverImage.length;i++){
                    //     console.log(coverImage[i],'coverImage');
                    // }
                    // console.log(result.response.articleImgs);
                    // console.log(document.getElementById('box'));
                    //发送消息
                    var attacheMents = result.response.articleAttachments;
                    var newAttachMents = [];
                    for (var k in attacheMents) {
                        newAttachMents.push({
                            type: attacheMents[k].type == 0 ? 'image' : 'video',
                            cover: attacheMents[k].coverPath,
                            path: attacheMents[k].path,
                            isMainCover: attacheMents[k].isCover,
                            attachmentId: attacheMents[k].attachmentId,
                        })
                    }
                    var data = {};
                    data.method = 'editor';
                    data.article = {
                        title: result.response.articleTitle,
                        content: result.response.articleContent,
                        author: result.response.author,
                        type: result.response.status,
                        attacheMents: newAttachMents
                    };
                    // return;
                    //发送消息
                    var ifm = document.getElementById('iframe_box');
                    ifm.contentWindow.postMessage(JSON.stringify(data), '*');
                    var res = result.response;
                    // var images = result.response.articleImgArray;
                    // var file = [];
                    // console.log(images, 'images')
                    // if (images) {
                    //     console.log('进入images循环')
                    //     for (var i = 0; i < images.length; i++) {
                    //         file.push({url: images[i]});
                    //         console.log('运行了' + (i + 1) + "次")
                    //     }
                    // }
                    //
                    // console.log(file, 'file');
                    // // console.log(data,'根据id获取文章')
                    this.setState({
                        writeFlag: true,
                        artId: res.articleId
                    })
                } else {
                    Toast.fail("获取文章失败");
                }
            },
            onError: function (error) {
                Toast.fail(error, 1);
            }
        });

    }


    render() {
        const {files} = this.state;
        return (
            <div id="ReadPanel">
                <div className="click_head" style={!this.state.writeFlag ? {display: 'block'} : {display: "none"}}>
                    点击 "<a onClick={this.changeWrite.bind(this)}>写文章</a>"，创建一篇新文章
                </div>
                <div className="write_article_cont" style={{display: 'none'}}>
                    <div className="empty_draft empty_center"><span>暂无草稿</span></div>
                </div>
                <div className="write_article" style={this.state.writeFlag ? {display: 'block'} : {display: "none"}}>
                    <div className="write_article_cont">
                        {/*<div className="headBox">*/}
                        {/*<div className="title">*/}
                        {/*<InputItem*/}
                        {/*clear*/}
                        {/*placeholder="请输入标题"*/}
                        {/*onChange={this.inputChange.bind(this)}*/}
                        {/*value={this.state.title_editor}*/}
                        {/*></InputItem>*/}
                        {/*</div>*/}
                        {/*<div className="image">*/}
                        {/**/}
                        {/*<div style={files.length > 0 ? {height: '100%'} : {height: 110}}>*/}
                        {/*<ImagePicker*/}
                        {/*files={files}*/}
                        {/*onChange={this.onChange}*/}
                        {/*onImageClick={(index, fs) => console.log(index, fs)}*/}
                        {/*multiple={false}*/}
                        {/*selectable={files.length < 1}*/}
                        {/*accept="image/gif,image/jpeg,image/jpg,image/png"*/}
                        {/*/>*/}
                        {/*</div>*/}
                        {/*<div className="img_text"*/}
                        {/*style={files.length > 0 ? {display: 'none'} : {display: "block"}}>请添加新闻列表页展示图(支持jpg*/}
                        {/*,png图片)*/}
                        {/*</div>*/}
                        {/*</div>*/}
                        {/*</div>*/}
                        {/*<div className="author">*/}
                        {/*<InputItem*/}
                        {/*clear*/}
                        {/*placeholder="请输入作者姓名"*/}
                        {/*onChange={this.inputChangeForAuthor.bind(this)}*/}
                        {/*value={this.state.author}*/}
                        {/*></InputItem>*/}
                        {/*</div>*/}
                        <div className="edit_cont">
                            {/*<ReactQuill*/}
                            {/*placeholder="请输入正文"*/}
                            {/*theme={this.state.theme}*/}
                            {/*onChange={this.handleChange}*/}
                            {/*value={this.state.editorHtml}*/}
                            {/*modules={this.state.modules}*/}
                            {/*formats={this.state.formats}*/}
                            {/*bounds={'.app'}*/}
                            {/*/>*/}

                            {/*<iframe id="iframe_box" src="https://192.168.50.186:6443/richText/" frameborder="0">*/}
                            <iframe id="iframe_box" src="https://www.maaee.com:6443/richText/" frameborder="0">
                            </iframe>

                            {/*<iframe id="iframe_box" src="https://www.maaee.com:6443/richText/"
                                    frameborder="0"></iframe>*/}

                        </div>
                    </div>
                    {/*<div className="edit_btn">*/}
                    {/*<div className="edit_btn_cont">*/}
                    {/*<button onClick={this.getHTML.bind(this, 0)} className="Preview">保存</button>*/}
                    {/*<button onClick={this.getHTML.bind(this, 1)} className="publish">发布</button>*/}
                    {/*</div>*/}

                    {/*</div>*/}
                </div>


            </div>
        );
    }
}
