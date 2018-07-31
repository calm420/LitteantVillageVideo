import React from 'react';
import {
    Toast, DatePicker, ListView, Button, List, Picker, Tag
} from 'antd-mobile';
import '../css/articleDetail.less';

export default class articleDetail extends React.Component {

    constructor(props) {
        super(props);
        this.initDataSource = [];
        this.state = {
            data:{

            }
        }
    }

    componentDidMount() {
        Bridge.setShareAble("false");
        document.title = '校园自媒体';
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var schoolId = searchArray[0].split('=')[1];
        this.setState({
            userId: schoolId
        }, () => {
            this.getArticleInfoById();
        })

    }


    /**
     * 按文章id获取详情信息
     * **/
    getArticleInfoById() {
        var param = {
            "method": 'getArticleInfoById',
            "articleId": this.state.userId,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                console.log(result);
                if (result.success) {
                    this.setState({
                        data: result.response
                    })
                    //文章阅读量+1
                    this.addArticleReadCount()
                }
            },
            onError: function (error) {
                Toast.fail(error, 1);
            }
        });
    }


    /**
     * 阅读量+1
     * **/
    addArticleReadCount() {
        var param = {
            "method": 'addArticleReadCount',
            "articleId": this.state.userId,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                // console.log(result);
                if (result.success) {
                    //文章阅读量+1
                }else{
                    Toast.info('+1?');
                }
            },
            onError: function (error) {
                Toast.fail(error, 1);
            }
        });
    }


    render() {
        // var articleContent = this.state.data.articleContent
        return (
            <div id="articleDetail" style={{
                height: document.body.clientHeight
            }}>
                <div className="title">{this.state.data.articleTitle}</div>
                <div className="at">
                    <div className="author">作者: {this.state.data.articleTitle}</div>
                    <div className="createTime">{WebServiceUtil.formatYMD(this.state.data.createTime)}</div>
                </div>
                <div className="content" dangerouslySetInnerHTML={{__html:this.state.data.articleContent}}>
                </div>
            </div>
        );
    }

}