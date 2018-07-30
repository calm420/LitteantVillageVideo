import React from 'react';
import {} from 'antd-mobile';
import '../css/ReadPanel.less'

export default class ReadPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: 'app',
            open: false,
        };
    }

    componentWillMount() {

    }

    render() {
        return (
            <div id="ReadPanel">
                ReadPanel
            </div>
        );
    }
}
