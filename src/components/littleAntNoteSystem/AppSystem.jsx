import React from 'react';
import {Drawer, NavBar} from 'antd-mobile';
import './AppSystem.less'
import List from './leftComponent/js/List'
import ReadPanel from './rightComponent/js/ReadPanel'


export default class AppSystem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: 'app',
            open: false,

        };
    }

    componentWillMount() {
        //mobile项目全局禁用原生下拉刷新
        Bridge.setRefreshAble("false");

    }

    submit = (q) => {
        this.refs.listByNoom.dong(q)
    }

    render() {
        return (
            <div id="AppSystem">
                {/*顶部banner*/}

                <NavBar>会员</NavBar>

                <div id='main'>
                    <div className="left">
                        <List
                            ref='listByNoom'
                        />
                    </div>
                    <div className="right">
                        <ReadPanel
                            submit={this.submit}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
