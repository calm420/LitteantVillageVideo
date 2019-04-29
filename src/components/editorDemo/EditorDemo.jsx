import React from 'react';
import ReactQuill from 'react-quill'; // ES6
import 'react-quill/dist/quill.snow.css'; // ES6
import QuillDeltaToHtmlConverter from 'quill-delta-to-html';

export default class EditorDemo extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            editorHtml: '',
            theme: 'snow',
            modules: {
                toolbar: [
                    [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                    [{ size: [] }],
                    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                    [{ 'list': 'ordered' }, { 'list': 'bullet' },
                    { 'indent': '-1' }, { 'indent': '+1' }],
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
            ]

        }
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange (content, delta, source, editor) {
        // console.log(editor.getContents(),'editor');
        this.setState({ editorHtml: content, editor: editor });
    }


    //首先需要 吧 base64 流转换成 blob 对象，文件对象都继承它
    getBlobBydataURI = function (dataURI, type) {
        var binary = atob(dataURI.split(',')[1]);
        var array = [];
        for (var i = 0; i < binary.length; i++) {
            array.push(binary.charCodeAt(i));
        }
        return new Blob([new Uint8Array(array)], { type: type });
    }

    getHTML () {
        if (this.state.editor) {
            console.log(this.state.editor.getContents());
            var array = this.state.editor.getContents().ops;
            var requestArray = [];
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
                                    resolve(responseStr);
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
                var i = 0;
                for (var k in array) {
                    if (array[k].insert && array[k].insert.image) {
                        array[k].insert.image = values[i];
                    }
                }
                var QuillDeltaToHtmlConverter = require('quill-delta-to-html');
                var cfg = {};
                var converter = new QuillDeltaToHtmlConverter(array, cfg);
                var html = converter.convert();

                console.log(html);
            });
        } else {
            console.log('未编辑内容')
        }
    }

   

    render () {
        return (
            <div>
                <ReactQuill
                    theme={this.state.theme}
                    onChange={this.handleChange}
                    value={this.state.editorHtml}
                    modules={this.state.modules}
                    formats={this.state.formats}
                    bounds={'.app'}
                />
                <button onClick={this.getHTML.bind(this)}>提交</button>
            </div>
        );
    }

}