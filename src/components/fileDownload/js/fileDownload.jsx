import React from 'react';
import {} from 'antd-mobile';
import '../css/fileDownload.less'

export default class Demo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var fileType = searchArray[0].split('=')[1]
        console.log(fileType);
    }

    render() {
        return (
            <div id='fileDownload'>123</div>
        );
    }
}


