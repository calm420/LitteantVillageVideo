import React from 'react';
import {Tabs} from 'antd-mobile';
import '../css/List.less'

const tabs = [
    {title: '已发布'},
    {title: '草稿箱'},
];

export default class List extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    componentWillMount() {

    }

    onChange(key, index) {
        console.log(key);
        console.log(index);
    }

    render() {
        return (
            <div id="List">
                <Tabs tabs={tabs}
                      initalPage={0}
                      swipeable={false}
                      animated={false}
                      useOnPan={false}
                      onChange={this.onChange}
                >
                    <div>1</div>
                    <div>2</div>
                </Tabs>
            </div>
        );
    }
}
